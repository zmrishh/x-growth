"use client";

import { useState } from "react";
import { usePersistedState } from "@/lib/hooks/usePersistedState";
import { addHistoryEntry } from "@/lib/hooks/useHistory";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { TrendSignal } from "@/types/analysis";
import { AIThinkingState } from "@/components/shared/AIThinkingState";
import { countChars } from "@/lib/utils/format";
import { MAX_INPUT_CHARS } from "@/constants/models";

const MOMENTUM_CONFIG = {
  rising: { label: "Rising", color: "var(--color-success)", Icon: TrendingUp },
  peaking: { label: "Peaking", color: "var(--color-warning)", Icon: Minus },
  declining: { label: "Declining", color: "var(--color-danger)", Icon: TrendingDown },
};

const COMPETITION_CONFIG = {
  low: { label: "Low competition", color: "var(--color-success)" },
  medium: { label: "Medium competition", color: "var(--color-warning)" },
  high: { label: "High competition", color: "var(--color-danger)" },
};

export default function TrendsPage() {
  const [niche, setNiche] = usePersistedState("trends:niche", "");
  const [loading, setLoading] = useState(false);
  const [signals, setSignals] = usePersistedState<TrendSignal[]>("trends:signals", []);
  const [error, setError] = useState<string | null>(null);

  const charCount = countChars(niche);
  const overLimit = charCount > MAX_INPUT_CHARS;

  async function scan() {
    if (!niche.trim() || loading || overLimit) return;
    setLoading(true);
    setError(null);
    setSignals([]);

    try {
      const res = await fetch("/api/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Trend scan failed");
      }
      const data = await res.json();
      const sigs: TrendSignal[] = data.signals ?? [];
      setSignals(sigs);
      addHistoryEntry({
        module: "trends",
        inputPreview: niche.slice(0, 120),
        summary: `${sigs.length} trend signals found`,
        timestamp: Date.now(),
        input: niche,
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
          Trend Radar
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          Surface emerging discussions, underserved topics, and low-competition opportunities in your niche.
        </p>
      </motion.div>

      {/* Search */}
      <div
        className="rounded-xl p-5 mb-6"
        style={{
          background: "var(--color-bg-surface)",
          border: "1px solid var(--color-border-subtle)",
        }}
      >
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="Enter your niche (e.g. AI engineering, SaaS growth, indie hacking...)"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-text-disabled)]"
              style={{ color: "var(--color-text-primary)" }}
              onKeyDown={(e) => { if (e.key === "Enter") scan(); }}
            />
          </div>
          <button
            onClick={scan}
            disabled={!niche.trim() || loading || overLimit}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-40 flex-shrink-0"
            style={{ background: "var(--color-accent)", color: "#09090b" }}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <TrendingUp size={14} />}
            {loading ? "Scanning..." : "Scan Trends"}
          </button>
        </div>
      </div>

      {error && (
        <div
          className="rounded-xl p-4 text-sm mb-4"
          style={{
            background: "var(--color-danger-muted)",
            color: "var(--color-danger)",
            border: "1px solid var(--color-danger)",
          }}
        >
          {error}
        </div>
      )}

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl p-6"
            style={{
              background: "var(--color-bg-surface)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <AIThinkingState label="Scanning for trend signals..." />
          </motion.div>
        )}

        {!loading && signals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-4"
          >
            {signals.map((signal, i) => {
              const momentum = MOMENTUM_CONFIG[signal.momentum];
              const competition = COMPETITION_CONFIG[signal.competitionLevel];
              const MomentumIcon = momentum.Icon;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl p-5"
                  style={{
                    background: "var(--color-bg-surface)",
                    border: "1px solid var(--color-border-subtle)",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MomentumIcon size={14} style={{ color: momentum.color }} />
                      <span
                        className="text-[10px] font-medium"
                        style={{ color: momentum.color }}
                      >
                        {momentum.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px]"
                        style={{ color: competition.color }}
                      >
                        {competition.label}
                      </span>
                      <span
                        className="text-xs font-bold tabular-nums"
                        style={{ color: "var(--color-accent)" }}
                      >
                        {signal.relevanceScore}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm font-medium mb-2" style={{ color: "var(--color-text-primary)" }}>
                    {signal.topic}
                  </p>
                  <p className="text-xs mb-4" style={{ color: "var(--color-text-secondary)" }}>
                    {signal.opportunity}
                  </p>

                  <div>
                    <p className="text-[10px] mb-2" style={{ color: "var(--color-text-tertiary)" }}>
                      ANGLES
                    </p>
                    <div className="space-y-1">
                      {signal.suggestedAngles.map((angle, j) => (
                        <div key={j} className="flex items-start gap-1.5">
                          <span style={{ color: "var(--color-accent)", fontSize: 10 }}>→</span>
                          <p className="text-[11px]" style={{ color: "var(--color-text-tertiary)" }}>
                            {angle}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
