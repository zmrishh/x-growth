"use client";

import { motion } from "framer-motion";
import { ReplyVariant } from "@/types/reply";
import { CopyButton } from "@/components/shared/CopyButton";
import { Star, RefreshCw } from "lucide-react";

interface ReplyVariantCardProps {
  variant: ReplyVariant;
  index: number;
  isBest?: boolean;
}

const TONE_META: Record<string, { label: string; color: string; description: string }> = {
  funny: { label: "Funny", color: "#fbbf24", description: "Timing-aware, lands without explaining itself" },
  smart: { label: "Smart", color: "#38bdf8", description: "Adds a real insight or reframe" },
  contrarian: { label: "Contrarian", color: "var(--color-danger)", description: "Challenges the premise specifically" },
  "high-engagement": { label: "High Engagement", color: "var(--color-accent)", description: "Built to generate replies" },
  minimalist: { label: "Minimalist", color: "var(--color-text-secondary)", description: "3-10 words. Maximum compression." },
  "meme-native": { label: "Meme Native", color: "#a78bfa", description: "Internet-fluent. Not forced." },
  intellectual: { label: "Intellectual", color: "#34d399", description: "Brings a framework or discipline" },
  founder: { label: "Founder", color: "#fb923c", description: "Opinionated from builder experience" },
  technical: { label: "Technical", color: "#60a5fa", description: "Precise, specific, correct" },
  "viral-bait": { label: "Viral Bait", color: "var(--color-warning)", description: "Designed to get quoted" },
  "relationship-building": { label: "Relationship", color: "#f472b6", description: "Makes the person feel seen" },
  authority: { label: "Authority", color: "var(--color-accent)", description: "Short. Confident. Zero hedging." },
};

function ScorePill({
  label,
  value,
  invert = false,
}: {
  label: string;
  value: number;
  invert?: boolean;
}) {
  const display = invert ? 100 - value : value;
  const color =
    display >= 70
      ? "var(--color-score-high)"
      : display >= 45
      ? "var(--color-score-mid)"
      : "var(--color-score-low)";

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10px] font-semibold tabular-nums" style={{ color }}>
        {value}
      </span>
      <span className="text-[9px] text-center leading-tight" style={{ color: "var(--color-text-tertiary)" }}>
        {label}
      </span>
    </div>
  );
}

export function ReplyVariantCard({ variant, index, isBest }: ReplyVariantCardProps) {
  const meta = TONE_META[variant.tone] ?? {
    label: variant.tone,
    color: "var(--color-accent)",
    description: "",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-xl flex flex-col gap-0"
      style={{
        background: "var(--color-bg-surface)",
        border: `1px solid ${isBest ? "var(--color-accent)" : "var(--color-border-subtle)"}`,
        boxShadow: isBest ? `0 0 0 1px var(--color-accent)22` : undefined,
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
      >
        <div className="flex items-center gap-2">
          {isBest && (
            <Star size={11} style={{ color: "var(--color-accent)" }} />
          )}
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: `${meta.color}18`,
              color: meta.color,
              border: `1px solid ${meta.color}40`,
            }}
          >
            {meta.label}
          </span>
          {variant.wasRewritten && (
            <span
              className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full"
              style={{
                background: "var(--color-signal-muted)",
                color: "var(--color-signal)",
                border: "1px solid var(--color-signal-dim)",
              }}
            >
              <RefreshCw size={8} />
              rewritten
            </span>
          )}
        </div>
        <CopyButton text={variant.content} />
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        <p
          className="text-sm leading-relaxed whitespace-pre-wrap"
          style={{ color: "var(--color-text-primary)" }}
        >
          {variant.content}
        </p>
      </div>

      {/* Scores */}
      <div
        className="px-4 py-3 grid grid-cols-7 gap-2"
        style={{ borderTop: "1px solid var(--color-border-subtle)" }}
      >
        <ScorePill label="Originality" value={variant.score.originalityScore} />
        <ScorePill label="Standout" value={variant.score.standoutProbability} />
        <ScorePill label="Resonance" value={variant.score.audienceResonance} />
        <ScorePill label="R:L Ratio" value={variant.score.replyToLikeRatio} />
        <ScorePill label="Slop" value={variant.score.slopScore} invert />
        <ScorePill label="Cringe" value={variant.score.cringeRisk} invert />
        <ScorePill label="Not AI" value={variant.score.aiGeneratedProbability} invert />
      </div>

      {/* Reasoning */}
      <div
        className="px-4 py-3"
        style={{ borderTop: "1px solid var(--color-border-subtle)" }}
      >
        <p className="text-[11px] leading-relaxed" style={{ color: "var(--color-text-tertiary)" }}>
          {variant.reasoning}
        </p>
        {variant.wasRewritten && variant.rewriteNote && (
          <p className="text-[11px] mt-1.5" style={{ color: "var(--color-signal)" }}>
            Rewrite: {variant.rewriteNote}
          </p>
        )}
      </div>
    </motion.div>
  );
}
