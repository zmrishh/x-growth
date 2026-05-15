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
  hiddenContext: z.string(),
  powerDynamic: z.string(),
  replyStrategy: z.string(),
  whatMakesAReplyStandOut: z.string(),
  whatToAvoid: z.string(),
  communityNorms: z.string(),
  engagementIntent: z.string(),
  isItAJoke: z.boolean(),
  isItIronic: z.boolean(),
  ironyLevel: z.number().min(0).max(100),
  humorStyle: z.string().nullable(),
  statusGame: z.string(),
});

const ImageAnalysisSchema = z.object({
  extractedText: z.string(),
  contentType: z.enum(["tweet-screenshot", "meme", "conversation", "image", "other"]),
  emotionalTone: z.string(),
  memeStructure: z.string().nullable(),
  engagementIntent: z.string(),
  visualSlopRisk: z.number().min(0).max(100),
  keyInsights: z.array(z.string()),
});

const ReplyVariantSchema = z.object({
  tone: z.enum([
    "funny",
    "smart",
    "contrarian",
    "high-engagement",
    "minimalist",
    "meme-native",
    "intellectual",
    "founder",
    "technical",
    "viral-bait",
    "relationship-building",
    "authority",
  ]),
  content: z.string(),
  score: ReplyScoreSchema,
  reasoning: z.string(),
  wasRewritten: z.boolean(),
  rewriteNote: z.string().nullable().optional(),
});

const MemeRecommendationSchema = z.object({
  style: z.string(),
  description: z.string(),
  rationale: z.string(),
  applicableReplies: z.array(z.string()),
  energyLevel: z.enum(["low", "medium", "high"]),
  searchQuery: z.string(),
});

const ReplyFeedPredictionSchema = z.object({
  estimatedLikes: z.string(),
  estimatedReplies: z.string(),
  repostProbability: z.number().min(0).max(100),
  profileClickProbability: z.number().min(0).max(100),
  followConversionProbability: z.number().min(0).max(100),
  blendsIn: z.boolean(),
  standsOut: z.boolean(),
  soundsManufactured: z.boolean(),
  visibilityScore: z.number().min(0).max(100),
});

export const ReplyIntelligenceSchema = z.object({
  socialContext: SocialContextSchema,
  imageAnalyses: z.array(ImageAnalysisSchema),
  replies: z.array(ReplyVariantSchema).min(1).max(12),
  memeRecommendations: z.array(MemeRecommendationSchema),
  feedPredictions: z.record(z.string(), ReplyFeedPredictionSchema),
  bestReplyTone: z.string(),
  bestReplyRationale: z.string(),
});

export type ReplyIntelligenceSchemaType = z.infer<typeof ReplyIntelligenceSchema>;
