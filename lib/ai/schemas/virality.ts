import { z } from "zod";

const num = (min = 0, max = 100) =>
  z.number().min(min).max(max).nullable().optional().transform((v) => v ?? 0);
const str = z.string().nullable().optional().transform((v) => v ?? "");

export const ViralitySignalsSchema = z.object({
  hookStrength: num(),
  dwellProbability: num(),
  replyProbability: num(),
  shareability: num(),
  originality: num(),
  authoritySignal: num(),
  emotionalPull: num(),
  semanticNovelty: num(),
  slopRisk: num(),
  ragebaitRisk: num(),
  audienceFatigueRisk: num(),
  advertiserSafetyRisk: num(),
});

export const ViralityReportSchema = z.object({
  overallScore: num(),
  signals: ViralitySignalsSchema,
  reasoning: str,
  improvements: z.array(z.string()).nullable().optional().transform((v) => v ?? []),
  verdict: z.enum(["distribute", "refine", "scrap"]).nullable().optional().transform((v) => v ?? "refine"),
  estimatedReadTimeSeconds: z.number().nullable().optional().transform((v) => v ?? 0),
});

export type ViralityReportSchemaType = z.infer<typeof ViralityReportSchema>;
