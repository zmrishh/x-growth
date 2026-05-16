import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAnthropicClient, ImageBlock } from "@/lib/ai/client";
import {
  REPLY_INTELLIGENCE_SYSTEM_PROMPT,
  buildReplyUserPrompt,
} from "@/lib/ai/prompts/reply";
import { ReplyIntelligenceSchema } from "@/lib/ai/schemas/reply";
import { AI_MODEL_REPLY, MAX_REPLY_IMAGES, MAX_IMAGE_BYTES } from "@/constants/models";
import { sanitizeInput } from "@/lib/utils/format";
import Anthropic from "@anthropic-ai/sdk";

const SUPPORTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;

type SupportedMimeType = (typeof SUPPORTED_MIME_TYPES)[number];

function isSupportedMime(mime: string): mime is SupportedMimeType {
  return SUPPORTED_MIME_TYPES.includes(mime as SupportedMimeType);
}

const RequestSchema = z.object({
  textContext: z.string().max(4000).default(""),
  images: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        base64: z.string(),
        sizeBytes: z.number().max(MAX_IMAGE_BYTES),
      })
    )
    .max(MAX_REPLY_IMAGES)
    .default([]),
  replyLength: z.enum(["short", "medium", "long"]).default("medium"),
});

function extractJSON(raw: string): unknown {
  // Try JSON fence first
  const fenceMatch = raw.match(/```json\s*([\s\S]*?)\s*```/);
  if (fenceMatch) {
    try { return JSON.parse(fenceMatch[1]); } catch {}
  }

  // Try direct brace extraction
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end !== -1) {
    try { return JSON.parse(raw.slice(start, end + 1)); } catch {}
  }

  throw new Error(
    `AI returned unparseable output. First 500 chars: ${raw.slice(0, 500)}`
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request: " + parsed.error.message, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const { textContext, images, replyLength } = parsed.data;

    if (!textContext.trim() && images.length === 0) {
      return NextResponse.json(
        { error: "Provide at least a text context or one image.", code: "NO_INPUT" },
        { status: 400 }
      );
    }

    const sanitizedText = sanitizeInput(textContext);
    const textPrompt = buildReplyUserPrompt(sanitizedText, images.length > 0, replyLength);
    const client = getAnthropicClient();

    let rawText: string;

    if (images.length > 0) {
      const imageBlocks: Anthropic.ImageBlockParam[] = [];

      for (const img of images) {
        if (!isSupportedMime(img.type)) {
          return NextResponse.json(
            {
              error: `Unsupported image type: ${img.type}. Use JPEG, PNG, GIF, or WebP.`,
              code: "UNSUPPORTED_MIME",
            },
            { status: 400 }
          );
        }
        const base64Clean = img.base64.includes(",")
          ? img.base64.split(",")[1]
          : img.base64;

        imageBlocks.push({
          type: "image",
          source: {
            type: "base64",
            media_type: img.type as SupportedMimeType,
            data: base64Clean,
          },
        });
      }

      const response = await client.messages.create({
        model: AI_MODEL_REPLY,
        max_tokens: 8192,
        system: REPLY_INTELLIGENCE_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              ...imageBlocks,
              { type: "text", text: textPrompt },
            ],
          },
        ],
      });

      rawText = response.content[0].type === "text" ? response.content[0].text : "";
    } else {
      const response = await client.messages.create({
        model: AI_MODEL_REPLY,
        max_tokens: 8192,
        system: REPLY_INTELLIGENCE_SYSTEM_PROMPT,
        messages: [{ role: "user", content: textPrompt }],
      });

      rawText = response.content[0].type === "text" ? response.content[0].text : "";
    }

    const parsed2 = extractJSON(rawText);
    const validated = ReplyIntelligenceSchema.safeParse(parsed2);

    if (!validated.success) {
      console.error("[/api/reply-intelligence] Schema validation failed:", validated.error.message);
      console.error("[/api/reply-intelligence] Raw (first 1000):", rawText.slice(0, 1000));
      return NextResponse.json(
        {
          error: `AI response validation failed: ${validated.error.message}`,
          code: "SCHEMA_VALIDATION_ERROR",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(validated.data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/reply-intelligence]", message);
    return NextResponse.json(
      { error: message, code: "REPLY_FAILED" },
      { status: 500 }
    );
  }
}
