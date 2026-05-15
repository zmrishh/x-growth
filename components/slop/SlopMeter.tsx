"use client";

import { motion } from "framer-motion";
import { slopColor, slopLabel } from "@/lib/utils/scoring";
import { AnimatedScore } from "@/components/shared/AnimatedScore";

interface SlopMeterProps {
  score: number;
  verdict: "clean" | "mild" | "moderate" | "severe";
}

const VERDICT_LABELS = {
  clean: "Clean Writing",
  mild: "Mild Slop",
  moderate: "Moderate Slop",
  severe: "Severe Slop",
};

export function SlopMeter({ score, verdict }: SlopMeterProps) {
  const color = slopColor(score);

  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-border-subtle)",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
            Slop Score
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
            Higher = more problematic
          </p>
        </div>
        <span
          className="text-xs px-2.5 py-1 rounded-full"
          style={{
            background: `${color}18`,
            color,
            border: `1px solid ${color}50`,
          }}
        >
          {VERDICT_LABELS[verdict]}
        </span>
      </div>

      <div className="flex items-end gap-4 mb-4">
        <AnimatedScore
          value={score}
          fontSize={48}
          className="font-bold tabular-nums leading-none"
          color={color}
        />
        <span className="text-sm mb-2" style={{ color: "var(--color-text-tertiary)" }}>
          / 100
        </span>
      </div>

      {/* Segmented bar */}
      <div className="h-2 rounded-full overflow-hidden flex gap-0.5">
        {[
          { threshold: 25, color: "var(--color-success)" },
          { threshold: 25, color: "var(--color-score-mid)" },
          { threshold: 25, color: "var(--color-warning)" },
          { threshold: 25, color: "var(--color-danger)" },
        ].map((segment, i) => {
          const segStart = i * 25;
          const segEnd = segStart + 25;
          const fill = Math.min(100, Math.max(0, score - segStart)) / 25;
          return (
            <div
              key={i}
              className="flex-1 rounded-full overflow-hidden"
              style={{ background: "var(--color-bg-overlay)" }}
            >
              <motion.div
                className="h-full"
                style={{ background: segment.color }}
                initial={{ width: 0 }}
                animate={{ width: `${fill * 100}%` }}
                transition={{ duration: 0.8, delay: 0.1 * i }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-1">
        {["Clean", "Low", "Moderate", "Severe"].map((label) => (
          <span
            key={label}
            className="text-[9px]"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
