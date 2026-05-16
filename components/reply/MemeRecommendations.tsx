"use client";

import { motion } from "framer-motion";
import { MemeRecommendation } from "@/types/reply";
import { Search, Image } from "lucide-react";

interface MemeRecommendationsProps {
  recommendations: MemeRecommendation[];
}

const ENERGY_COLORS: Record<string, string> = {
  low: "var(--color-text-secondary)",
  medium: "var(--color-warning)",
  high: "var(--color-danger)",
};

const STYLE_ICONS: Record<string, string> = {
  "reaction-image": "😐",
  "low-quality-wojak": "😔",
  "screenshot-tweet": "🖼",
  "zoomed-in-face": "🔍",
  "text-only": "T",
  surreal: "🌀",
  "object-labeling": "🏷",
  "expanding-brain": "🧠",
  drakeposting: "🦆",
  "distracted-boyfriend": "👀",
  "nothing-meme-needed": "✕",
};

export function MemeRecommendations({ recommendations }: MemeRecommendationsProps) {
  const relevant = recommendations.filter(
    (r) => r.style !== "nothing-meme-needed"
  );
  const noMeme = recommendations.find((r) => r.style === "nothing-meme-needed");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p
          className="text-[10px] font-medium uppercase tracking-wider"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          Visual Recommendations
        </p>
        <span className="text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>
          {relevant.length} suggestions
        </span>
      </div>

      {noMeme && (
        <div
          className="rounded-lg p-3 flex items-start gap-3"
          style={{
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <span className="text-base">✕</span>
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>
              Some replies work better without a visual
            </p>
            <p className="text-[11px]" style={{ color: "var(--color-text-tertiary)" }}>
              {noMeme.rationale}
            </p>
          </div>
        </div>
      )}

      {relevant.map((rec, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="rounded-xl p-4"
          style={{
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
              style={{ background: "var(--color-bg-overlay)" }}
            >
              {STYLE_ICONS[rec.style] ?? "🎨"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
                  {rec.style.replace(/-/g, " ")}
                </p>
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded-full capitalize flex-shrink-0"
                  style={{
                    background: "var(--color-bg-overlay)",
                    color: ENERGY_COLORS[rec.energyLevel],
                    border: `1px solid ${ENERGY_COLORS[rec.energyLevel]}40`,
                  }}
                >
                  {rec.energyLevel} energy
                </span>
              </div>
              <p className="text-[11px] mb-2" style={{ color: "var(--color-text-secondary)" }}>
                {rec.description}
              </p>
              <p className="text-[11px] mb-3" style={{ color: "var(--color-text-tertiary)" }}>
                {rec.rationale}
              </p>

              {/* Applicable tones */}
              <div className="flex flex-wrap gap-1 mb-3">
                {rec.applicableReplies.map((tone) => (
                  <span
                    key={tone}
                    className="text-[9px] px-1.5 py-0.5 rounded"
                    style={{
                      background: "var(--color-bg-surface)",
                      color: "var(--color-text-tertiary)",
                      border: "1px solid var(--color-border-subtle)",
                    }}
                  >
                    {tone}
                  </span>
                ))}
              </div>

              {/* Search query */}
              <div
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                style={{
                  background: "var(--color-bg-surface)",
                  border: "1px solid var(--color-border-subtle)",
                }}
              >
                <Search size={10} style={{ color: "var(--color-text-tertiary)" }} />
                <span className="text-[10px] font-mono" style={{ color: "var(--color-text-secondary)" }}>
                  {rec.searchQuery}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
