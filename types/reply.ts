export type ReplyTone =
  | "funny"
  | "smart"
  | "contrarian"
  | "high-engagement"
  | "minimalist"
  | "meme-native"
  | "intellectual"
  | "founder"
  | "technical"
  | "viral-bait"
  | "relationship-building"
  | "authority";

export interface ReplyScore {
  slopScore: number;
  originalityScore: number;
  standoutProbability: number;
  replyToLikeRatio: number;
  cringeRisk: number;
  audienceResonance: number;
  aiGeneratedProbability: number;
}

export interface ReplyVariant {
  tone: ReplyTone;
  content: string;
  score: ReplyScore;
  reasoning: string;
  wasRewritten: boolean;
  rewriteNote?: string;
}

export type AccountType =
  | "tech-founder"
  | "AI-twitter"
  | "finance-twitter"
  | "meme-account"
  | "political"
  | "creator"
  | "journalist"
  | "researcher"
  | "niche-internet"
  | "normie"
  | "lurker-intellectual"
  | "ragebait"
  | "irony-poster"
  | "crypto"
  | "unknown";

export type ContentTone =
  | "serious"
  | "joking"
  | "ironic"
  | "sarcastic"
  | "intellectual"
  | "emotional"
  | "ragebaiting"
  | "informational"
  | "humble-brag"
  | "genuinely-curious"
  | "hot-take"
  | "neutral";

export interface SocialContext {
  inferredAccountType: AccountType;
  inferredAudience: string;
  contentTone: ContentTone;
  contentSummary: string;
  hiddenContext: string;
  powerDynamic: string;
  replyStrategy: string;
  whatMakesAReplyStandOut: string;
  whatToAvoid: string;
  communityNorms: string;
  engagementIntent: string;
  isItAJoke: boolean;
  isItIronic: boolean;
  ironyLevel: number;
  humorStyle: string | null;
  statusGame: string;
}

export type MemeStyle =
  | "reaction-image"
  | "low-quality-wojak"
  | "screenshot-tweet"
  | "zoomed-in-face"
  | "text-only"
  | "surreal"
  | "object-labeling"
  | "expanding-brain"
  | "drakeposting"
  | "distracted-boyfriend"
  | "nothing-meme-needed";

export interface MemeRecommendation {
  style: MemeStyle;
  description: string;
  rationale: string;
  applicableReplies: ReplyTone[];
  energyLevel: "low" | "medium" | "high";
  searchQuery: string;
}

export interface ReplyFeedPrediction {
  estimatedLikes: string;
  estimatedReplies: string;
  repostProbability: number;
  profileClickProbability: number;
  followConversionProbability: number;
  blendsIn: boolean;
  standsOut: boolean;
  soundsManufactured: boolean;
  visibilityScore: number;
}

export interface ImageAnalysis {
  extractedText: string;
  contentType: "tweet-screenshot" | "meme" | "conversation" | "image" | "other";
  emotionalTone: string;
  memeStructure: string | null;
  engagementIntent: string;
  visualSlopRisk: number;
  keyInsights: string[];
}

export interface ReplyIntelligenceResult {
  socialContext: SocialContext;
  imageAnalyses: ImageAnalysis[];
  replies: ReplyVariant[];
  memeRecommendations: MemeRecommendation[];
  feedPredictions: Record<string, ReplyFeedPrediction>;
  bestReplyTone: ReplyTone;
  bestReplyRationale: string;
}

export interface ReplyIntelligenceInput {
  textContext: string;
  images: UploadedImage[];
}

export interface UploadedImage {
  name: string;
  type: string;
  base64: string;
  sizeBytes: number;
}
