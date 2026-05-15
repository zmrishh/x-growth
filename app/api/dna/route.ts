import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callClaude } from "@/lib/ai/client";
import { DNA_SYSTEM_PROMPT, buildDNAUserPrompt } from "@/lib/ai/prompts/simulate";
import { CreatorDNASchema } from "@/lib/ai/schemas/simulate";
import { AI_MODEL, MAX_INPUT_CHARS } from "@/constants/models";
import { sanitizeInput } from "@/lib/utils/format";

const RequestSchema = z.object({
  posts: z.string().min(1).max(MAX_INPUT_CHARS * 3),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const posts = sanitizeInput(parsed.data.posts);
    const result = await callClaude({
      model: AI_MODEL,
      system: DNA_SYSTEM_PROMPT,
      user: buildDNAUserPrompt(posts),
      schema: CreatorDNASchema,
      maxTokens: 2048,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/dna]", message);
    return NextResponse.json(
      { error: message, code: "DNA_FAILED" },
      { status: 500 }
    );
  }
}
