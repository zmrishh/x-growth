import { z } from "zod";

const ReplyScoreSchema = z.object({
  slopScore: z.number().min(0).max(100),
  originalityScore: z.number().min(0).max(100),
  standoutProbability: z.number().min(0).max(100),
  replyToLikeRatio: z.number().min(0).max(100),
  cringeRisk: z.number().min(0).max(100),
  audienceResonance: z.number().min(0).max(100),
  aiGeneratedProbability: z.number().min(0).max(100),
});

const SocialContextSchema = z.object({
  inferredAccountType: z.string(),
  inferredAudience: z.string(),
  contentTone: z.string(),
  contentSummary: z.string(),
  hiddenContext: z.string().default(""),
  powerDynamic: z.string().default(""),
  replyStrategy: z.string().default(""),
  whatMakesAReplyStandOut: z.string().default(""),
  whatToAvoid: z.string().default(""),
  communityNorms: z.string().default(""),
  engagementIntent: z.string().default(""),
  isItAJoke: z.boolean().default(false),
  isItIronic: z.boolean().default(false),
  ironyLevel: z.number().min(0).max(100).default(0),
  humorStyle: z.string().nullable().default(null),
  statusGame: z.string().default(""),
});

const ImageAnalysisSchema = z.object({
  extractedText: z.string().default(""),
  contentType: z.string().default("other"),
  emotionalTone: z.string().default(""),
  memeStructure: z.string().nullable().default(null),
  engagementIntent: z.string().default(""),
  visualSlopRisk: z.number().min(0).max(100).default(0),
  keyInsights: z.array(z.string()).default([]),
});

// Use z.string() instead of strict enum — Claude occasionally varies tone names
const ReplyVariantSchema = z.object({
  tone: z.string(),
  content: z.string(),
  score: ReplyScoreSchema,
  reasoning: z.string().default(""),
  wasRewritten: z.boolean().default(false),
  rewriteNote: z.string().nullable().optional(),
});

const MemeRecommendationSchema = z.object({
  style: z.string(),
  description: z.string(),
  rationale: z.string(),
  applicableReplies: z.array(z.string()).default([]),
  energyLevel: z.string().default("medium"),
  searchQuery: z.string().default(""),
});

const ReplyFeedPredictionSchema = z.object({
  estimatedLikes: z.string().default("unknown"),
  estimatedReplies: z.string().default("unknown"),
  repostProbability: z.number().min(0).max(100).default(0),
  profileClickProbability: z.number().min(0).max(100).default(0),
  followConversionProbability: z.number().min(0).max(100).default(0),
  blendsIn: z.boolean().default(false),
  standsOut: z.boolean().default(false),
  soundsManufactured: z.boolean().default(false),
  visibilityScore: z.number().min(0).max(100).default(0),
});

export const ReplyIntelligenceSchema = z.object({
  socialContext: SocialContextSchema,
  imageAnalyses: z.array(ImageAnalysisSchema).default([]),
  replies: z.array(ReplyVariantSchema).min(1),
  memeRecommendations: z.array(MemeRecommendationSchema).default([]),
  feedPredictions: z.record(z.string(), ReplyFeedPredictionSchema).default({}),
  bestReplyTone: z.string().default("smart"),
  bestReplyRationale: z.string().default(""),
});

export type ReplyIntelligenceSchemaType = z.infer<typeof ReplyIntelligenceSchema>;
