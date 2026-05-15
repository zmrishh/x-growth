"use client";

import { motion } from "framer-motion";
import { scoreColor } from "@/lib/utils/scoring";

interface ScoreBarProps {
  label: string;
  value: number;
  invert?: boolean;
  description?: string;
  delay?: number;
}

export function ScoreBar({ label, value, invert = false, description, delay = 0 }: ScoreBarProps) {
  const displayValue = invert ? 100 - value : value;
  const color = scoreColor(displayValue);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
            {label}
          </span>
          {description && (
            <p className="text-[10px] mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
              {description}
            </p>
          )}
        </div>
        <span
          className="text-xs font-semibold tabular-nums"
          style={{ color }}
        >
          {value}
        </span>
      </div>
      <div
        className="h-1 rounded-full overflow-hidden"
        style={{ background: "var(--color-bg-overlay)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${displayValue}%` }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
