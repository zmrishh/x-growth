"use client";

import { motion } from "framer-motion";
import { ImageAnalysis } from "@/types/reply";
import { FileImage, MessageSquare, Laugh, Image } from "lucide-react";

interface ImageAnalysisPanelProps {
  analyses: ImageAnalysis[];
}

const CONTENT_TYPE_ICONS: Record<string, React.ReactNode> = {
  "tweet-screenshot": <MessageSquare size={12} />,
  meme: <Laugh size={12} />,
  conversation: <MessageSquare size={12} />,
  image: <Image size={12} />,
  other: <FileImage size={12} />,
};

export function ImageAnalysisPanel({ analyses }: ImageAnalysisPanelProps) {
  if (analyses.length === 0) return null;

  return (
    <div className="space-y-3">
      <p
        className="text-[10px] font-medium uppercase tracking-wider"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        Image Analysis ({analyses.length})
      </p>
      {analyses.map((analysis, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="rounded-xl p-4"
          style={{
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span style={{ color: "var(--color-signal)" }}>
              {CONTENT_TYPE_ICONS[analysis.contentType] ?? CONTENT_TYPE_ICONS.other}
            </span>
            <span className="text-[10px] font-medium" style={{ color: "var(--color-signal)" }}>
              {analysis.contentType.replace(/-/g, " ")}
            </span>
            <span
              className="ml-auto text-[9px] px-1.5 py-0.5 rounded"
              style={{
                background:
                  analysis.visualSlopRisk > 60
                    ? "var(--color-danger-muted)"
                    : "var(--color-bg-overlay)",
                color:
                  analysis.visualSlopRisk > 60
                    ? "var(--color-danger)"
                    : "var(--color-text-tertiary)",
              }}
            >
              visual slop: {analysis.visualSlopRisk}
            </span>
          </div>

          {analysis.extractedText && (
            <div
              className="rounded-lg p-3 mb-3"
              style={{ background: "var(--color-bg-surface)" }}
            >
              <p className="text-[9px] mb-1 uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
                Extracted Text
              </p>
              <p className="text-xs leading-relaxed italic" style={{ color: "var(--color-text-secondary)" }}>
                "{analysis.extractedText}"
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <p className="text-[9px] mb-0.5 uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
                Emotional Tone
              </p>
              <p className="text-[11px]" style={{ color: "var(--color-text-secondary)" }}>
                {analysis.emotionalTone}
              </p>
            </div>
            <div>
              <p className="text-[9px] mb-0.5 uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
                Intent
              </p>
              <p className="text-[11px]" style={{ color: "var(--color-text-secondary)" }}>
                {analysis.engagementIntent}
              </p>
            </div>
          </div>

          {analysis.memeStructure && (
            <div className="mb-3">
              <p className="text-[9px] mb-0.5 uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
                Meme Structure
              </p>
              <p className="text-[11px]" style={{ color: "var(--color-text-secondary)" }}>
                {analysis.memeStructure}
              </p>
            </div>
          )}

          {analysis.keyInsights.length > 0 && (
            <div className="space-y-1">
              {analysis.keyInsights.map((insight, j) => (
                <div key={j} className="flex items-start gap-1.5">
                  <span style={{ color: "var(--color-accent)", fontSize: 10, marginTop: 1 }}>→</span>
                  <p className="text-[11px]" style={{ color: "var(--color-text-tertiary)" }}>
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
