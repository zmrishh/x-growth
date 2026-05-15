import { z } from "zod";

const FlaggedPhraseSchema = z.object({
  phrase: z.string(),
  reason: z.string(),
  category: z.enum([
    "generic-ai",
    "engagement-bait",
    "cliche",
    "low-density",
    "synthetic-cadence",
    "startup-speak",
  ]),
});

export const SlopReportSchema = z.object({
  slopScore: z.number().min(0).max(100),
  flaggedPhrases: z.array(FlaggedPhraseSchema),
  slopCategories: z.array(z.string()),
  reasoning: z.string(),
  rewriteSuggestions: z.array(z.string()),
  overallVerdict: z.enum(["clean", "mild", "moderate", "severe"]),
});

export type SlopReportSchemaType = z.infer<typeof SlopReportSchema>;
