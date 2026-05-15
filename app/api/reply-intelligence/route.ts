import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callClaudeMultimodal, callClaude, ImageBlock } from "@/lib/ai/client";
import {
  REPLY_INTELLIGENCE_SYSTEM_PROMPT,
  buildReplyUserPrompt,
} from "@/lib/ai/prompts/reply";
import { ReplyIntelligenceSchema } from "@/lib/ai/schemas/reply";
import { AI_MODEL_REPLY, MAX_REPLY_IMAGES, MAX_IMAGE_BYTES } from "@/constants/models";
import { sanitizeInput } from "@/lib/utils/format";

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
});

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

    const { textContext, images } = parsed.data;

    if (!textContext.trim() && images.length === 0) {
      return NextResponse.json(
        { error: "Provide at least a text context or one image.", code: "NO_INPUT" },
        { status: 400 }
      );
    }

    const sanitizedText = sanitizeInput(textContext);
    const textPrompt = buildReplyUserPrompt(sanitizedText, images.length > 0);

    let result;

    if (images.length > 0) {
      const validImages: ImageBlock[] = [];

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

        validImages.push({ base64: base64Clean, mediaType: img.type });
      }

      result = await callClaudeMultimodal({
        model: AI_MODEL_REPLY,
        system: REPLY_INTELLIGENCE_SYSTEM_PROMPT,
        textPrompt,
        images: validImages,
        schema: ReplyIntelligenceSchema,
        maxTokens: 6000,
      });
    } else {
      result = await callClaude({
        model: AI_MODEL_REPLY,
        system: REPLY_INTELLIGENCE_SYSTEM_PROMPT,
        user: textPrompt,
        schema: ReplyIntelligenceSchema,
        maxTokens: 6000,
      });
    }

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/reply-intelligence]", message);
    return NextResponse.json(
      { error: message, code: "REPLY_FAILED" },
      { status: 500 }
    );
  }
}
