import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callClaude } from "@/lib/ai/client";
import { SlopReportSchema } from "@/lib/ai/schemas/slop";
import { SLOP_SYSTEM_PROMPT, buildSlopUserPrompt } from "@/lib/ai/prompts/slop";
import { AI_MODEL, MAX_INPUT_CHARS } from "@/constants/models";
import { sanitizeInput } from "@/lib/utils/format";

const RequestSchema = z.object({
  content: z.string().min(1).max(MAX_INPUT_CHARS),
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

    const content = sanitizeInput(parsed.data.content);
    const result = await callClaude({
      model: AI_MODEL,
      system: SLOP_SYSTEM_PROMPT,
      user: buildSlopUserPrompt(content),
      schema: SlopReportSchema,
      maxTokens: 1500,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/slop]", message);
    return NextResponse.json(
      { error: message, code: "SLOP_FAILED" },
      { status: 500 }
    );
  }
}
