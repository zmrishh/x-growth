export type { TweetVariant, ToneType } from "./analysis";

export const TONE_LABELS: Record<string, string> = {
  authority: "Authority",
  founder: "Founder",
  technical: "Technical",
  storytelling: "Storytelling",
  contrarian: "Contrarian",
  banger: "Banger",
  minimalist: "Minimalist",
  "high-curiosity": "High Curiosity",
};

export const TONE_DESCRIPTIONS: Record<string, string> = {
  authority: "Confident expert voice with declarative statements",
  founder: "Personal, behind-the-scenes builder perspective",
  technical: "Precise, specific, signal-dense technical insight",
  storytelling: "Narrative arc with tension and resolution",
  contrarian: "Challenges conventional thinking with evidence",
  banger: "Maximally high-energy, punchy, scroll-stopping",
  minimalist: "Extreme compression — maximum signal per word",
  "high-curiosity": "Creates irresistible curiosity gap and pull",
};
