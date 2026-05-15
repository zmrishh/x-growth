import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (_client) return _client;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY environment variable is not set. Add it to .env.local."
    );
  }

  _client = new Anthropic({ apiKey });
  return _client;
}

export async function callClaude<T>(params: {
  model: string;
  system: string;
  user: string;
  schema: import("zod").ZodType<T>;
  maxTokens?: number;
}): Promise<T> {
  const client = getAnthropicClient();

  const response = await client.messages.create({
    model: params.model,
    max_tokens: params.maxTokens ?? 2048,
    system: params.system,
    messages: [
      {
        role: "user",
        content: params.user,
      },
    ],
  });

  return extractAndValidate(response, params.schema);
}

export interface ImageBlock {
  base64: string;
  mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
}

export async function callClaudeMultimodal<T>(params: {
  model: string;
  system: string;
  textPrompt: string;
  images: ImageBlock[];
  schema: import("zod").ZodType<T>;
  maxTokens?: number;
}): Promise<T> {
  const client = getAnthropicClient();

  const imageBlocks: Anthropic.ImageBlockParam[] = params.images.map((img) => ({
    type: "image",
    source: {
      type: "base64",
      media_type: img.mediaType,
      data: img.base64,
    },
  }));

  const response = await client.messages.create({
    model: params.model,
    max_tokens: params.maxTokens ?? 4096,
    system: params.system,
    messages: [
      {
        role: "user",
        content: [
          ...imageBlocks,
          { type: "text", text: params.textPrompt },
        ],
      },
    ],
  });

  return extractAndValidate(response, params.schema);
}

function extractAndValidate<T>(
  response: Anthropic.Message,
  schema: import("zod").ZodType<T>
): T {
  const rawText =
    response.content[0].type === "text" ? response.content[0].text : "";

  let jsonStr = rawText;

  const fenceMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);
  if (fenceMatch) {
    jsonStr = fenceMatch[1];
  } else {
    const startIdx = rawText.indexOf("{");
    const endIdx = rawText.lastIndexOf("}");
    if (startIdx !== -1 && endIdx !== -1) {
      jsonStr = rawText.slice(startIdx, endIdx + 1);
    }
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error(
      `AI returned malformed JSON. Raw response: ${rawText.slice(0, 400)}`
    );
  }

  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `AI response failed schema validation: ${result.error.message}`
    );
  }

  return result.data;
}
