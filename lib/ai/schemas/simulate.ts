import { z } from "zod";

export const HookRewriteSchema = z.object({
  version: z.string(),
  hook: z.string(),
  technique: z.string(),
  score: z.number().min(0).max(100),
  rationale: z.string(),
});

export const HookAnalysisSchema = z.object({
  originalHook: z.string(),
  hookScore: z.number().min(0).max(100),
  weaknesses: z.array(z.string()),
  rewrites: z.array(HookRewriteSchema).min(1).max(8),
});

export const FeedSimulationSchema = z.object({
  likelyEngagementType: z.array(z.string()),
  reachProbability: z.number().min(0).max(100),
  followerConversionProbability: z.number().min(0).max(100),
  repostProbability: z.number().min(0).max(100),
  discussionProbability: z.number().min(0).max(100),
  negativeSignalRisk: z.number().min(0).max(100),
  algorithmFriendliness: z.number().min(0).max(100),
  reasoning: z.string(),
  predictedAudience: z.string(),
});

const CadenceProfileSchema = z.object({
  avgSentenceLength: z.number(),
  sentenceVariance: z.enum(["high", "medium", "low"]),
  paragraphStyle: z.enum(["single-line", "short-blocks", "long-form", "mixed"]),
  punctuationStyle: z.string(),
});

const EmotionalProfileSchema = z.object({
  dominantEmotion: z.string(),
  secondaryEmotions: z.array(z.string()),
  tensionLevel: z.number().min(0).max(100),
  urgencyLevel: z.number().min(0).max(100),
  intimacyLevel: z.number().min(0).max(100),
});

export const CreatorDNASchema = z.object({
  cadenceProfile: CadenceProfileSchema,
  toneSignature: z.string(),
  emotionalProfile: EmotionalProfileSchema,
  vocabularyDensity: z.number().min(0).max(100),
  authorityLevel: z.number().min(0).max(100),
  hookStructure: z.string(),
  sentenceRhythm: z.string(),
  writingPersonality: z.string(),
  topTopics: z.array(z.string()),
  uniquePatterns: z.array(z.string()),
});

const TrendSignalSchema = z.object({
  topic: z.string(),
  momentum: z.enum(["rising", "peaking", "declining"]),
  competitionLevel: z.enum(["low", "medium", "high"]),
  opportunity: z.string(),
  suggestedAngles: z.array(z.string()),
  relevanceScore: z.number().min(0).max(100),
});

export const TrendRadarSchema = z.object({
  signals: z.array(TrendSignalSchema),
});

const WeeklyThemeSchema = z.object({
  theme: z.string(),
  rationale: z.string(),
  keyMessages: z.array(z.string()),
});

const NarrativeArcSchema = z.object({
  title: z.string(),
  description: z.string(),
  posts: z.number(),
  duration: z.string(),
});

const ContentCalendarEntrySchema = z.object({
  day: z.string(),
  topic: z.string(),
  tone: z.string(),
  hook: z.string(),
  notes: z.string(),
});

export const ContentPlanSchema = z.object({
  weeklyThemes: z.array(WeeklyThemeSchema),
  narrativeArcs: z.array(NarrativeArcSchema),
  audiencePositioning: z.string(),
  authorityBuildingStrategy: z.string(),
  nicheDominanceStrategy: z.string(),
  contentCalendar: z.array(ContentCalendarEntrySchema),
});
