"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const DEMO_DATA = [
  { subject: "Hook", value: 72 },
  { subject: "Dwell", value: 58 },
  { subject: "Reply", value: 64 },
  { subject: "Share", value: 45 },
  { subject: "Novelty", value: 81 },
  { subject: "Authority", value: 67 },
];

interface SignalRadarProps {
  data?: typeof DEMO_DATA;
}

export function SignalRadar({ data = DEMO_DATA }: SignalRadarProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="rounded-xl p-5"
      style={{
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-border-subtle)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
            Signal Profile
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
            Average across recent analyses
          </p>
        </div>
        <div
          className="text-[10px] px-2 py-1 rounded-full"
          style={{
            background: "var(--color-accent-muted)",
            color: "var(--color-accent)",
            border: "1px solid var(--color-accent)",
          }}
        >
          live
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={data} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
          <PolarGrid stroke="var(--color-border-subtle)" strokeOpacity={0.6} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "var(--color-text-tertiary)", fontSize: 10 }}
          />
          <Radar
            name="signals"
            dataKey="value"
            stroke="var(--color-accent)"
            fill="var(--color-accent)"
            fillOpacity={0.12}
            strokeWidth={1.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
