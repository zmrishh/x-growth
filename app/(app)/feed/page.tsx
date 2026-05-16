"use client";

import { useState } from "react";
import { usePersistedState } from "@/lib/hooks/usePersistedState";
import { addHistoryEntry } from "@/lib/hooks/useHistory";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, RadioTower } from "lucide-react";
import { FeedSimulation } from "@/types/analysis";
import { AIThinkingState } from "@/components/shared/AIThinkingState";
import { ScoreBar } from "@/components/shared/ScoreBar";
import { ExpandableReasoning } from "@/components/shared/ExpandableReasoning";
import { countChars } from "@/lib/utils/format";
import { MAX_INPUT_CHARS } from "@/constants/models";

const ENGAGEMENT_LABELS: Record<string, string> = {
  "passive-like": "Passive Like",
  reply: "Reply",
  repost: "Repost",
  quote: "Quote Tweet",
  "profile-click": "Profile Click",
  follow: "Follow",
  share: "Share",
  bookmark: "Bookmark",
  "not-interested": "Not Interested ⚠",
};

export default function FeedPage() {
  const [input, setInput] = usePersistedState("feed:input", "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = usePersistedState<FeedSimulation | null>("feed:result", null);
  const [error, setError] = useState<string | null>(null);

  const charCount = countChars(input);
  const overLimit = charCount > MAX_INPUT_CHARS;

  async function simulate() {
    if (!input.trim() || loading || overLimit) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Simulation failed");
      }
      const data: FeedSimulation = await res.json();
      setResult(data);
      addHistoryEntry({
        module: "feed",
        inputPreview: input.slice(0, 120),
        summary: `Reach: ${data.reachProbability}% · Algo: ${data.algorithmFriendliness}`,
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
          Feed Simulator
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          Predict how X/Twitter's ranking system will treat your content. Distribution mechanics, engagement type, reach probability.
        </p>
      </motion.div>

      <div className="grid grid-cols-[1fr_380px] gap-6">
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
              placeholder="Paste tweet to simulate in the feed..."
              rows={5}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-text-disabled)] leading-relaxed"
              style={{ color: "var(--color-text-primary)" }}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") simulate();
              }}
            />
            <div
              className="mt-4 pt-4 flex justify-end"
              style={{ borderTop: "1px solid var(--color-border-subtle)" }}
            >
              <button
                onClick={simulate}
                disabled={!input.trim() || loading || overLimit}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-40"
                style={{ background: "var(--color-accent)", color: "#09090b" }}
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <RadioTower size={14} />}
                {loading ? "Simulating..." : "Simulate Feed"}
              </button>
            </div>
          </div>

          {(loading || result) && (
            <div
              className="rounded-xl p-5"
              style={{
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              {loading ? (
                <AIThinkingState label="Simulating feed behavior..." />
              ) : result ? (
                <div className="space-y-5">
                  <p className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
                    Distribution Scores
                  </p>
                  <ScoreBar label="Reach Probability" value={result.reachProbability} delay={0} />
                  <ScoreBar label="Repost Probability" value={result.repostProbability} delay={0.07} />
                  <ScoreBar label="Discussion Probability" value={result.discussionProbability} delay={0.14} />
                  <ScoreBar label="Follower Conversion" value={result.followerConversionProbability} delay={0.21} />
                  <ScoreBar label="Algorithm Friendliness" value={result.algorithmFriendliness} delay={0.28} />
                  <ScoreBar
                    label="Negative Signal Risk"
                    value={result.negativeSignalRisk}
                    invert
                    delay={0.35}
                  />
                </div>
              ) : null}
            </div>
          )}

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

        {/* Right panel */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                {/* Likely engagement types */}
                <div
                  className="rounded-xl p-5"
                  style={{
                    background: "var(--color-bg-surface)",
                    border: "1px solid var(--color-border-subtle)",
                  }}
                >
                  <p className="text-[10px] font-medium mb-3" style={{ color: "var(--color-text-tertiary)" }}>
                    LIKELY ENGAGEMENT
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.likelyEngagementType.map((type) => (
                      <span
                        key={type}
                        className="text-[10px] px-2 py-1 rounded-full"
                        style={{
                          background:
                            type === "not-interested"
                              ? "var(--color-danger-muted)"
                              : "var(--color-bg-elevated)",
                          color:
                            type === "not-interested"
                              ? "var(--color-danger)"
                              : "var(--color-text-secondary)",
                          border: `1px solid ${
                            type === "not-interested"
                              ? "var(--color-danger)"
                              : "var(--color-border-default)"
                          }`,
                        }}
                      >
                        {ENGAGEMENT_LABELS[type] ?? type}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Predicted audience */}
                <div
                  className="rounded-xl p-5"
                  style={{
                    background: "var(--color-bg-surface)",
                    border: "1px solid var(--color-border-subtle)",
                  }}
                >
                  <p className="text-[10px] font-medium mb-2" style={{ color: "var(--color-text-tertiary)" }}>
                    PREDICTED AUDIENCE
                  </p>
                  <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    {result.predictedAudience}
                  </p>
                </div>

                <ExpandableReasoning title="Simulation Reasoning" defaultOpen>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                    {result.reasoning}
                  </p>
                </ExpandableReasoning>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="rounded-xl p-8 flex flex-col items-center justify-center gap-3 min-h-[240px]"
                style={{
                  background: "var(--color-bg-surface)",
                  border: "1px solid var(--color-border-subtle)",
                }}
              >
                <RadioTower size={24} style={{ color: "var(--color-text-tertiary)" }} />
                <p className="text-sm text-center" style={{ color: "var(--color-text-tertiary)" }}>
                  Simulate how this post travels through the feed
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
