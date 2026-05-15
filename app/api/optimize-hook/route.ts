import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callClaude } from "@/lib/ai/client";
import { HOOK_SYSTEM_PROMPT, buildHookUserPrompt } from "@/lib/ai/prompts/hook";
import { HookAnalysisSchema } from "@/lib/ai/schemas/simulate";
import { AI_MODEL, MAX_INPUT_CHARS } from "@/constants/models";
import { sanitizeInput } from "@/lib/utils/format";

const RequestSchema = z.object({
  tweet: z.string().min(1).max(MAX_INPUT_CHARS),
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

    const tweet = sanitizeInput(parsed.data.tweet);
    const result = await callClaude({
      model: AI_MODEL,
      system: HOOK_SYSTEM_PROMPT,
      user: buildHookUserPrompt(tweet),
      schema: HookAnalysisSchema,
      maxTokens: 2048,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/optimize-hook]", message);
    return NextResponse.json(
      { error: message, code: "HOOK_FAILED" },
      { status: 500 }
    );
  }
}
