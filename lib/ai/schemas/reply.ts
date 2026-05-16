import { z } from "zod";

// Coerce null/undefined to empty string for any string field Claude might omit or null
const str = z.string().nullable().optional().transform((v) => v ?? "");
const num = (min = 0, max = 100) =>
  z.number().min(min).max(max).nullable().optional().transform((v) => v ?? 0);
const bool = z.boolean().nullable().optional().transform((v) => v ?? false);

const ReplyScoreSchema = z.object({
  slopScore: num(),
  originalityScore: num(),
  standoutProbability: num(),
  replyToLikeRatio: num(),
  cringeRisk: num(),
  audienceResonance: num(),
  aiGeneratedProbability: num(),
});

const SocialContextSchema = z.object({
  inferredAccountType: str,
  inferredAudience: str,
  contentTone: str,
  contentSummary: str,
  hiddenContext: str,
  powerDynamic: str,
  replyStrategy: str,
  whatMakesAReplyStandOut: str,
  whatToAvoid: str,
  communityNorms: str,
  engagementIntent: str,
  isItAJoke: bool,
  isItIronic: bool,
  ironyLevel: num(),
  humorStyle: z.string().nullable().optional().transform((v) => v ?? null),
  statusGame: str,
});

const ImageAnalysisSchema = z.object({
  extractedText: str,
  contentType: str,
  emotionalTone: str,
  memeStructure: z.string().nullable().optional().transform((v) => v ?? null),
  engagementIntent: str,
  visualSlopRisk: num(),
  keyInsights: z.array(z.string()).nullable().optional().transform((v) => v ?? []),
});

const ReplyVariantSchema = z.object({
  tone: str,
  content: str,
  score: ReplyScoreSchema,
  reasoning: str,
  wasRewritten: bool,
  rewriteNote: z.string().nullable().optional().transform((v) => v ?? null),
});

const MemeRecommendationSchema = z.object({
  style: str,
  description: str,
  rationale: str,
  applicableReplies: z.array(z.string()).nullable().optional().transform((v) => v ?? []),
  energyLevel: str,
  searchQuery: str,
});

const ReplyFeedPredictionSchema = z.object({
  estimatedLikes: str,
  estimatedReplies: str,
  repostProbability: num(),
  profileClickProbability: num(),
  followConversionProbability: num(),
  blendsIn: bool,
  standsOut: bool,
  soundsManufactured: bool,
  visibilityScore: num(),
});

export const ReplyIntelligenceSchema = z.object({
  socialContext: SocialContextSchema,
  imageAnalyses: z.array(ImageAnalysisSchema).nullable().optional().transform((v) => v ?? []),
  replies: z.array(ReplyVariantSchema).min(1),
  memeRecommendations: z.array(MemeRecommendationSchema).nullable().optional().transform((v) => v ?? []),
  feedPredictions: z.record(z.string(), ReplyFeedPredictionSchema).nullable().optional().transform((v) => v ?? {}),
  bestReplyTone: str,
  bestReplyRationale: str,
});

export type ReplyIntelligenceSchemaType = z.infer<typeof ReplyIntelligenceSchema>;
