import { z } from "zod";

const str = z.string().nullable().optional().transform((v) => v ?? "");
const num = (min = 0, max = 100) =>
  z.number().min(min).max(max).nullable().optional().transform((v) => v ?? 0);

const FlaggedPhraseSchema = z.object({
  phrase: str,
  reason: str,
  category: z.string().nullable().optional().transform((v) => v ?? "cliche"),
});

export const SlopReportSchema = z.object({
  slopScore: num(),
  flaggedPhrases: z.array(FlaggedPhraseSchema).nullable().optional().transform((v) => v ?? []),
  slopCategories: z.array(z.string()).nullable().optional().transform((v) => v ?? []),
  reasoning: str,
  rewriteSuggestions: z.array(z.string()).nullable().optional().transform((v) => v ?? []),
  overallVerdict: z
    .enum(["clean", "mild", "moderate", "severe"])
    .nullable()
    .optional()
    .transform((v) => v ?? "mild"),
});

export type SlopReportSchemaType = z.infer<typeof SlopReportSchema>;
