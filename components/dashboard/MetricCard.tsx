"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  accent?: string;
  icon?: ReactNode;
  index?: number;
}

export function MetricCard({
  label,
  value,
  subtext,
  accent,
  icon,
  index = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-border-subtle)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
          {label}
        </span>
        {icon && (
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "var(--color-bg-elevated)" }}
          >
            {icon}
          </div>
        )}
      </div>
      <div>
        <p
          className="text-2xl font-semibold tabular-nums leading-none"
          style={{ color: accent ?? "var(--color-text-primary)" }}
        >
          {value}
        </p>
        {subtext && (
          <p className="text-[11px] mt-1" style={{ color: "var(--color-text-tertiary)" }}>
            {subtext}
          </p>
        )}
      </div>
    </motion.div>
  );
}
