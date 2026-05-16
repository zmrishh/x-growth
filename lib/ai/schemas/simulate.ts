import { z } from "zod";

const str = z.string().nullable().optional().transform((v) => v ?? "");
const num = (min = 0, max = 100) =>
  z.number().min(min).max(max).nullable().optional().transform((v) => v ?? 0);
const strs = z.array(z.string()).nullable().optional().transform((v) => v ?? []);

export const HookRewriteSchema = z.object({
  version: str,
  hook: str,
  technique: str,
  score: num(),
  rationale: str,
});

export const HookAnalysisSchema = z.object({
  originalHook: str,
  hookScore: num(),
  weaknesses: strs,
  rewrites: z.array(HookRewriteSchema).min(1),
});

export const FeedSimulationSchema = z.object({
  likelyEngagementType: strs,
  reachProbability: num(),
  followerConversionProbability: num(),
  repostProbability: num(),
  discussionProbability: num(),
  negativeSignalRisk: num(),
  algorithmFriendliness: num(),
  reasoning: str,
  predictedAudience: str,
});

const CadenceProfileSchema = z.object({
  avgSentenceLength: z.number().nullable().optional().transform((v) => v ?? 0),
  sentenceVariance: z
    .enum(["high", "medium", "low"])
    .nullable()
    .optional()
    .transform((v) => v ?? "medium"),
  paragraphStyle: z
    .enum(["single-line", "short-blocks", "long-form", "mixed"])
    .nullable()
    .optional()
    .transform((v) => v ?? "mixed"),
  punctuationStyle: str,
});

const EmotionalProfileSchema = z.object({
  dominantEmotion: str,
  secondaryEmotions: strs,
  tensionLevel: num(),
  urgencyLevel: num(),
  intimacyLevel: num(),
});

export const CreatorDNASchema = z.object({
  cadenceProfile: CadenceProfileSchema,
  toneSignature: str,
  emotionalProfile: EmotionalProfileSchema,
  vocabularyDensity: num(),
  authorityLevel: num(),
  hookStructure: str,
  sentenceRhythm: str,
  writingPersonality: str,
  topTopics: strs,
  uniquePatterns: strs,
});

const TrendSignalSchema = z.object({
  topic: str,
  momentum: z
    .enum(["rising", "peaking", "declining"])
    .nullable()
    .optional()
    .transform((v) => v ?? "rising"),
  competitionLevel: z
    .enum(["low", "medium", "high"])
    .nullable()
    .optional()
    .transform((v) => v ?? "medium"),
  opportunity: str,
  suggestedAngles: strs,
  relevanceScore: num(),
});

export const TrendRadarSchema = z.object({
  signals: z.array(TrendSignalSchema).nullable().optional().transform((v) => v ?? []),
});

const WeeklyThemeSchema = z.object({
  theme: str,
  rationale: str,
  keyMessages: strs,
});

const NarrativeArcSchema = z.object({
  title: str,
  description: str,
  posts: z.number().nullable().optional().transform((v) => v ?? 0),
  duration: str,
});

const ContentCalendarEntrySchema = z.object({
  day: str,
  topic: str,
  tone: str,
  hook: str,
  notes: str,
});

export const ContentPlanSchema = z.object({
  weeklyThemes: z.array(WeeklyThemeSchema).nullable().optional().transform((v) => v ?? []),
  narrativeArcs: z.array(NarrativeArcSchema).nullable().optional().transform((v) => v ?? []),
  audiencePositioning: str,
  authorityBuildingStrategy: str,
  nicheDominanceStrategy: str,
  contentCalendar: z.array(ContentCalendarEntrySchema).nullable().optional().transform((v) => v ?? []),
});
