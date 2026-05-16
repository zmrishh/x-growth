"use client";

import { useState } from "react";
import { usePersistedState } from "@/lib/hooks/usePersistedState";
import { addHistoryEntry } from "@/lib/hooks/useHistory";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Dna } from "lucide-react";
import { CreatorDNA } from "@/types/analysis";
import { AIThinkingState } from "@/components/shared/AIThinkingState";
import { ScoreBar } from "@/components/shared/ScoreBar";
import { countChars } from "@/lib/utils/format";

const MAX_DNA_CHARS = 8000;

export default function DNAPage() {
  const [input, setInput] = usePersistedState("dna:input", "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = usePersistedState<CreatorDNA | null>("dna:result", null);
  const [error, setError] = useState<string | null>(null);

  const charCount = countChars(input);
  const overLimit = charCount > MAX_DNA_CHARS;

  async function extract() {
    if (!input.trim() || loading || overLimit) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/dna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts: input }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "DNA extraction failed");
      }
      const data: CreatorDNA = await res.json();
      setResult(data);
      addHistoryEntry({
        module: "dna",
        inputPreview: input.slice(0, 120),
        summary: `Authority: ${data.authorityLevel} · ${data.toneSignature.slice(0, 40)}`,
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
          Creator DNA Studio
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          Extract the writing fingerprint from any creator's posts. Replicate style without copying content.
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
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
                  Creator Posts
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                  Paste 5–20 tweets from the same creator, separated by blank lines
                </p>
              </div>
              <span
                className="text-[10px]"
                style={{ color: overLimit ? "var(--color-danger)" : "var(--color-text-tertiary)" }}
              >
                {charCount}/{MAX_DNA_CHARS}
              </span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"Post 1...\n\nPost 2...\n\nPost 3..."}
              rows={10}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-text-disabled)] leading-relaxed font-mono"
              style={{ color: "var(--color-text-primary)" }}
            />
            <div
              className="mt-4 pt-4 flex justify-end"
              style={{ borderTop: "1px solid var(--color-border-subtle)" }}
            >
              <button
                onClick={extract}
                disabled={!input.trim() || loading || overLimit}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-40"
                style={{ background: "var(--color-accent)", color: "#09090b" }}
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Dna size={14} />}
                {loading ? "Extracting DNA..." : "Extract Writing DNA"}
              </button>
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
        </div>

        {/* DNA Result */}
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
                <AIThinkingState label="Sequencing writing DNA..." />
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                {/* Metrics */}
                <div
                  className="rounded-xl p-5 space-y-4"
                  style={{
                    background: "var(--color-bg-surface)",
                    border: "1px solid var(--color-border-subtle)",
                  }}
                >
                  <p className="text-[10px] font-medium" style={{ color: "var(--color-text-tertiary)" }}>
                    DNA METRICS
                  </p>
                  <ScoreBar label="Vocabulary Density" value={result.vocabularyDensity} />
                  <ScoreBar label="Authority Level" value={result.authorityLevel} />
                  <ScoreBar label="Tension" value={result.emotionalProfile.tensionLevel} />
                  <ScoreBar label="Urgency" value={result.emotionalProfile.urgencyLevel} />
                  <ScoreBar label="Intimacy" value={result.emotionalProfile.intimacyLevel} />
                </div>

                {/* Personality */}
                <div
                  className="rounded-xl p-5"
                  style={{
                    background: "var(--color-bg-surface)",
                    border: "1px solid var(--color-border-subtle)",
                  }}
                >
                  <p className="text-[10px] font-medium mb-3" style={{ color: "var(--color-text-tertiary)" }}>
                    WRITING PERSONALITY
                  </p>
                  <p className="text-sm" style={{ color: "var(--color-text-primary)" }}>
                    {result.writingPersonality}
                  </p>
                  <div
                    className="mt-4 pt-4 space-y-2"
                    style={{ borderTop: "1px solid var(--color-border-subtle)" }}
                  >
                    {[
                      ["Tone", result.toneSignature],
                      ["Hook Structure", result.hookStructure],
                      ["Sentence Rhythm", result.sentenceRhythm],
                      ["Dominant Emotion", result.emotionalProfile.dominantEmotion],
                      ["Paragraph Style", result.cadenceProfile.paragraphStyle],
                    ].map(([label, value]) => (
                      <div key={label} className="flex gap-3">
                        <span
                          className="text-[10px] w-28 flex-shrink-0 mt-0.5"
                          style={{ color: "var(--color-text-tertiary)" }}
                        >
                          {label}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unique patterns */}
                {result.uniquePatterns.length > 0 && (
                  <div
                    className="rounded-xl p-5"
                    style={{
                      background: "var(--color-bg-surface)",
                      border: "1px solid var(--color-border-subtle)",
                    }}
                  >
                    <p className="text-[10px] font-medium mb-3" style={{ color: "var(--color-text-tertiary)" }}>
                      UNIQUE PATTERNS
                    </p>
                    <div className="space-y-2">
                      {result.uniquePatterns.map((p, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span style={{ color: "var(--color-accent)", fontSize: 10 }}>→</span>
                          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                            {p}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Top topics */}
                {result.topTopics.length > 0 && (
                  <div
                    className="rounded-xl p-5"
                    style={{
                      background: "var(--color-bg-surface)",
                      border: "1px solid var(--color-border-subtle)",
                    }}
                  >
                    <p className="text-[10px] font-medium mb-3" style={{ color: "var(--color-text-tertiary)" }}>
                      TOP TOPICS
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.topTopics.map((topic) => (
                        <span
                          key={topic}
                          className="text-xs px-2.5 py-1 rounded-full"
                          style={{
                            background: "var(--color-bg-elevated)",
                            color: "var(--color-text-secondary)",
                            border: "1px solid var(--color-border-default)",
                          }}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="rounded-xl p-8 flex flex-col items-center justify-center gap-3 min-h-[300px]"
                style={{
                  background: "var(--color-bg-surface)",
                  border: "1px solid var(--color-border-subtle)",
                }}
              >
                <Dna size={24} style={{ color: "var(--color-text-tertiary)" }} />
                <p className="text-sm text-center" style={{ color: "var(--color-text-tertiary)" }}>
                  Paste posts to extract the writing fingerprint
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
