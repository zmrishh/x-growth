import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callClaude } from "@/lib/ai/client";
import { TREND_SYSTEM_PROMPT, buildTrendUserPrompt } from "@/lib/ai/prompts/simulate";
import { TrendRadarSchema } from "@/lib/ai/schemas/simulate";
import { AI_MODEL, MAX_INPUT_CHARS } from "@/constants/models";
import { sanitizeInput } from "@/lib/utils/format";

const RequestSchema = z.object({
  niche: z.string().min(1).max(MAX_INPUT_CHARS),
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

    const niche = sanitizeInput(parsed.data.niche);
    const result = await callClaude({
      model: AI_MODEL,
      system: TREND_SYSTEM_PROMPT,
      user: buildTrendUserPrompt(niche),
      schema: TrendRadarSchema,
      maxTokens: 2048,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/trends]", message);
    return NextResponse.json(
      { error: message, code: "TRENDS_FAILED" },
      { status: 500 }
    );
  }
}
