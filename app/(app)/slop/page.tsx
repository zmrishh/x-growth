"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { SlopReport } from "@/types/analysis";
import { SlopMeter } from "@/components/slop/SlopMeter";
import { PhraseFlagging } from "@/components/slop/PhraseFlagging";
import { RewriteSuggestions } from "@/components/slop/RewriteSuggestions";
import { AIThinkingState } from "@/components/shared/AIThinkingState";
import { ExpandableReasoning } from "@/components/shared/ExpandableReasoning";
import { countChars } from "@/lib/utils/format";
import { MAX_INPUT_CHARS } from "@/constants/models";

const SLOP_EXAMPLES = [
  `In today's digital landscape, it's important to note that building in public has become a game changer for founders. The key takeaway here is that transparency drives trust, and trust drives growth. Don't sleep on this opportunity to connect with your audience on a deeper level. At the end of the day, execution is everything. 🚀`,
  `Most people building in public are doing it wrong.\n\nThey share progress. Not thinking.\n\nThe ones who compound fastest share the cognitive residue — the reasoning behind decisions that didn't work.`,
];

export default function SlopPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SlopReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const charCount = countChars(input);
  const overLimit = charCount > MAX_INPUT_CHARS;

  async function detect() {
    if (!input.trim() || loading || overLimit) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/slop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Detection failed");
      }
      setResult(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

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
          Slop Detector
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          Identify generic AI patterns, clichés, engagement bait, and low-density writing.
        </p>
      </motion.div>

      <div className="grid grid-cols-[1fr_380px] gap-6">
        {/* Left: Input + Results */}
        <div className="space-y-4">
          <div
            className="rounded-xl p-5"
            style={{
              background: "var(--color-bg-surface)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
                Content to Analyze
              </p>
              <span
                className="text-[10px]"
                style={{ color: overLimit ? "var(--color-danger)" : "var(--color-text-tertiary)" }}
              >
                {charCount}/{MAX_INPUT_CHARS}
              </span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste content to analyze for slop patterns..."
              rows={6}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-text-disabled)] leading-relaxed"
              style={{ color: "var(--color-text-primary)" }}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") detect();
              }}
            />
            <div
              className="mt-4 pt-4 flex items-center justify-between"
              style={{ borderTop: "1px solid var(--color-border-subtle)" }}
            >
              <span className="text-[10px]" style={{ color: "var(--color-text-disabled)" }}>
                ⌘↵ to analyze
              </span>
              <button
                onClick={detect}
                disabled={!input.trim() || loading || overLimit}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-40"
                style={{ background: "var(--color-accent)", color: "#09090b" }}
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                {loading ? "Detecting..." : "Detect Slop"}
              </button>
            </div>
          </div>

          {/* Load examples */}
          <div
            className="rounded-xl p-4"
            style={{
              background: "var(--color-bg-surface)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <p className="text-[10px] font-medium mb-3" style={{ color: "var(--color-text-tertiary)" }}>
              LOAD EXAMPLE
            </p>
            <div className="space-y-2">
              {SLOP_EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setInput(ex)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs transition-colors hover:bg-[var(--color-bg-hover)]"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  <span className="font-medium mr-2" style={{ color: "var(--color-text-disabled)" }}>
                    {i + 1}.
                  </span>
                  {ex.slice(0, 80).replace(/\n/g, " ")}...
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {(loading || result) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {loading ? (
                  <div
                    className="rounded-xl p-6"
                    style={{
                      background: "var(--color-bg-surface)",
                      border: "1px solid var(--color-border-subtle)",
                    }}
                  >
                    <AIThinkingState label="Scanning for slop patterns..." />
                  </div>
                ) : result ? (
                  <div className="space-y-4">
                    <PhraseFlagging
                      originalText={input}
                      flaggedPhrases={result.flaggedPhrases}
                    />
                    {result.rewriteSuggestions.length > 0 && (
                      <RewriteSuggestions suggestions={result.rewriteSuggestions} />
                    )}
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>

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

        {/* Right: Score + Reasoning */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-xl p-8 flex flex-col items-center justify-center min-h-[200px]"
                style={{
                  background: "var(--color-bg-surface)",
                  border: "1px solid var(--color-border-subtle)",
                }}
              >
                <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                  Analyzing...
                </p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <SlopMeter score={result.slopScore} verdict={result.overallVerdict} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="rounded-xl p-8 flex flex-col items-center justify-center gap-3 min-h-[200px]"
                style={{
                  background: "var(--color-bg-surface)",
                  border: "1px solid var(--color-border-subtle)",
                }}
              >
                <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
                  Paste content to detect slop
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <ExpandableReasoning title="Detection Reasoning" defaultOpen>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--color-text-secondary)" }}>
                  {result.reasoning}
                </p>
                {result.slopCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {result.slopCategories.map((cat) => (
                      <span
                        key={cat}
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          background: "var(--color-bg-overlay)",
                          color: "var(--color-text-secondary)",
                          border: "1px solid var(--color-border-default)",
                        }}
                      >
                        {cat.replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                )}
              </ExpandableReasoning>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
