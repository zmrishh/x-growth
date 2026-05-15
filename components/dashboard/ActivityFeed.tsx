"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Flame, PenLine, ShieldAlert, Zap } from "lucide-react";

const DEMO_ACTIVITY = [
  {
    id: "1",
    type: "virality" as const,
    label: "Virality Analysis",
    excerpt: "The biggest mistake founders make when launching...",
    score: 78,
    verdict: "distribute",
    time: "2m ago",
  },
  {
    id: "2",
    type: "slop" as const,
    label: "Slop Detection",
    excerpt: "In today's digital landscape, it's important to note that...",
    score: 84,
    verdict: "severe",
    time: "8m ago",
  },
  {
    id: "3",
    type: "compose" as const,
    label: "Tweet Composer",
    excerpt: "8 variants generated for: AI replacing software engineers...",
    score: null,
    verdict: null,
    time: "14m ago",
  },
  {
    id: "4",
    type: "hook" as const,
    label: "Hook Lab",
    excerpt: "Rewrote: 'I learned something important yesterday...'",
    score: 91,
    verdict: null,
    time: "31m ago",
  },
];

const ICONS = {
  virality: Flame,
  slop: ShieldAlert,
  compose: PenLine,
  hook: Zap,
};

const HREF = {
  virality: "/virality",
  slop: "/slop",
  compose: "/composer",
  hook: "/hooks-lab",
};

export function ActivityFeed() {
  return (
    <div
      className="rounded-xl"
      style={{
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-border-subtle)",
      }}
    >
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
      >
        <p className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
          Recent Activity
        </p>
        <span className="text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>
          session
        </span>
      </div>

      <div className="divide-y" style={{ borderColor: "var(--color-border-subtle)" }}>
        {DEMO_ACTIVITY.map((item, i) => {
          const Icon = ICONS[item.type];
          const href = HREF[item.type];

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
            >
              <Link
                href={href}
                className="flex items-start gap-3 px-5 py-3.5 hover:bg-[var(--color-bg-hover)] transition-colors block"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "var(--color-bg-elevated)" }}
                >
                  <Icon size={12} style={{ color: "var(--color-accent)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium" style={{ color: "var(--color-text-secondary)" }}>
                      {item.label}
                    </span>
                    <span className="text-[10px] flex-shrink-0" style={{ color: "var(--color-text-tertiary)" }}>
                      {item.time}
                    </span>
                  </div>
                  <p
                    className="text-xs mt-0.5 truncate"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    {item.excerpt}
                  </p>
                </div>
                {item.score !== null && (
                  <span
                    className="text-xs font-semibold tabular-nums flex-shrink-0"
                    style={{
                      color:
                        item.score >= 70
                          ? "var(--color-score-high)"
                          : item.score >= 40
                          ? "var(--color-score-mid)"
                          : "var(--color-score-low)",
                    }}
                  >
                    {item.score}
                  </span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
