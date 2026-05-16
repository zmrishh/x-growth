export type TweetLength = "short" | "medium" | "long";
export type ComposerMode = "single" | "thread";

const LENGTH_GUIDE: Record<TweetLength, string> = {
  short:  "Under 140 characters. Punchy, compressed, single punch.",
  medium: "140-280 characters. Full thought, no padding.",
  long:   "280-600 characters. Expand with one concrete example, nuance, or story beat. Still tight — no filler.",
};

const THREAD_GUIDE = (count: number) => `
You are generating THREADS, not single tweets.
Each variant must be a complete thread of exactly ${count} tweets.
Rules:
- Tweet 1 is the hook — it must standalone and create a reason to read the rest
- Each tweet is max 280 characters
- Tweets flow logically: setup → development → payoff
- The last tweet should land with a conclusion, question, or action
- The 'content' field = tweet 1 (the hook) only
- The 'tweets' array = ALL ${count} tweets in order (including tweet 1)
- The 'estimatedCharCount' = total chars across all tweets
`;

export const COMPOSER_SYSTEM_PROMPT = `You are an elite social content strategist with deep expertise in X/Twitter distribution mechanics, psychological triggers, and high-signal writing.

CRITICAL RULES:
- Each variant must be genuinely distinct — different structure, hook type, framing, and emotional register
- No generic AI phrasing, engagement bait, or startup clichés
- Each tweet must feel authored by a real human expert
- Optimize for authentic engagement: replies, profile clicks, meaningful shares
- No hashtags unless absolutely essential to the content
- Do not start any tweet with "I" — it weakens hooks
- Prefer concrete specifics over vague generalizations
- Never use em dashes

TONE DEFINITIONS:
- authority: Confident declarative statements from a position of deep expertise
- founder: Personal, behind-the-scenes builder perspective with stakes
- technical: Precise, specific, jargon-appropriate technical insight
- storytelling: Narrative arc — setup, tension, resolution compressed
- contrarian: Challenges the consensus with evidence or reframing
- banger: Maximum punch — short, fast, scroll-stopping
- minimalist: Extreme compression — every word earns its place
- high-curiosity: Opens a curiosity gap the reader must close`;

export function buildComposerUserPrompt(
  idea: string,
  options: {
    mode: ComposerMode;
    length: TweetLength;
    threadCount?: number;
    context?: string;
  }
): string {
  const { mode, length, threadCount = 5, context } = options;
  const isThread = mode === "thread";

  const lengthInstruction = isThread
    ? `Each individual tweet: max 280 chars. Generate exactly ${threadCount} tweets per thread.`
    : `Length target: ${LENGTH_GUIDE[length]}`;

  const structureInstruction = isThread
    ? THREAD_GUIDE(threadCount)
    : `Generate 8 single-tweet variants covering all 8 tones.`;

  const jsonStructure = isThread
    ? `{
  "variants": [
    {
      "tone": string,
      "content": string (tweet 1 — the hook),
      "tweets": [string, string, ...] (all ${threadCount} tweets in order),
      "rationale": string (one sentence on why this thread structure works),
      "estimatedViralityScore": number (0-100),
      "estimatedCharCount": number (total chars across all tweets)
    }
  ]
}`
    : `{
  "variants": [
    {
      "tone": string,
      "content": string,
      "rationale": string,
      "estimatedViralityScore": number (0-100),
      "estimatedCharCount": number
    }
  ]
}`;

  return `${structureInstruction}

${lengthInstruction}

Idea:
<idea>
${idea}
</idea>
${context ? `\n<context>\n${context}\n</context>` : ""}

Return ONLY valid JSON:
${jsonStructure}`;
}
