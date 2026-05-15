"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, BrainCircuit } from "lucide-react";
import { ContentPlan } from "@/types/analysis";
import { AIThinkingState } from "@/components/shared/AIThinkingState";
import { CopyButton } from "@/components/shared/CopyButton";
import { countChars } from "@/lib/utils/format";
import { MAX_INPUT_CHARS } from "@/constants/models";

const TONE_LABELS: Record<string, string> = {
  authority: "Authority",
  founder: "Founder",
  technical: "Technical",
  storytelling: "Story",
  contrarian: "Contrarian",
  banger: "Banger",
  minimalist: "Minimal",
  "high-curiosity": "Curiosity",
};

export default function StrategyPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContentPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"calendar" | "themes" | "arcs" | "positioning">(
    "calendar"
  );

  const charCount = countChars(input);
  const overLimit = charCount > MAX_INPUT_CHARS;

  async function generate() {
    if (!input.trim() || loading || overLimit) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: input }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Strategy generation failed");
      }
      setResult(await res.json());
      setActiveTab("calendar");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const TABS = [
    { id: "calendar" as const, label: "7-Day Calendar" },
    { id: "themes" as const, label: "Weekly Themes" },
    { id: "arcs" as const, label: "Narrative Arcs" },
    { id: "positioning" as const, label: "Positioning" },
  ];

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1
          className="font-display text-[24px] leading-tight mb-1"
          style={{ color: "var(--color-text-primary)" }}
        >
          Strategy Brain
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          Generate a 30-day compounding content strategy. Narrative arcs, authority positioning, niche dominance.
        </p>
      </motion.div>

      <div className="grid grid-cols-[380px_1fr] gap-6">
        {/* Input */}
        <div className="space-y-4">
          <div
            className="rounded-xl p-5"
            style={{
              background: "var(--color-bg-surface)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <p className="text-xs font-medium mb-3" style={{ color: "var(--color-text-primary)" }}>
              Your Context
            </p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe yourself: your niche, expertise, audience, goals, what you're building..."
              rows={8}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-text-disabled)] leading-relaxed"
              style={{ color: "var(--color-text-primary)" }}
            />
            <button
              onClick={generate}
              disabled={!input.trim() || loading || overLimit}
              className="mt-4 w-full flex items-center justify-center gap-2 text-sm px-4 py-2.5 rounded-lg font-medium transition-all disabled:opacity-40"
              style={{ background: "var(--color-accent)", color: "#09090b" }}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <BrainCircuit size={14} />}
              {loading ? "Building strategy..." : "Generate Strategy"}
            </button>
          </div>

          {error && (
            <div
              className="rounded-xl p-4 text-sm"
              style={{
                background: "var(--color-danger-muted)",
                color: "var(--color-danger)",
                border: "1px solid var(--color-danger)",
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-xl p-6"
                style={{
                  background: "var(--color-bg-surface)",
                  border: "1px solid var(--color-border-subtle)",
                }}
              >
                <AIThinkingState label="Building your 30-day strategy..." />
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                {/* Tabs */}
                <div className="flex gap-1">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="text-xs px-3 py-1.5 rounded-lg transition-all"
                      style={{
                        background:
                          activeTab === tab.id
                            ? "var(--color-bg-elevated)"
                            : "transparent",
                        color:
                          activeTab === tab.id
                            ? "var(--color-text-primary)"
                            : "var(--color-text-tertiary)",
                        border: `1px solid ${
                          activeTab === tab.id
                            ? "var(--color-border-strong)"
                            : "transparent"
                        }`,
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === "calendar" && (
                    <motion.div
                      key="calendar"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {result.contentCalendar.map((entry, i) => (
                        <div
                          key={i}
                          className="rounded-xl p-4 flex gap-4"
                          style={{
                            background: "var(--color-bg-surface)",
                            border: "1px solid var(--color-border-subtle)",
                          }}
                        >
                          <div
                            className="text-xs font-semibold w-10 flex-shrink-0 mt-0.5"
                            style={{ color: "var(--color-accent)" }}
                          >
                            {entry.day}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                                {entry.topic}
                              </p>
                              <span
                                className="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0"
                                style={{
                                  background: "var(--color-bg-elevated)",
                                  color: "var(--color-text-tertiary)",
                                  border: "1px solid var(--color-border-default)",
                                }}
                              >
                                {TONE_LABELS[entry.tone] ?? entry.tone}
                              </span>
                            </div>
                            <p className="text-xs mb-2" style={{ color: "var(--color-accent)" }}>
                              Hook: {entry.hook}
                            </p>
                            <p className="text-[11px]" style={{ color: "var(--color-text-tertiary)" }}>
                              {entry.notes}
                            </p>
                          </div>
                          <CopyButton text={`${entry.topic}\n\n${entry.hook}`} />
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === "themes" && (
                    <motion.div
                      key="themes"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {result.weeklyThemes.map((theme, i) => (
                        <div
                          key={i}
                          className="rounded-xl p-5"
                          style={{
                            background: "var(--color-bg-surface)",
                            border: "1px solid var(--color-border-subtle)",
                          }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="text-[10px] font-bold"
                              style={{ color: "var(--color-accent)" }}
                            >
                              WK {i + 1}
                            </span>
                            <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                              {theme.theme}
                            </p>
                          </div>
                          <p className="text-xs mb-3" style={{ color: "var(--color-text-secondary)" }}>
                            {theme.rationale}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {theme.keyMessages.map((msg, j) => (
                              <span
                                key={j}
                                className="text-[10px] px-2 py-1 rounded-full"
                                style={{
                                  background: "var(--color-bg-elevated)",
                                  color: "var(--color-text-secondary)",
                                  border: "1px solid var(--color-border-default)",
                                }}
                              >
                                {msg}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === "arcs" && (
                    <motion.div
                      key="arcs"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {result.narrativeArcs.map((arc, i) => (
                        <div
                          key={i}
                          className="rounded-xl p-5"
                          style={{
                            background: "var(--color-bg-surface)",
                            border: "1px solid var(--color-border-subtle)",
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                              {arc.title}
                            </p>
                            <div className="text-right">
                              <p className="text-[10px]" style={{ color: "var(--color-accent)" }}>
                                {arc.posts} posts
                              </p>
                              <p className="text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>
                                {arc.duration}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                            {arc.description}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === "positioning" && (
                    <motion.div
                      key="positioning"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {[
                        { label: "Audience Positioning", content: result.audiencePositioning },
                        { label: "Authority Building Strategy", content: result.authorityBuildingStrategy },
                        { label: "Niche Dominance Strategy", content: result.nicheDominanceStrategy },
                      ].map(({ label, content }) => (
                        <div
                          key={label}
                          className="rounded-xl p-5"
                          style={{
                            background: "var(--color-bg-surface)",
                            border: "1px solid var(--color-border-subtle)",
                          }}
                        >
                          <p
                            className="text-[10px] font-medium mb-2"
                            style={{ color: "var(--color-text-tertiary)" }}
                          >
                            {label.toUpperCase()}
                          </p>
                          <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                            {content}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="rounded-xl h-full min-h-[300px] flex flex-col items-center justify-center gap-3"
                style={{
                  background: "var(--color-bg-surface)",
                  border: "1px solid var(--color-border-subtle)",
                }}
              >
                <BrainCircuit size={24} style={{ color: "var(--color-text-tertiary)" }} />
                <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
                  Describe your context to generate a strategy
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
