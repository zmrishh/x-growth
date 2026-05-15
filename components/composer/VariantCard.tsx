"use client";

import { motion } from "framer-motion";
import { TweetVariant } from "@/types/analysis";
import { TONE_LABELS, TONE_DESCRIPTIONS } from "@/types/composer";
import { CopyButton } from "@/components/shared/CopyButton";
import { scoreColor } from "@/lib/utils/scoring";

interface VariantCardProps {
  variant: TweetVariant;
  index: number;
}

const TONE_COLORS: Record<string, string> = {
  authority: "var(--color-accent)",
  founder: "var(--color-signal)",
  technical: "#38bdf8",
  storytelling: "#fb923c",
  contrarian: "var(--color-danger)",
  banger: "var(--color-warning)",
  minimalist: "var(--color-text-secondary)",
  "high-curiosity": "#a78bfa",
};

export function VariantCard({ variant, index }: VariantCardProps) {
  const color = TONE_COLORS[variant.tone] ?? "var(--color-accent)";
  const scoreCol = scoreColor(variant.estimatedViralityScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-border-subtle)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: `${color}18`,
                color,
                border: `1px solid ${color}40`,
              }}
            >
              {TONE_LABELS[variant.tone] ?? variant.tone}
            </span>
          </div>
          <p className="text-[11px]" style={{ color: "var(--color-text-tertiary)" }}>
            {TONE_DESCRIPTIONS[variant.tone] ?? ""}
          </p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span
            className="text-lg font-bold tabular-nums"
            style={{ color: scoreCol }}
          >
            {variant.estimatedViralityScore}
          </span>
        </div>
      </div>

      {/* Tweet content */}
      <div
        className="rounded-lg p-4"
        style={{ background: "var(--color-bg-elevated)" }}
      >
        <p
          className="text-sm leading-relaxed whitespace-pre-wrap"
          style={{ color: "var(--color-text-primary)" }}
        >
          {variant.content}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>
            {variant.estimatedCharCount} chars
          </span>
          <CopyButton text={variant.content} />
        </div>
      </div>

      {/* Rationale */}
      <p className="text-[11px] leading-relaxed" style={{ color: "var(--color-text-tertiary)" }}>
        {variant.rationale}
      </p>
    </motion.div>
  );
}
