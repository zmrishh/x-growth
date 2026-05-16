"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ExternalLink, History } from "lucide-react";
import {
  useHistory,
  clearHistory,
  primeRestoreForModule,
  HistoryEntry,
  ModuleKey,
} from "@/lib/hooks/useHistory";

const MODULE_META: Record<ModuleKey, { label: string; href: string; color: string }> = {
  virality:    { label: "Virality",   href: "/virality",  color: "#a78bfa" },
  composer:    { label: "Composer",   href: "/composer",  color: "#a3e635" },
  slop:        { label: "Slop",       href: "/slop",      color: "#f87171" },
  "hooks-lab": { label: "Hooks",      href: "/hooks-lab", color: "#38bdf8" },
  feed:        { label: "Feed",       href: "/feed",      color: "#34d399" },
  dna:         { label: "DNA",        href: "/dna",       color: "#fb923c" },
  strategy:    { label: "Strategy",   href: "/strategy",  color: "#f472b6" },
  trends:      { label: "Trends",     href: "/trends",    color: "#facc15" },
  reply:       { label: "Reply",      href: "/reply",     color: "#60a5fa" },
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

interface HistoryDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function HistoryDrawer({ open, onClose }: HistoryDrawerProps) {
  const { entries, refresh } = useHistory();
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) refresh();
  }, [open, refresh]);

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  function restore(entry: HistoryEntry) {
    primeRestoreForModule(entry);
    onClose();
    router.push(MODULE_META[entry.module].href);
  }

  function handleClear() {
    clearHistory();
    refresh();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.4)" }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 38 }}
            className="fixed right-0 top-0 h-screen z-50 flex flex-col"
            style={{
              width: 360,
              background: "var(--color-bg-surface)",
              borderLeft: "1px solid var(--color-border-subtle)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
            >
              <div className="flex items-center gap-2">
                <History size={14} style={{ color: "var(--color-text-tertiary)" }} />
                <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  Analysis History
                </span>
                {entries.length > 0 && (
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{
                      background: "var(--color-bg-overlay)",
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    {entries.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {entries.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="flex items-center gap-1.5 text-[10px] px-2 py-1.5 rounded-lg transition-colors hover:bg-[var(--color-bg-elevated)]"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    <Trash2 size={11} />
                    Clear all
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg transition-colors hover:bg-[var(--color-bg-elevated)]"
                >
                  <X size={15} style={{ color: "var(--color-text-tertiary)" }} />
                </button>
              </div>
            </div>

            {/* Entry list */}
            <div className="flex-1 overflow-y-auto">
              {entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: "var(--color-bg-elevated)" }}
                  >
                    <History size={20} style={{ color: "var(--color-text-disabled)" }} />
                  </div>
                  <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
                    No history yet. Run any analysis and it will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: "var(--color-border-subtle)" }}>
                  {entries.map((entry) => {
                    const meta = MODULE_META[entry.module];
                    return (
                      <button
                        key={entry.id}
                        onClick={() => restore(entry)}
                        className="w-full text-left px-5 py-4 transition-colors hover:bg-[var(--color-bg-elevated)] group"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              background: `${meta.color}18`,
                              color: meta.color,
                            }}
                          >
                            {meta.label}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: "var(--color-text-disabled)" }}>
                              {timeAgo(entry.timestamp)}
                            </span>
                            <ExternalLink
                              size={10}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ color: "var(--color-text-tertiary)" }}
                            />
                          </div>
                        </div>

                        <p
                          className="text-xs leading-relaxed line-clamp-2 mb-1"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {entry.inputPreview || "(no text context)"}
                        </p>

                        <p className="text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>
                          {entry.summary}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div
              className="px-5 py-3 flex-shrink-0"
              style={{ borderTop: "1px solid var(--color-border-subtle)" }}
            >
              <p className="text-[10px]" style={{ color: "var(--color-text-disabled)" }}>
                Stored in browser localStorage. Click any entry to restore that analysis.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
