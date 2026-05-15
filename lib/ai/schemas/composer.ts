import { z } from "zod";

const TweetVariantSchema = z.object({
  tone: z.enum([
    "authority",
    "founder",
    "technical",
    "storytelling",
    "contrarian",
    "banger",
    "minimalist",
    "high-curiosity",
  ]),
  content: z.string(),
  rationale: z.string(),
  estimatedViralityScore: z.number().min(0).max(100),
  estimatedCharCount: z.number(),
});

export const ComposerResponseSchema = z.object({
  variants: z.array(TweetVariantSchema).min(1).max(8),
});

export type ComposerResponseSchemaType = z.infer<typeof ComposerResponseSchema>;
