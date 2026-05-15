import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callClaude } from "@/lib/ai/client";
import { SIMULATE_SYSTEM_PROMPT, buildSimulateUserPrompt } from "@/lib/ai/prompts/simulate";
import { FeedSimulationSchema } from "@/lib/ai/schemas/simulate";
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
      system: SIMULATE_SYSTEM_PROMPT,
      user: buildSimulateUserPrompt(content),
      schema: FeedSimulationSchema,
      maxTokens: 1024,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/simulate]", message);
    return NextResponse.json(
      { error: message, code: "SIMULATE_FAILED" },
      { status: 500 }
    );
  }
}
