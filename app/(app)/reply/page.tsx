"use client";

import { useState } from "react";
import { usePersistedState } from "@/lib/hooks/usePersistedState";
import { addHistoryEntry } from "@/lib/hooks/useHistory";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, MessageSquareText, ArrowRight, ChevronDown, Star } from "lucide-react";
import { ReplyIntelligenceResult, ReplyTone, UploadedImage } from "@/types/reply";
import { UploadZone } from "@/components/reply/UploadZone";
import { SocialContextPanel } from "@/components/reply/SocialContextPanel";
import { ReplyVariantCard } from "@/components/reply/ReplyVariantCard";
import { MemeRecommendations } from "@/components/reply/MemeRecommendations";
import { ReplyFeedPreview } from "@/components/reply/ReplyFeedPreview";
import { ImageAnalysisPanel } from "@/components/reply/ImageAnalysisPanel";

type Tab = "replies" | "context" | "images" | "feed" | "memes";

const TABS: { id: Tab; label: string }[] = [
  { id: "replies", label: "Replies" },
  { id: "context", label: "Context Read" },
  { id: "images", label: "Image Analysis" },
  { id: "feed", label: "Feed Preview" },
  { id: "memes", label: "Visuals" },
];

const TONE_SORT_OPTIONS = [
  { value: "default", label: "Default order" },
  { value: "originality", label: "By originality" },
  { value: "standout", label: "By standout prob." },
  { value: "resonance", label: "By audience fit" },
  { value: "cringe", label: "Least cringe" },
] as const;

type SortOption = (typeof TONE_SORT_OPTIONS)[number]["value"];

function sortReplies(
  variants: ReplyIntelligenceResult["replies"],
  sort: SortOption
) {
  if (sort === "default") return variants;
  return [...variants].sort((a, b) => {
    if (sort === "originality") return b.score.originalityScore - a.score.originalityScore;
    if (sort === "standout") return b.score.standoutProbability - a.score.standoutProbability;
    if (sort === "resonance") return b.score.audienceResonance - a.score.audienceResonance;
    if (sort === "cringe") return a.score.cringeRisk - b.score.cringeRisk;
    return 0;
  });
}

export default function ReplyIntelligencePage() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [textContext, setTextContext] = usePersistedState("reply:textContext", "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = usePersistedState<ReplyIntelligenceResult | null>("reply:result", null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("replies");
  const [sort, setSort] = useState<SortOption>("default");
  const [selectedTone, setSelectedTone] = useState<ReplyTone | null>(null);

  const canAnalyze = (images.length > 0 || textContext.trim().length > 0) && !loading;

  async function analyze() {
    if (!canAnalyze) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setActiveTab("replies");

    try {
      const res = await fetch("/api/reply-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          textContext: textContext.trim(),
          images: images.map((img) => ({
            name: img.name,
            type: img.type,
            base64: img.base64,
            sizeBytes: img.sizeBytes,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Analysis failed");
      }

      const data: ReplyIntelligenceResult = await res.json();
      setResult(data);
      addHistoryEntry({
        module: "reply",
        inputPreview: textContext.slice(0, 120) || "(image context)",
        summary: `${data.replies.length} replies · best: ${data.bestReplyTone}`,
        timestamp: Date.now(),
        input: textContext,
        result: data,
      });
      setSelectedTone(data.bestReplyTone as ReplyTone);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const sortedReplies = result ? sortReplies(result.replies, sort) : [];

  return (
    <div
      className="flex flex-col"
      style={{ height: "calc(100vh - 56px)", overflow: "hidden" }}
    >
      {/* Page header */}
      <div
        className="px-6 py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
      >
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <div>
            <h1
              className="font-display text-[20px] leading-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Reply Intelligence
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
              Drop screenshots, memes, or paste context. Get replies that feel written by a smart person.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-lg"
              style={{
                background: "var(--color-bg-elevated)",
                color: "var(--color-text-tertiary)",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-signal)" }} />
              claude-sonnet-4-5
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden max-w-[1400px] mx-auto w-full">
        {/* Left panel: input */}
        <div
          className="w-[360px] flex-shrink-0 flex flex-col overflow-y-auto p-5 gap-4"
          style={{ borderRight: "1px solid var(--color-border-subtle)" }}
        >
          {/* Upload zone */}
          <div>
            <p
              className="text-[10px] font-medium uppercase tracking-wider mb-2"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Screenshots / Memes / Images
            </p>
            <UploadZone images={images} onChange={setImages} />
          </div>

          {/* Text context */}
          <div>
            <p
              className="text-[10px] font-medium uppercase tracking-wider mb-2"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Text Context
            </p>
            <div
              className="rounded-xl"
              style={{
                background: "var(--color-bg-elevated)",
                border: "1px solid var(--color-border-default)",
              }}
            >
              <textarea
                value={textContext}
                onChange={(e) => setTextContext(e.target.value)}
                placeholder={
                  images.length > 0
                    ? "Add context about the person, thread, or your relationship with them..."
                    : "Paste tweet text, conversation, or describe the situation..."
                }
                rows={5}
                className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-text-disabled)] leading-relaxed p-3"
                style={{ color: "var(--color-text-primary)" }}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") analyze();
                }}
              />
              <div
                className="px-3 py-2 flex items-center justify-between"
                style={{ borderTop: "1px solid var(--color-border-subtle)" }}
              >
                <span className="text-[9px]" style={{ color: "var(--color-text-disabled)" }}>
                  ⌘↵ to analyze
                </span>
                <span
                  className="text-[10px]"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {textContext.length} chars
                </span>
              </div>
            </div>
          </div>

          {/* Analyze button */}
          <button
            onClick={analyze}
            disabled={!canAnalyze}
            className="w-full flex items-center justify-center gap-2 text-sm px-4 py-3 rounded-xl font-semibold transition-all disabled:opacity-40"
            style={{
              background: canAnalyze ? "var(--color-accent)" : "var(--color-bg-elevated)",
              color: canAnalyze ? "#09090b" : "var(--color-text-tertiary)",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Analyzing context...
              </>
            ) : (
              <>
                <MessageSquareText size={15} />
                Generate Replies
              </>
            )}
          </button>

          {/* Quick context presets */}
          {!result && !loading && (
            <div>
              <p
                className="text-[10px] font-medium uppercase tracking-wider mb-2"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Quick Context
              </p>
              <div className="space-y-1.5">
                {[
                  {
                    label: "Hot take tweet",
                    text: "Someone just posted a hot take about AI replacing all software engineers within 2 years. It has 500 likes and is getting debated in the replies.",
                  },
                  {
                    label: "Humble brag founder post",
                    text: "A founder posted: 'Just turned down a $2M acquisition offer. We're just getting started.' Has 1200 likes.",
                  },
                  {
                    label: "Meme-heavy thread",
                    text: "Someone from AI Twitter is being ironic and self-aware about startup culture. Very online audience.",
                  },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setTextContext(preset.text)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs transition-colors hover:bg-[var(--color-bg-hover)]"
                    style={{
                      background: "var(--color-bg-elevated)",
                      color: "var(--color-text-secondary)",
                      border: "1px solid var(--color-border-subtle)",
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Best reply callout */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-4"
              style={{
                background: "var(--color-accent-muted)",
                border: "1px solid var(--color-accent)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Star size={12} style={{ color: "var(--color-accent)" }} />
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-accent)" }}>
                  Best Reply
                </p>
              </div>
              <p className="text-xs font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>
                {result.bestReplyTone.replace(/-/g, " ")} tone recommended
              </p>
              <p className="text-[11px]" style={{ color: "var(--color-text-secondary)" }}>
                {result.bestReplyRationale}
              </p>
            </motion.div>
          )}

          {error && (
            <div
              className="rounded-xl p-4 text-xs"
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

        {/* Right panel: results */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
              <div className="space-y-3 w-full max-w-[480px]">
                {[
                  "Reading social context...",
                  "Inferring tone and audience...",
                  "Analyzing power dynamics...",
                  "Generating 12 reply variants...",
                  "Running slop detection...",
                  "Scoring each reply...",
                ].map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        background: "var(--color-accent)",
                        animation: `pulse 1.4s ease-in-out ${i * 0.4}s infinite`,
                      }}
                    />
                    <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
                      {step}
                    </p>
                  </motion.div>
                ))}
              </div>
              <style>{`
                @keyframes pulse {
                  0%, 100% { opacity: 0.3; }
                  50% { opacity: 1; }
                }
              `}</style>
            </div>
          ) : result ? (
            <>
              {/* Tabs */}
              <div
                className="flex items-center gap-1 px-5 py-3 flex-shrink-0"
                style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
              >
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const showCount =
                    tab.id === "replies"
                      ? result.replies.length
                      : tab.id === "images"
                      ? result.imageAnalyses.length
                      : tab.id === "memes"
                      ? result.memeRecommendations.filter((r) => r.style !== "nothing-meme-needed").length
                      : null;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
                      style={{
                        background: isActive ? "var(--color-bg-elevated)" : "transparent",
                        color: isActive ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
                        border: `1px solid ${isActive ? "var(--color-border-strong)" : "transparent"}`,
                      }}
                    >
                      {tab.label}
                      {showCount !== null && (
                        <span
                          className="text-[9px] px-1 py-0.5 rounded"
                          style={{
                            background: isActive ? "var(--color-bg-overlay)" : "transparent",
                            color: "var(--color-text-tertiary)",
                          }}
                        >
                          {showCount}
                        </span>
                      )}
                    </button>
                  );
                })}

                {activeTab === "replies" && (
                  <div className="ml-auto flex items-center gap-1">
                    <span className="text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>
                      Sort:
                    </span>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as SortOption)}
                      className="text-[10px] px-2 py-1 rounded bg-transparent outline-none cursor-pointer"
                      style={{
                        color: "var(--color-text-secondary)",
                        border: "1px solid var(--color-border-default)",
                        background: "var(--color-bg-elevated)",
                      }}
                    >
                      {TONE_SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}
                          style={{ background: "#161616" }}
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {activeTab === "feed" && result && (
                  <div className="ml-auto flex items-center gap-1">
                    <span className="text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>
                      Tone:
                    </span>
                    <select
                      value={selectedTone ?? ""}
                      onChange={(e) => setSelectedTone(e.target.value as ReplyTone)}
                      className="text-[10px] px-2 py-1 rounded outline-none cursor-pointer"
                      style={{
                        color: "var(--color-text-secondary)",
                        border: "1px solid var(--color-border-default)",
                        background: "var(--color-bg-elevated)",
                      }}
                    >
                      {Object.keys(result.feedPredictions).map((tone) => (
                        <option key={tone} value={tone}
                          style={{ background: "#161616" }}
                        >
                          {tone}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto p-5">
                <AnimatePresence mode="wait">
                  {activeTab === "replies" && (
                    <motion.div
                      key="replies"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {sortedReplies.map((variant, i) => (
                        <ReplyVariantCard
                          key={variant.tone}
                          variant={variant}
                          index={i}
                          isBest={variant.tone === result.bestReplyTone}
                        />
                      ))}
                    </motion.div>
                  )}

                  {activeTab === "context" && (
                    <motion.div
                      key="context"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <SocialContextPanel context={result.socialContext} />
                    </motion.div>
                  )}

                  {activeTab === "images" && (
                    <motion.div
                      key="images"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {result.imageAnalyses.length > 0 ? (
                        <ImageAnalysisPanel analyses={result.imageAnalyses} />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-48 gap-3">
                          <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
                            No images were uploaded for this analysis.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "feed" && (
                    <motion.div
                      key="feed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="max-w-[480px]">
                        <p className="text-xs mb-4" style={{ color: "var(--color-text-tertiary)" }}>
                          Distribution prediction for the selected reply tone.
                        </p>
                        <ReplyFeedPreview
                          predictions={result.feedPredictions}
                          selectedTone={selectedTone}
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "memes" && (
                    <motion.div
                      key="memes"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <MemeRecommendations recommendations={result.memeRecommendations} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
              <div className="text-center max-w-[380px]">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-default)" }}
                >
                  <MessageSquareText size={24} style={{ color: "var(--color-text-tertiary)" }} />
                </div>
                <h2
                  className="font-display text-[18px] mb-2"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Social Response Engine
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-tertiary)" }}>
                  Drop a tweet screenshot, paste a conversation, upload a meme. Get 12 replies that feel written by someone who actually knows how the internet works.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full max-w-[460px]">
                {[
                  ["Tweet screenshot", "Drop a screenshot of any tweet"],
                  ["Meme context", "Upload the meme you want to reply to"],
                  ["Conversation", "Screenshot a thread or DM exchange"],
                  ["Text only", "Describe the situation in words"],
                ].map(([title, desc]) => (
                  <div
                    key={title}
                    className="rounded-xl p-4"
                    style={{
                      background: "var(--color-bg-surface)",
                      border: "1px solid var(--color-border-subtle)",
                    }}
                  >
                    <p className="text-xs font-medium mb-1" style={{ color: "var(--color-text-primary)" }}>
                      {title}
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--color-text-tertiary)" }}>
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
