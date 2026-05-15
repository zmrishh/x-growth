"use client";

import { motion } from "framer-motion";
import { scoreColor, scoreLabel } from "@/lib/utils/scoring";
import { AnimatedScore } from "@/components/shared/AnimatedScore";

interface ScoreGaugeProps {
  score: number;
  verdict: "distribute" | "refine" | "scrap";
}

const VERDICT_CONFIG = {
  distribute: { label: "Distribute", color: "var(--color-success)" },
  refine: { label: "Refine", color: "var(--color-warning)" },
  scrap: { label: "Scrap", color: "var(--color-danger)" },
};

export function ScoreGauge({ score, verdict }: ScoreGaugeProps) {
  const color = scoreColor(score);
  const { label: verdictLabel, color: verdictColor } = VERDICT_CONFIG[verdict];

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeFraction = 0.75;
  const totalArcLen = circumference * strokeFraction;
  const fillLen = totalArcLen * (score / 100);
  const gapLen = circumference - totalArcLen;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width="220" height="180" viewBox="0 0 220 180">
          {/* Background track */}
          <circle
            cx="110"
            cy="120"
            r={radius}
            fill="none"
            stroke="var(--color-bg-overlay)"
            strokeWidth="10"
            strokeDasharray={`${totalArcLen} ${gapLen}`}
            strokeDashoffset={circumference * 0.125}
            strokeLinecap="round"
            transform="rotate(180 110 120)"
          />
          {/* Filled arc */}
          <motion.circle
            cx="110"
            cy="120"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${totalArcLen} ${gapLen}`}
            strokeDashoffset={circumference * 0.125}
            transform="rotate(180 110 120)"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{
              strokeDasharray: `${fillLen} ${circumference - fillLen}`,
            }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pb-6">
          <AnimatedScore
            value={score}
            className="font-bold tabular-nums"
            color={color}
            fontSize={48}
          />
          <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
            {scoreLabel(score)}
          </p>
        </div>
      </div>

      <div
        className="px-4 py-1.5 rounded-full text-sm font-medium"
        style={{
          background: `${verdictColor}18`,
          color: verdictColor,
          border: `1px solid ${verdictColor}`,
        }}
      >
        {verdictLabel}
      </div>
    </div>
  );
}
