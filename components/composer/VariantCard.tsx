"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TweetVariant } from "@/types/analysis";
import { TONE_LABELS, TONE_DESCRIPTIONS } from "@/types/composer";
import { CopyButton } from "@/components/shared/CopyButton";
import { scoreColor } from "@/lib/utils/scoring";
import { ChevronDown } from "lucide-react";

interface VariantCardProps {
  variant: TweetVariant;
  index: number;
}

const TONE_COLORS: Record<string, string> = {
  authority:       "var(--color-accent)",
  founder:         "var(--color-signal)",
  technical:       "#38bdf8",
  storytelling:    "#fb923c",
  contrarian:      "var(--color-danger)",
  banger:          "var(--color-warning)",
  minimalist:      "var(--color-text-secondary)",
  "high-curiosity":"#a78bfa",
};

export function VariantCard({ variant, index }: VariantCardProps) {
  const color = TONE_COLORS[variant.tone] ?? "var(--color-accent)";
  const scoreCol = scoreColor(variant.estimatedViralityScore);
  const isThread = Array.isArray(variant.tweets) && variant.tweets.length > 1;
  const [expanded, setExpanded] = useState(false);

  // For copying: join thread tweets with double newline, or use content
  const copyText = isThread
    ? (variant.tweets ?? []).map((t, i) => `${i + 1}/ ${t}`).join("\n\n")
    : variant.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="rounded-xl flex flex-col"
      style={{
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-border-subtle)",
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
      >
        <div className="flex items-center gap-2">
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
          {isThread && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
              style={{
                background: "var(--color-accent-muted)",
                color: "var(--color-accent)",
                border: "1px solid var(--color-accent)",
              }}
            >
              {variant.tweets!.length} tweets
            </span>
          )}
          <p className="text-[10px] hidden sm:block" style={{ color: "var(--color-text-tertiary)" }}>
            {TONE_DESCRIPTIONS[variant.tone] ?? ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold tabular-nums" style={{ color: scoreCol }}>
            {variant.estimatedViralityScore}
          </span>
          <CopyButton text={copyText} />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-2">
        {isThread ? (
          <>
            {/* Always show tweet 1 */}
            <ThreadTweet number={1} text={(variant.tweets ?? [])[0] ?? variant.content} highlight />

            {/* Remaining tweets — collapsible */}
            {expanded &&
              (variant.tweets ?? []).slice(1).map((tweet, i) => (
                <ThreadTweet key={i} number={i + 2} text={tweet} />
              ))}

            {/* Expand/collapse toggle */}
            {(variant.tweets ?? []).length > 1 && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="flex items-center gap-1.5 text-[10px] mt-1 transition-colors"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                <ChevronDown
                  size={12}
                  style={{
                    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.18s",
                  }}
                />
                {expanded
                  ? "Collapse thread"
                  : `Show ${(variant.tweets ?? []).length - 1} more tweet${(variant.tweets ?? []).length - 1 !== 1 ? "s" : ""}`}
              </button>
            )}
          </>
        ) : (
          <p
            className="text-sm leading-relaxed whitespace-pre-wrap"
            style={{ color: "var(--color-text-primary)" }}
          >
            {variant.content}
          </p>
        )}
      </div>

      {/* Footer: char count + rationale */}
      <div
        className="px-4 py-3"
        style={{ borderTop: "1px solid var(--color-border-subtle)" }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px]" style={{ color: "var(--color-text-disabled)" }}>
            {variant.estimatedCharCount} chars{isThread ? " total" : ""}
          </span>
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: "var(--color-text-tertiary)" }}>
          {variant.rationale}
        </p>
      </div>
    </motion.div>
  );
}

function ThreadTweet({ number, text, highlight = false }: { number: number; text: string; highlight?: boolean }) {
  return (
    <div
      className="rounded-lg p-3 flex gap-3"
      style={{
        background: highlight ? "var(--color-bg-elevated)" : "var(--color-bg-base)",
        border: `1px solid ${highlight ? "var(--color-border-default)" : "var(--color-border-subtle)"}`,
      }}
    >
      <span
        className="text-[10px] font-mono font-bold flex-shrink-0 mt-0.5 w-5 text-right"
        style={{ color: "var(--color-text-disabled)" }}
      >
        {number}/
      </span>
      <p
        className="text-sm leading-relaxed whitespace-pre-wrap flex-1"
        style={{ color: "var(--color-text-primary)" }}
      >
        {text}
      </p>
    </div>
  );
}
