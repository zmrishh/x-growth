export interface ViralitySignals {
  hookStrength: number;
  dwellProbability: number;
  replyProbability: number;
  shareability: number;
  originality: number;
  authoritySignal: number;
  emotionalPull: number;
  semanticNovelty: number;
  slopRisk: number;
  ragebaitRisk: number;
  audienceFatigueRisk: number;
  advertiserSafetyRisk: number;
}

export type ViralityVerdict = "distribute" | "refine" | "scrap";

export interface ViralityReport {
  overallScore: number;
  signals: ViralitySignals;
  reasoning: string;
  improvements: string[];
  verdict: ViralityVerdict;
  estimatedReadTimeSeconds: number;
}

export interface SlopFlaggedPhrase {
  phrase: string;
  reason: string;
  category: string;
}

export interface RewriteChange {
  original: string;
  replacement: string;
  reason: string;
  category: string;
}

export type SlopCategory =
  | "generic-ai"
  | "engagement-bait"
  | "cliche"
  | "low-density"
  | "synthetic-cadence"
  | "startup-speak";

export interface SlopReport {
  slopScore: number;
  flaggedPhrases: SlopFlaggedPhrase[];
  slopCategories: string[];
  reasoning: string;
  cleanRewrite: string;
  rewriteChangelog: RewriteChange[];
  overallVerdict: "clean" | "mild" | "moderate" | "severe";
}

export type ToneType =
  | "authority"
  | "founder"
  | "technical"
  | "storytelling"
  | "contrarian"
  | "banger"
  | "minimalist"
  | "high-curiosity";

export interface TweetVariant {
  tone: ToneType;
  content: string;
  rationale: string;
  estimatedViralityScore: number;
  estimatedCharCount: number;
}

export interface HookAnalysis {
  originalHook: string;
  hookScore: number;
  weaknesses: string[];
  rewrites: HookRewrite[];
}

export interface HookRewrite {
  version: string;
  hook: string;
  technique: string;
  score: number;
  rationale: string;
}

export interface DwellSimulation {
  estimatedReadTimeSeconds: number;
  pauseProbability: number;
  continuationProbability: number;
  skimRisk: number;
  attentionProfile: "front-loaded" | "back-loaded" | "sustained" | "declining";
  analysis: string;
}

export interface FeedSimulation {
  likelyEngagementType: EngagementType[];
  reachProbability: number;
  followerConversionProbability: number;
  repostProbability: number;
  discussionProbability: number;
  negativeSignalRisk: number;
  algorithmFriendliness: number;
  reasoning: string;
  predictedAudience: string;
}

export type EngagementType =
  | "passive-like"
  | "reply"
  | "repost"
  | "quote"
  | "profile-click"
  | "follow"
  | "share"
  | "bookmark"
  | "not-interested";

export interface CreatorDNA {
  cadenceProfile: CadenceProfile;
  toneSignature: string;
  emotionalProfile: EmotionalProfile;
  vocabularyDensity: number;
  authorityLevel: number;
  hookStructure: string;
  sentenceRhythm: string;
  writingPersonality: string;
  topTopics: string[];
  uniquePatterns: string[];
}

export interface CadenceProfile {
  avgSentenceLength: number;
  sentenceVariance: "high" | "medium" | "low";
  paragraphStyle: "single-line" | "short-blocks" | "long-form" | "mixed";
  punctuationStyle: string;
}

export interface EmotionalProfile {
  dominantEmotion: string;
  secondaryEmotions: string[];
  tensionLevel: number;
  urgencyLevel: number;
  intimacyLevel: number;
}

export interface ContentPlan {
  weeklyThemes: WeeklyTheme[];
  narrativeArcs: NarrativeArc[];
  audiencePositioning: string;
  authorityBuildingStrategy: string;
  nicheDominanceStrategy: string;
  contentCalendar: ContentCalendarEntry[];
}

export interface WeeklyTheme {
  theme: string;
  rationale: string;
  keyMessages: string[];
}

export interface NarrativeArc {
  title: string;
  description: string;
  posts: number;
  duration: string;
}

export interface ContentCalendarEntry {
  day: string;
  topic: string;
  tone: ToneType;
  hook: string;
  notes: string;
}

export interface TrendSignal {
  topic: string;
  momentum: "rising" | "peaking" | "declining";
  competitionLevel: "low" | "medium" | "high";
  opportunity: string;
  suggestedAngles: string[];
  relevanceScore: number;
}

export interface FatigueReport {
  overallFatigueRisk: number;
  repeatedHooks: string[];
  repeatedFormats: string[];
  repeatedIdeas: string[];
  audienceFatigueIndicators: string[];
  recommendations: string[];
}

export interface AnalysisHistoryEntry {
  id: string;
  type: "virality" | "slop" | "hook" | "compose" | "feed" | "dna" | "strategy";
  input: string;
  score?: number;
  verdict?: string;
  createdAt: Date;
}
