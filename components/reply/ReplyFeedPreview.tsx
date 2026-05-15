"use client";

import { motion } from "framer-motion";
import { ReplyFeedPrediction, ReplyTone } from "@/types/reply";
import { ScoreBar } from "@/components/shared/ScoreBar";

interface ReplyFeedPreviewProps {
  predictions: Record<string, ReplyFeedPrediction>;
  selectedTone: ReplyTone | null;
}

export function ReplyFeedPreview({ predictions, selectedTone }: ReplyFeedPreviewProps) {
  const tone = selectedTone ?? (Object.keys(predictions)[0] as ReplyTone);
  const pred = predictions[tone];

  if (!pred) return null;

  return (
    <motion.div
      key={tone}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Status pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: pred.standsOut ? "Stands out" : "Blends in", positive: pred.standsOut },
          { label: pred.soundsManufactured ? "Sounds manufactured" : "Sounds human", positive: !pred.soundsManufactured },
          { label: `~${pred.estimatedLikes} likes`, positive: true },
          { label: `~${pred.estimatedReplies} replies`, positive: true },
        ].map((pill, i) => (
          <span
            key={i}
            className="text-[10px] px-2 py-1 rounded-full"
            style={{
              background: pill.positive
                ? "var(--color-success-muted)"
                : "var(--color-danger-muted)",
              color: pill.positive ? "var(--color-success)" : "var(--color-danger)",
              border: `1px solid ${pill.positive ? "var(--color-success)" : "var(--color-danger)"}`,
            }}
          >
            {pill.label}
          </span>
        ))}
      </div>

      {/* Score bars */}
      <div className="space-y-3">
        <ScoreBar label="Reach / Visibility" value={pred.visibilityScore} delay={0} />
        <ScoreBar label="Repost Probability" value={pred.repostProbability} delay={0.06} />
        <ScoreBar label="Profile Click" value={pred.profileClickProbability} delay={0.12} />
        <ScoreBar label="Follow Conversion" value={pred.followConversionProbability} delay={0.18} />
      </div>
    </motion.div>
  );
}
