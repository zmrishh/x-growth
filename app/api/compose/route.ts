import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callClaude } from "@/lib/ai/client";
import { COMPOSER_SYSTEM_PROMPT, buildComposerUserPrompt } from "@/lib/ai/prompts/composer";
import { ComposerResponseSchema } from "@/lib/ai/schemas/composer";
import { AI_MODEL, MAX_INPUT_CHARS } from "@/constants/models";
import { sanitizeInput } from "@/lib/utils/format";

const RequestSchema = z.object({
  idea: z.string().min(1).max(MAX_INPUT_CHARS),
  context: z.string().max(500).optional(),
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

    const idea = sanitizeInput(parsed.data.idea);
    const context = parsed.data.context ? sanitizeInput(parsed.data.context) : undefined;

    const result = await callClaude({
      model: AI_MODEL,
      system: COMPOSER_SYSTEM_PROMPT,
      user: buildComposerUserPrompt(idea, context),
      schema: ComposerResponseSchema,
      maxTokens: 3000,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/compose]", message);
    return NextResponse.json(
      { error: message, code: "COMPOSE_FAILED" },
      { status: 500 }
    );
  }
}
