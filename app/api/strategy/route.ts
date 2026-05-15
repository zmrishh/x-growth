import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callClaude } from "@/lib/ai/client";
import { STRATEGY_SYSTEM_PROMPT, buildStrategyUserPrompt } from "@/lib/ai/prompts/simulate";
import { ContentPlanSchema } from "@/lib/ai/schemas/simulate";
import { AI_MODEL, MAX_INPUT_CHARS } from "@/constants/models";
import { sanitizeInput } from "@/lib/utils/format";

const RequestSchema = z.object({
  context: z.string().min(1).max(MAX_INPUT_CHARS),
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

    const context = sanitizeInput(parsed.data.context);
    const result = await callClaude({
      model: AI_MODEL,
      system: STRATEGY_SYSTEM_PROMPT,
      user: buildStrategyUserPrompt(context),
      schema: ContentPlanSchema,
      maxTokens: 4096,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/strategy]", message);
    return NextResponse.json(
      { error: message, code: "STRATEGY_FAILED" },
      { status: 500 }
    );
  }
}
