"use client";

import { useState } from "react";
import { usePersistedState } from "@/lib/hooks/usePersistedState";
import { addHistoryEntry } from "@/lib/hooks/useHistory";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, Zap } from "lucide-react";
import { HookAnalysis } from "@/types/analysis";
import { AIThinkingState } from "@/components/shared/AIThinkingState";
import { CopyButton } from "@/components/shared/CopyButton";
import { scoreColor, scoreLabel } from "@/lib/utils/scoring";
import { AnimatedScore } from "@/components/shared/AnimatedScore";
import { countChars } from "@/lib/utils/format";
import { MAX_INPUT_CHARS } from "@/constants/models";

const EXAMPLE_TWEETS = [
  "I learned something important yesterday that changed how I think about productivity. Most people focus on doing more, but the real secret is doing less. Here's what I mean...",
  "Attention is not given. It's taken by force.\n\nEvery scroll is a war. Your first line is the only weapon you have.",
  "Just shipped a feature our users have been asking for months. Excited to see the impact it has on retention.",
];

const TECHNIQUE_COLORS: Record<string, string> = {
  "Curiosity Gap": "#a78bfa",
  "Pattern Interrupt": "var(--color-accent)",
  "Compression": "#38bdf8",
  "Stakes Framing": "var(--color-danger)",
  "Specificity": "var(--color-warning)",
  "Contrarian Setup": "#fb923c",
  "Identity Resonance": "#34d399",
};

export default function HookLabPage() {
  const [input, setInput] = usePersistedState("hooks-lab:input", "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = usePersistedState<HookAnalysis | null>("hooks-lab:result", null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRewrite, setSelectedRewrite] = useState<number>(0);

  const charCount = countChars(input);
  const overLimit = charCount > MAX_INPUT_CHARS;

  async function optimize() {
    if (!input.trim() || loading || overLimit) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/optimize-hook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tweet: input }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Hook optimization failed");
      }
      const data: HookAnalysis = await res.json();
      setResult(data);
      setSelectedRewrite(0);
      addHistoryEntry({
        module: "hooks-lab",
        inputPreview: input.slice(0, 120),
        summary: `Hook score: ${data.hookScore} · ${data.rewrites.length} rewrites`,
        timestamp: Date.now(),
        input,
        result: data,
      });
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
          Hook Laboratory
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          Rewrite your first line for maximum scroll-stopping power. The hook is the entire game.
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Input */}
        <div className="grid grid-cols-[1fr_220px] gap-4">
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
              placeholder="Paste your tweet — the first line will be analyzed and rewritten..."
              rows={4}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-text-disabled)] leading-relaxed"
              style={{ color: "var(--color-text-primary)" }}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") optimize();
              }}
            />
            <div
              className="mt-3 pt-3 flex items-center justify-between"
              style={{ borderTop: "1px solid var(--color-border-subtle)" }}
            >
              <span className="text-[10px]" style={{ color: "var(--color-text-disabled)" }}>
                ⌘↵ to optimize
              </span>
              <button
                onClick={optimize}
                disabled={!input.trim() || loading || overLimit}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-40"
                style={{ background: "var(--color-accent)", color: "#09090b" }}
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                {loading ? "Optimizing..." : "Optimize Hook"}
              </button>
            </div>
          </div>

          {/* Examples */}
          <div
            className="rounded-xl p-4"
            style={{
              background: "var(--color-bg-surface)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <p className="text-[10px] font-medium mb-3" style={{ color: "var(--color-text-tertiary)" }}>
              EXAMPLES
            </p>
            <div className="space-y-2">
              {EXAMPLE_TWEETS.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setInput(ex)}
                  className="w-full text-left px-2 py-2 rounded-lg text-[11px] transition-colors hover:bg-[var(--color-bg-hover)]"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {ex.slice(0, 55)}...
                </button>
              ))}
            </div>
          </div>
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

        {/* Results */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl p-6"
              style={{
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              <AIThinkingState label="Engineering your hook..." />
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-[300px_1fr] gap-6"
            >
              {/* Original hook analysis */}
              <div className="space-y-4">
                <div
                  className="rounded-xl p-5"
                  style={{
                    background: "var(--color-bg-surface)",
                    border: "1px solid var(--color-border-subtle)",
                  }}
                >
                  <p className="text-[10px] font-medium mb-3" style={{ color: "var(--color-text-tertiary)" }}>
                    ORIGINAL HOOK
                  </p>
                  <p
                    className="text-sm leading-relaxed mb-4 italic"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    "{result.originalHook}"
                  </p>
                  <div className="flex items-center gap-3">
                    <AnimatedScore
                      value={result.hookScore}
                      fontSize={28}
                      className="font-bold tabular-nums"
                      color={scoreColor(result.hookScore)}
                    />
                    <span className="text-xs" style={{ color: scoreColor(result.hookScore) }}>
                      {scoreLabel(result.hookScore)}
                    </span>
                  </div>

                  {result.weaknesses.length > 0 && (
                    <div className="mt-4 space-y-1.5">
                      <p className="text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>
                        WEAKNESSES
                      </p>
                      {result.weaknesses.map((w, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span style={{ color: "var(--color-danger)", fontSize: 10 }}>✗</span>
                          <p className="text-[11px]" style={{ color: "var(--color-text-tertiary)" }}>
                            {w}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rewrite selector */}
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "var(--color-bg-surface)",
                    border: "1px solid var(--color-border-subtle)",
                  }}
                >
                  <p className="text-[10px] font-medium mb-2" style={{ color: "var(--color-text-tertiary)" }}>
                    TECHNIQUES
                  </p>
                  <div className="space-y-1">
                    {result.rewrites.map((rw, i) => {
                      const color = TECHNIQUE_COLORS[rw.version] ?? "var(--color-accent)";
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedRewrite(i)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left"
                          style={{
                            background:
                              selectedRewrite === i
                                ? "var(--color-bg-hover)"
                                : "transparent",
                            border: `1px solid ${selectedRewrite === i ? "var(--color-border-default)" : "transparent"}`,
                          }}
                        >
                          <span
                            className="text-xs font-medium"
                            style={{
                              color: selectedRewrite === i ? color : "var(--color-text-secondary)",
                            }}
                          >
                            {rw.version}
                          </span>
                          <span
                            className="text-xs tabular-nums"
                            style={{ color: scoreColor(rw.score) }}
                          >
                            {rw.score}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Selected rewrite */}
              <AnimatePresence mode="wait">
                {result.rewrites[selectedRewrite] && (
                  <motion.div
                    key={selectedRewrite}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {(() => {
                      const rw = result.rewrites[selectedRewrite];
                      const color = TECHNIQUE_COLORS[rw.version] ?? "var(--color-accent)";
                      return (
                        <>
                          <div
                            className="rounded-xl p-6"
                            style={{
                              background: "var(--color-bg-surface)",
                              border: `1px solid var(--color-border-subtle)`,
                            }}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <span
                                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                                  style={{
                                    background: `${color}18`,
                                    color,
                                    border: `1px solid ${color}50`,
                                  }}
                                >
                                  {rw.version}
                                </span>
                                <span
                                  className="text-lg font-bold tabular-nums"
                                  style={{ color: scoreColor(rw.score) }}
                                >
                                  {rw.score}
                                </span>
                              </div>
                              <CopyButton text={rw.hook} />
                            </div>

                            <p
                              className="font-display text-[22px] leading-snug mb-4"
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {rw.hook}
                            </p>

                            <div
                              className="pt-4"
                              style={{ borderTop: "1px solid var(--color-border-subtle)" }}
                            >
                              <p className="text-[10px] mb-1" style={{ color: "var(--color-text-tertiary)" }}>
                                TECHNIQUE
                              </p>
                              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                                {rw.technique}
                              </p>
                            </div>
                          </div>

                          <div
                            className="rounded-xl p-5"
                            style={{
                              background: "var(--color-bg-surface)",
                              border: "1px solid var(--color-border-subtle)",
                            }}
                          >
                            <p className="text-[10px] font-medium mb-2" style={{ color: "var(--color-text-tertiary)" }}>
                              WHY THIS WORKS
                            </p>
                            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                              {rw.rationale}
                            </p>
                          </div>

                          {/* Score comparison */}
                          <div
                            className="rounded-xl p-5 grid grid-cols-2 gap-4"
                            style={{
                              background: "var(--color-bg-surface)",
                              border: "1px solid var(--color-border-subtle)",
                            }}
                          >
                            <div className="text-center">
                              <p className="text-[10px] mb-2" style={{ color: "var(--color-text-tertiary)" }}>
                                ORIGINAL
                              </p>
                              <p
                                className="text-2xl font-bold"
                                style={{ color: scoreColor(result.hookScore) }}
                              >
                                {result.hookScore}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] mb-2" style={{ color: "var(--color-text-tertiary)" }}>
                                REWRITTEN
                              </p>
                              <p
                                className="text-2xl font-bold"
                                style={{ color: scoreColor(rw.score) }}
                              >
                                {rw.score}
                              </p>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
