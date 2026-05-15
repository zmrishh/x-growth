"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { ViralityReport } from "@/types/analysis";
import { ScoreGauge } from "@/components/virality/ScoreGauge";
import { SignalBreakdown } from "@/components/virality/SignalBreakdown";
import { ReasoningPanel } from "@/components/virality/ReasoningPanel";
import { AIThinkingState } from "@/components/shared/AIThinkingState";
import { CopyButton } from "@/components/shared/CopyButton";
import { countChars } from "@/lib/utils/format";
import { MAX_INPUT_CHARS } from "@/constants/models";

const EXAMPLE_TWEETS = [
  "Most people building in public are doing it wrong.\n\nThey share progress. Not thinking.\n\nThe ones who compound fastest share the cognitive residue — the reasoning behind decisions that didn't work.",
  "Attention is not given. It's taken by force.\n\nEvery scroll is a war. Your first line is the only weapon you have.",
  "I'm excited to share that we've reached 10,000 users! 🎉\n\nThank you to everyone who supported our journey. The team has worked incredibly hard and we couldn't have done it without you! 🚀",
];

export default function ViralityPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ViralityReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const charCount = countChars(input);
  const overLimit = charCount > MAX_INPUT_CHARS;

  async function analyze() {
    if (!input.trim() || loading || overLimit) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Analysis failed");
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
          Virality Analyzer
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          Score any tweet across 12 distribution signals. No optimism — only signal.
        </p>
      </motion.div>

      <div className="grid grid-cols-[1fr_380px] gap-6">
        {/* Left: Input */}
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
                Tweet Content
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
              placeholder="Paste your tweet draft here..."
              rows={6}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-text-disabled)] leading-relaxed"
              style={{ color: "var(--color-text-primary)" }}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") analyze();
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
                onClick={analyze}
                disabled={!input.trim() || loading || overLimit}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-40"
                style={{ background: "var(--color-accent)", color: "#09090b" }}
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ArrowRight size={14} />
                )}
                {loading ? "Analyzing..." : "Analyze"}
              </button>
            </div>
          </div>

          {/* Example tweets */}
          <div
            className="rounded-xl p-4"
            style={{
              background: "var(--color-bg-surface)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <p
              className="text-[10px] font-medium mb-3"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              LOAD EXAMPLE
            </p>
            <div className="space-y-2">
              {EXAMPLE_TWEETS.map((tweet, i) => (
                <button
                  key={i}
                  onClick={() => setInput(tweet)}
                  className="w-full text-left px-3 py-2 rounded-lg transition-colors hover:bg-[var(--color-bg-hover)] text-xs"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  <span
                    className="font-medium mr-2"
                    style={{ color: "var(--color-text-disabled)" }}
                  >
                    {i + 1}.
                  </span>
                  {tweet.slice(0, 80)}...
                </button>
              ))}
            </div>
          </div>

          {/* Signal breakdown */}
          <AnimatePresence>
            {(result || loading) && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl p-5"
                style={{
                  background: "var(--color-bg-surface)",
                  border: "1px solid var(--color-border-subtle)",
                }}
              >
                {loading ? (
                  <AIThinkingState label="Evaluating distribution signals..." />
                ) : result ? (
                  <>
                    <div className="flex items-center justify-between mb-5">
                      <p className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
                        Signal Breakdown
                      </p>
                      <CopyButton text={JSON.stringify(result, null, 2)} />
                    </div>
                    <SignalBreakdown signals={result.signals} />
                  </>
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

        {/* Right: Score gauge + reasoning */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-xl p-8 flex flex-col items-center justify-center"
                style={{
                  background: "var(--color-bg-surface)",
                  border: "1px solid var(--color-border-subtle)",
                  minHeight: 280,
                }}
              >
                <div className="flex gap-1.5 mb-4">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: "var(--color-accent)",
                        animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                  Computing virality score...
                </p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl p-6 flex flex-col items-center"
                style={{
                  background: "var(--color-bg-surface)",
                  border: "1px solid var(--color-border-subtle)",
                }}
              >
                <ScoreGauge
                  score={result.overallScore}
                  verdict={result.verdict}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="rounded-xl p-8 flex flex-col items-center justify-center gap-3"
                style={{
                  background: "var(--color-bg-surface)",
                  border: "1px solid var(--color-border-subtle)",
                  minHeight: 280,
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: "var(--color-bg-elevated)" }}
                >
                  <span style={{ color: "var(--color-text-tertiary)", fontSize: 20 }}>
                    ◎
                  </span>
                </div>
                <p className="text-sm text-center" style={{ color: "var(--color-text-tertiary)" }}>
                  Paste a tweet to begin analysis
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ReasoningPanel
                reasoning={result.reasoning}
                improvements={result.improvements}
                estimatedReadTimeSeconds={result.estimatedReadTimeSeconds}
              />
            </motion.div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
