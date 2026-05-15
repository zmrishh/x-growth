"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { ViralityReport } from "@/types/analysis";
import { scoreColor, scoreLabel } from "@/lib/utils/scoring";
import { countChars } from "@/lib/utils/format";
import { MAX_INPUT_CHARS } from "@/constants/models";

export function QuickAnalyze() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ViralityReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!input.trim() || loading) return;
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

      const data: ViralityReport = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const charCount = countChars(input);
  const overLimit = charCount > MAX_INPUT_CHARS;

  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-border-subtle)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
          Quick Analyze
        </p>
        <span className="text-[10px]" style={{ color: overLimit ? "var(--color-danger)" : "var(--color-text-tertiary)" }}>
          {charCount}/{MAX_INPUT_CHARS}
        </span>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste a tweet draft to analyze..."
        rows={3}
        className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-text-disabled)] resize-none"
        style={{ color: "var(--color-text-primary)" }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAnalyze();
        }}
      />

      <div
        className="mt-3 pt-3 flex items-center justify-between"
        style={{ borderTop: "1px solid var(--color-border-subtle)" }}
      >
        <span className="text-[10px]" style={{ color: "var(--color-text-disabled)" }}>
          ⌘↵ to analyze
        </span>
        <button
          onClick={handleAnalyze}
          disabled={!input.trim() || loading || overLimit}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-40"
          style={{
            background: "var(--color-accent)",
            color: "#09090b",
          }}
        >
          {loading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <ArrowRight size={12} />
          )}
          Analyze
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 pt-4"
            style={{ borderTop: "1px solid var(--color-border-subtle)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="text-2xl font-bold tabular-nums"
                  style={{ color: scoreColor(result.overallScore) }}
                >
                  {result.overallScore}
                </span>
                <div>
                  <p className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
                    {scoreLabel(result.overallScore)}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>
                    virality score
                  </p>
                </div>
              </div>
              <span
                className="text-xs px-2 py-1 rounded-full capitalize"
                style={{
                  background:
                    result.verdict === "distribute"
                      ? "var(--color-success-muted)"
                      : result.verdict === "scrap"
                      ? "var(--color-danger-muted)"
                      : "var(--color-warning-muted)",
                  color:
                    result.verdict === "distribute"
                      ? "var(--color-success)"
                      : result.verdict === "scrap"
                      ? "var(--color-danger)"
                      : "var(--color-warning)",
                  border: `1px solid ${
                    result.verdict === "distribute"
                      ? "var(--color-success)"
                      : result.verdict === "scrap"
                      ? "var(--color-danger)"
                      : "var(--color-warning)"
                  }`,
                }}
              >
                {result.verdict}
              </span>
            </div>
            <p className="text-xs prose-intelligence">{result.reasoning}</p>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 p-3 rounded-lg text-xs"
            style={{
              background: "var(--color-danger-muted)",
              color: "var(--color-danger)",
              border: "1px solid var(--color-danger)",
            }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
