"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Copy, ArrowRight } from "lucide-react";
import { RewriteChange } from "@/types/analysis";

const CATEGORY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  "generic-ai":       { bg: "var(--color-danger-muted)",  text: "var(--color-danger)",  label: "Generic AI"       },
  "engagement-bait":  { bg: "var(--color-warning-muted)", text: "var(--color-warning)", label: "Engagement Bait"  },
  "cliche":           { bg: "rgba(139,92,246,0.12)",      text: "#a78bfa",             label: "Cliché"            },
  "low-density":      { bg: "rgba(59,130,246,0.12)",      text: "#60a5fa",             label: "Low Density"       },
  "synthetic-cadence":{ bg: "rgba(20,184,166,0.12)",      text: "#2dd4bf",             label: "Synthetic Cadence" },
  "startup-speak":    { bg: "rgba(249,115,22,0.12)",      text: "#fb923c",             label: "Startup Speak"     },
};

function categoryStyle(cat: string) {
  return CATEGORY_COLORS[cat] ?? { bg: "var(--color-bg-overlay)", text: "var(--color-text-tertiary)", label: cat };
}

interface CleanRewriteProps {
  cleanRewrite: string;
  changelog: RewriteChange[];
}

export function CleanRewrite({ cleanRewrite, changelog }: CleanRewriteProps) {
  const [copied, setCopied] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function copy() {
    navigator.clipboard.writeText(cleanRewrite);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="space-y-4">
      {/* Clean rewrite block */}
      <div
        className="rounded-xl p-5"
        style={{
          background: "var(--color-bg-surface)",
          border: "1px solid var(--color-border-subtle)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--color-accent)" }}
            />
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-primary)" }}>
              Clean Version
            </p>
          </div>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-lg transition-all"
            style={{
              background: copied ? "var(--color-accent-muted)" : "var(--color-bg-elevated)",
              color: copied ? "var(--color-accent)" : "var(--color-text-tertiary)",
              border: `1px solid ${copied ? "var(--color-accent)" : "var(--color-border-default)"}`,
            }}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <p
          className="text-sm leading-relaxed whitespace-pre-wrap"
          style={{ color: "var(--color-text-primary)" }}
        >
          {cleanRewrite}
        </p>

        {changelog.length > 0 && (
          <div
            className="mt-4 pt-3 flex items-center gap-2"
            style={{ borderTop: "1px solid var(--color-border-subtle)" }}
          >
            <span className="text-[10px]" style={{ color: "var(--color-text-disabled)" }}>
              {changelog.length} change{changelog.length !== 1 ? "s" : ""} made
            </span>
            <div className="flex gap-1 flex-wrap">
              {Array.from(new Set(changelog.map((c) => c.category))).map((cat) => {
                const s = categoryStyle(cat);
                return (
                  <span
                    key={cat}
                    className="text-[9px] px-1.5 py-0.5 rounded-full"
                    style={{ background: s.bg, color: s.text }}
                  >
                    {s.label}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Changelog */}
      {changelog.length > 0 && (
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-primary)" }}>
              What Changed
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
              Every edit made, why it was slop, and what replaced it.
            </p>
          </div>

          <div className="divide-y" style={{ borderColor: "var(--color-border-subtle)" }}>
            {changelog.map((change, i) => {
              const s = categoryStyle(change.category);
              const isOpen = openIndex === i;

              return (
                <div key={i}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full px-5 py-3.5 flex items-start gap-3 text-left transition-colors hover:bg-[var(--color-bg-elevated)]"
                  >
                    {/* Index */}
                    <span
                      className="text-[10px] font-mono w-5 flex-shrink-0 mt-0.5"
                      style={{ color: "var(--color-text-disabled)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Strikethrough original → replacement */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 flex-wrap">
                        <span
                          className="text-xs line-through leading-relaxed"
                          style={{ color: "var(--color-text-disabled)" }}
                        >
                          {change.original.length > 80
                            ? change.original.slice(0, 80) + "…"
                            : change.original}
                        </span>
                        <ArrowRight size={11} style={{ color: "var(--color-text-disabled)", flexShrink: 0, marginTop: 3 }} />
                        <span
                          className="text-xs leading-relaxed font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {change.replacement.length > 80
                            ? change.replacement.slice(0, 80) + "…"
                            : change.replacement}
                        </span>
                      </div>
                    </div>

                    {/* Category pill + expand chevron */}
                    <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded-full hidden sm:block"
                        style={{ background: s.bg, color: s.text }}
                      >
                        {s.label}
                      </span>
                      <ChevronDown
                        size={13}
                        style={{
                          color: "var(--color-text-tertiary)",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}
                      />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          className="px-5 pb-4 pt-1 space-y-3"
                          style={{ background: "var(--color-bg-elevated)" }}
                        >
                          {/* Full original */}
                          <div>
                            <p className="text-[10px] font-medium mb-1 uppercase tracking-wider" style={{ color: "var(--color-text-disabled)" }}>
                              Original
                            </p>
                            <p
                              className="text-xs leading-relaxed p-3 rounded-lg"
                              style={{
                                background: "var(--color-danger-muted)",
                                color: "var(--color-danger)",
                                border: "1px solid rgba(239,68,68,0.2)",
                              }}
                            >
                              {change.original}
                            </p>
                          </div>
                          {/* Full replacement */}
                          <div>
                            <p className="text-[10px] font-medium mb-1 uppercase tracking-wider" style={{ color: "var(--color-text-disabled)" }}>
                              Replaced with
                            </p>
                            <p
                              className="text-xs leading-relaxed p-3 rounded-lg"
                              style={{
                                background: "var(--color-accent-muted)",
                                color: "var(--color-accent)",
                                border: "1px solid rgba(163,230,53,0.2)",
                              }}
                            >
                              {change.replacement}
                            </p>
                          </div>
                          {/* Reason */}
                          <div>
                            <p className="text-[10px] font-medium mb-1 uppercase tracking-wider" style={{ color: "var(--color-text-disabled)" }}>
                              Why
                            </p>
                            <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                              {change.reason}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
