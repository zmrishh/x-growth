import { z } from "zod";

const str = z.string().nullable().optional().transform((v) => v ?? "");
const num = (min = 0, max = 100) =>
  z.number().min(min).max(max).nullable().optional().transform((v) => v ?? 0);

const TweetVariantSchema = z.object({
  tone: str,
  content: str,
  tweets: z.array(z.string()).nullable().optional().transform((v) => v ?? undefined),
  rationale: str,
  estimatedViralityScore: num(),
  estimatedCharCount: z.number().nullable().optional().transform((v) => v ?? 0),
});

export const ComposerResponseSchema = z.object({
  variants: z.array(TweetVariantSchema).min(1),
});

export type ComposerResponseSchemaType = z.infer<typeof ComposerResponseSchema>;
