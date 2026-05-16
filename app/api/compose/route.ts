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
  mode: z.enum(["single", "thread"]).default("single"),
  length: z.enum(["short", "medium", "long"]).default("medium"),
  threadCount: z.number().int().min(2).max(10).default(5),
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

    const { idea, context, mode, length, threadCount } = parsed.data;
    const sanitizedIdea = sanitizeInput(idea);
    const sanitizedContext = context ? sanitizeInput(context) : undefined;

    const result = await callClaude({
      model: AI_MODEL,
      system: COMPOSER_SYSTEM_PROMPT,
      user: buildComposerUserPrompt(sanitizedIdea, {
        mode,
        length,
        threadCount,
        context: sanitizedContext,
      }),
      schema: ComposerResponseSchema,
      maxTokens: mode === "thread" ? 6000 : 3000,
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
