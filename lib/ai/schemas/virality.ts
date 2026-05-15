import { z } from "zod";

export const ViralitySignalsSchema = z.object({
  hookStrength: z.number().min(0).max(100),
  dwellProbability: z.number().min(0).max(100),
  replyProbability: z.number().min(0).max(100),
  shareability: z.number().min(0).max(100),
  originality: z.number().min(0).max(100),
  authoritySignal: z.number().min(0).max(100),
  emotionalPull: z.number().min(0).max(100),
  semanticNovelty: z.number().min(0).max(100),
  slopRisk: z.number().min(0).max(100),
  ragebaitRisk: z.number().min(0).max(100),
  audienceFatigueRisk: z.number().min(0).max(100),
  advertiserSafetyRisk: z.number().min(0).max(100),
});

export const ViralityReportSchema = z.object({
  overallScore: z.number().min(0).max(100),
  signals: ViralitySignalsSchema,
  reasoning: z.string(),
  improvements: z.array(z.string()),
  verdict: z.enum(["distribute", "refine", "scrap"]),
  estimatedReadTimeSeconds: z.number(),
});

export type ViralityReportSchemaType = z.infer<typeof ViralityReportSchema>;
