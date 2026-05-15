import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callClaude } from "@/lib/ai/client";
import { VIRALITY_SYSTEM_PROMPT, buildViralityUserPrompt } from "@/lib/ai/prompts/virality";
import { ViralityReportSchema } from "@/lib/ai/schemas/virality";
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
    const report = await callClaude({
      model: AI_MODEL,
      system: VIRALITY_SYSTEM_PROMPT,
      user: buildViralityUserPrompt(content),
      schema: ViralityReportSchema,
      maxTokens: 1024,
    });

    return NextResponse.json(report);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/analyze]", message);
    return NextResponse.json(
      { error: message, code: "ANALYSIS_FAILED" },
      { status: 500 }
    );
  }
}
