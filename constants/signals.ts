export const SIGNAL_META: Record<
  string,
  { label: string; description: string; invert?: boolean }
> = {
  hookStrength: {
    label: "Hook Strength",
    description: "How likely the opening line stops the scroll",
  },
  dwellProbability: {
    label: "Dwell Probability",
    description: "Probability the reader spends meaningful time with the post",
  },
  replyProbability: {
    label: "Reply Probability",
    description: "Likelihood of generating conversation",
  },
  shareability: {
    label: "Shareability",
    description: "How likely someone re-shares to their audience",
  },
  originality: {
    label: "Originality",
    description: "Semantic novelty relative to common discourse",
  },
  authoritySignal: {
    label: "Authority Signal",
    description: "Perceived expertise and credibility",
  },
  emotionalPull: {
    label: "Emotional Pull",
    description: "Strength of emotional resonance and engagement",
  },
  semanticNovelty: {
    label: "Semantic Novelty",
    description: "New framing or insight not commonly expressed",
  },
  slopRisk: {
    label: "Slop Risk",
    description: "Probability of generic AI-like writing patterns",
    invert: true,
  },
  ragebaitRisk: {
    label: "Ragebait Risk",
    description: "Risk of triggering negative engagement signals",
    invert: true,
  },
  audienceFatigueRisk: {
    label: "Fatigue Risk",
    description: "Risk of repetitive content the audience has seen",
    invert: true,
  },
  advertiserSafetyRisk: {
    label: "Advertiser Safety",
    description: "Risk of triggering content moderation or brand unsafety",
    invert: true,
  },
};

export const SIGNAL_ORDER = [
  "hookStrength",
  "dwellProbability",
  "replyProbability",
  "shareability",
  "originality",
  "authoritySignal",
  "emotionalPull",
  "semanticNovelty",
  "slopRisk",
  "ragebaitRisk",
  "audienceFatigueRisk",
  "advertiserSafetyRisk",
];
