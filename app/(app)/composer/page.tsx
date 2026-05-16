"use client";

import { useState } from "react";
import { usePersistedState } from "@/lib/hooks/usePersistedState";
import { addHistoryEntry } from "@/lib/hooks/useHistory";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, Sparkles } from "lucide-react";
import { TweetVariant } from "@/types/analysis";
import { VariantCard } from "@/components/composer/VariantCard";
import { AIThinkingState } from "@/components/shared/AIThinkingState";
import { countChars } from "@/lib/utils/format";
import { MAX_INPUT_CHARS } from "@/constants/models";

const EXAMPLE_IDEAS = [
  "Most productivity advice is backwards — doing less is faster than doing more",
  "The real reason AI won't replace software engineers (yet)",
  "What I learned building and shutting down a startup in 18 months",
];

export default function ComposerPage() {
  const [idea, setIdea] = usePersistedState("composer:idea", "");
  const [context, setContext] = usePersistedState("composer:context", "");
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = usePersistedState<TweetVariant[]>("composer:variants", []);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"default" | "score">("default");
  const [mode, setMode] = usePersistedState<"single" | "thread">("composer:mode", "single");
  const [length, setLength] = usePersistedState<"short" | "medium" | "long">("composer:length", "medium");
  const [threadCount, setThreadCount] = usePersistedState<number>("composer:threadCount", 5);

  const charCount = countChars(idea);
  const overLimit = charCount > MAX_INPUT_CHARS;

  async function generate() {
    if (!idea.trim() || loading || overLimit) return;
    setLoading(true);
    setError(null);
    setVariants([]);

    try {
      const res = await fetch("/api/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, context: context || undefined, mode, length, threadCount }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Generation failed");
      }
      const data = await res.json();
      const v: TweetVariant[] = data.variants ?? [];
      setVariants(v);
      addHistoryEntry({
        module: "composer",
        inputPreview: idea.slice(0, 120),
        summary: `${v.length} variants generated`,
        timestamp: Date.now(),
        input: idea,
        result: data,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const displayVariants =
    sortBy === "score"
      ? [...variants].sort((a, b) => b.estimatedViralityScore - a.estimatedViralityScore)
      : variants;

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
          Tweet Composer
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          Generate 8 high-signal variants from any idea. Authority, founder, technical, contrarian, and more.
        </p>
      </motion.div>

      <div className="grid grid-cols-[380px_1fr] gap-6">
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
                Core Idea
              </p>
              <span
                className="text-[10px]"
                style={{ color: overLimit ? "var(--color-danger)" : "var(--color-text-tertiary)" }}
              >
                {charCount}/{MAX_INPUT_CHARS}
              </span>
            </div>

            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your idea, insight, or topic..."
              rows={4}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-text-disabled)] leading-relaxed"
              style={{ color: "var(--color-text-primary)" }}
            />

            <div
              className="mt-3 pt-3"
              style={{ borderTop: "1px solid var(--color-border-subtle)" }}
            >
              <p className="text-[10px] mb-2" style={{ color: "var(--color-text-tertiary)" }}>
                Additional context (optional)
              </p>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Your niche, audience, tone preference..."
                rows={2}
                className="w-full bg-transparent text-xs outline-none placeholder:text-[var(--color-text-disabled)] leading-relaxed"
                style={{ color: "var(--color-text-primary)" }}
              />
            </div>

            {/* Length + Mode controls */}
            <div
              className="mt-3 pt-3 space-y-3"
              style={{ borderTop: "1px solid var(--color-border-subtle)" }}
            >
              {/* Length */}
              <div>
                <p className="text-[10px] font-medium mb-1.5" style={{ color: "var(--color-text-tertiary)" }}>
                  LENGTH
                </p>
                <div className="flex gap-1.5">
                  {(["short", "medium", "long"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setLength(opt)}
                      className="flex-1 text-[10px] py-1.5 rounded-lg capitalize transition-all"
                      style={{
                        background: length === opt ? "var(--color-accent)" : "var(--color-bg-overlay)",
                        color: length === opt ? "#09090b" : "var(--color-text-tertiary)",
                        border: `1px solid ${length === opt ? "var(--color-accent)" : "var(--color-border-subtle)"}`,
                        fontWeight: length === opt ? 600 : 400,
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode */}
              <div>
                <p className="text-[10px] font-medium mb-1.5" style={{ color: "var(--color-text-tertiary)" }}>
                  FORMAT
                </p>
                <div className="flex gap-1.5">
                  {(["single", "thread"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setMode(opt)}
                      className="flex-1 text-[10px] py-1.5 rounded-lg capitalize transition-all"
                      style={{
                        background: mode === opt ? "var(--color-accent)" : "var(--color-bg-overlay)",
                        color: mode === opt ? "#09090b" : "var(--color-text-tertiary)",
                        border: `1px solid ${mode === opt ? "var(--color-accent)" : "var(--color-border-subtle)"}`,
                        fontWeight: mode === opt ? 600 : 400,
                      }}
                    >
                      {opt === "single" ? "Single Tweet" : "Thread"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thread count */}
              {mode === "thread" && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] font-medium" style={{ color: "var(--color-text-tertiary)" }}>
                      TWEETS PER THREAD
                    </p>
                    <span
                      className="text-[10px] font-bold tabular-nums"
                      style={{ color: "var(--color-accent)" }}
                    >
                      {threadCount}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={10}
                    step={1}
                    value={threadCount}
                    onChange={(e) => setThreadCount(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, var(--color-accent) ${((threadCount - 2) / 8) * 100}%, var(--color-bg-overlay) ${((threadCount - 2) / 8) * 100}%)`,
                      outline: "none",
                    }}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[9px]" style={{ color: "var(--color-text-disabled)" }}>2</span>
                    <span className="text-[9px]" style={{ color: "var(--color-text-disabled)" }}>10</span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={generate}
              disabled={!idea.trim() || loading || overLimit}
              className="mt-4 w-full flex items-center justify-center gap-2 text-sm px-4 py-2.5 rounded-lg font-medium transition-all disabled:opacity-40"
              style={{ background: "var(--color-accent)", color: "#09090b" }}
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              {loading ? "Generating..." : mode === "thread" ? `Generate ${threadCount}-Tweet Threads` : "Generate 8 Variants"}
            </button>
          </div>

          {/* Examples */}
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
              EXAMPLE IDEAS
            </p>
            <div className="space-y-2">
              {EXAMPLE_IDEAS.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setIdea(ex)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs transition-colors hover:bg-[var(--color-bg-hover)]"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  <span
                    className="font-medium mr-2"
                    style={{ color: "var(--color-text-disabled)" }}
                  >
                    {i + 1}.
                  </span>
                  {ex}
                </button>
              ))}
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

        {/* Right: Variants */}
        <div>
          {loading ? (
            <div
              className="rounded-xl p-6"
              style={{
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              <AIThinkingState label="Generating 8 variants..." />
            </div>
          ) : variants.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
                  {variants.length} variants generated
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>
                    Sort:
                  </span>
                  {(["default", "score"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSortBy(opt)}
                      className="text-[10px] px-2 py-1 rounded capitalize"
                      style={{
                        background:
                          sortBy === opt
                            ? "var(--color-bg-elevated)"
                            : "transparent",
                        color:
                          sortBy === opt
                            ? "var(--color-text-primary)"
                            : "var(--color-text-tertiary)",
                        border: "1px solid var(--color-border-subtle)",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {displayVariants.map((v, i) => (
                  <VariantCard key={v.tone} variant={v} index={i} />
                ))}
              </div>
            </div>
          ) : (
            <div
              className="rounded-xl h-full min-h-[300px] flex flex-col items-center justify-center gap-3"
              style={{
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "var(--color-bg-elevated)" }}
              >
                <Sparkles size={20} style={{ color: "var(--color-text-tertiary)" }} />
              </div>
              <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
                Enter an idea to generate variants
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
