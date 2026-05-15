"use client";

import { motion } from "framer-motion";
import { SocialContext } from "@/types/reply";
import { Eye, Users, Zap, AlertTriangle } from "lucide-react";

interface SocialContextPanelProps {
  context: SocialContext;
}

const TONE_COLORS: Record<string, string> = {
  serious: "var(--color-text-secondary)",
  joking: "var(--color-warning)",
  ironic: "var(--color-signal)",
  sarcastic: "var(--color-signal)",
  intellectual: "#38bdf8",
  emotional: "#fb923c",
  ragebaiting: "var(--color-danger)",
  informational: "var(--color-text-secondary)",
  "humble-brag": "var(--color-warning)",
  "genuinely-curious": "var(--color-success)",
  "hot-take": "var(--color-accent)",
  neutral: "var(--color-text-tertiary)",
};

export function SocialContextPanel({ context }: SocialContextPanelProps) {
  const toneColor = TONE_COLORS[context.contentTone] ?? "var(--color-text-secondary)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        <div
          className="rounded-lg p-3"
          style={{
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <Eye size={11} style={{ color: "var(--color-text-tertiary)" }} />
            <span className="text-[9px] font-medium uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
              Account Type
            </span>
          </div>
          <p className="text-xs font-medium" style={{ color: "var(--color-accent)" }}>
            {context.inferredAccountType.replace(/-/g, " ")}
          </p>
        </div>

        <div
          className="rounded-lg p-3"
          style={{
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <Zap size={11} style={{ color: "var(--color-text-tertiary)" }} />
            <span className="text-[9px] font-medium uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
              Tone
            </span>
          </div>
          <p className="text-xs font-medium" style={{ color: toneColor }}>
            {context.contentTone}
            {context.isItIronic && (
              <span className="ml-1 text-[9px]" style={{ color: "var(--color-signal)" }}>
                (ironic)
              </span>
            )}
          </p>
        </div>

        <div
          className="rounded-lg p-3"
          style={{
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <Users size={11} style={{ color: "var(--color-text-tertiary)" }} />
            <span className="text-[9px] font-medium uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
              Irony Level
            </span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
              {context.ironyLevel}/100
            </p>
          </div>
        </div>
      </div>

      {/* Content summary */}
      <div
        className="rounded-lg p-4"
        style={{
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border-subtle)",
        }}
      >
        <p className="text-[10px] font-medium mb-2 uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
          Context Read
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          {context.contentSummary}
        </p>
        {context.hiddenContext && (
          <p className="text-xs leading-relaxed mt-2" style={{ color: "var(--color-signal)" }}>
            {context.hiddenContext}
          </p>
        )}
      </div>

      {/* Strategy */}
      <div
        className="rounded-lg p-4"
        style={{
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border-subtle)",
        }}
      >
        <p className="text-[10px] font-medium mb-3 uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
          Reply Intelligence
        </p>
        <div className="space-y-3">
          <div>
            <p className="text-[10px] mb-1" style={{ color: "var(--color-accent)" }}>
              What makes a reply stand out
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              {context.whatMakesAReplyStandOut}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle size={10} style={{ color: "var(--color-danger)" }} />
              <p className="text-[10px]" style={{ color: "var(--color-danger)" }}>
                What to avoid
              </p>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              {context.whatToAvoid}
            </p>
          </div>
        </div>
      </div>

      {/* Power dynamic + status game */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-lg p-3"
          style={{
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <p className="text-[10px] mb-1.5 uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
            Power Dynamic
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
            {context.powerDynamic}
          </p>
        </div>
        <div
          className="rounded-lg p-3"
          style={{
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <p className="text-[10px] mb-1.5 uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
            Status Game
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
            {context.statusGame}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
