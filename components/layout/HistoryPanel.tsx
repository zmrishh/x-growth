"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { History, X, Trash2, ExternalLink } from "lucide-react";
import {
  useHistory,
  clearHistory,
  primeRestoreForModule,
  HistoryEntry,
  ModuleKey,
} from "@/lib/hooks/useHistory";

const MODULE_LABELS: Record<ModuleKey, { label: string; href: string; color: string }> = {
  virality:   { label: "Virality",   href: "/virality",  color: "#a78bfa" },
  composer:   { label: "Composer",   href: "/composer",  color: "var(--color-accent)" },
  slop:       { label: "Slop",       href: "/slop",      color: "var(--color-danger)" },
  "hooks-lab":{ label: "Hooks",      href: "/hooks-lab", color: "#38bdf8" },
  feed:       { label: "Feed",       href: "/feed",      color: "#34d399" },
  dna:        { label: "DNA",        href: "/dna",       color: "#fb923c" },
  strategy:   { label: "Strategy",   href: "/strategy",  color: "#f472b6" },
  trends:     { label: "Trends",     href: "/trends",    color: "#facc15" },
  reply:      { label: "Reply",      href: "/reply",     color: "#60a5fa" },
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

export function HistoryPanel() {
  const [open, setOpen] = useState(false);
  const { entries, refresh } = useHistory();
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);

  // Refresh list whenever panel opens
  useEffect(() => {
    if (open) refresh();
  }, [open, refresh]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function restore(entry: HistoryEntry) {
    primeRestoreForModule(entry);
    const meta = MODULE_LABELS[entry.module];
    setOpen(false);
    router.push(meta.href);
  }

  function handleClear() {
    clearHistory();
    refresh();
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left"
        style={{
          background: open ? "var(--color-bg-elevated)" : "transparent",
          color: open ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
        }}
      >
        <History size={14} />
        <span className="text-xs">History</span>
        {entries.length > 0 && (
          <span
            className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full"
            style={{
              background: "var(--color-bg-overlay)",
              color: "var(--color-text-disabled)",
            }}
          >
            {entries.length}
          </span>
        )}
      </button>

      {/* Slide-out panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 flex flex-col"
            style={{
              left: 220,
              top: 56,
              bottom: 0,
              width: 300,
              background: "var(--color-bg-surface)",
              borderRight: "1px solid var(--color-border-subtle)",
              borderTop: "1px solid var(--color-border-subtle)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
            >
              <div className="flex items-center gap-2">
                <History size={13} style={{ color: "var(--color-text-tertiary)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  Analysis History
                </span>
              </div>
              <div className="flex items-center gap-1">
                {entries.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="p-1.5 rounded-lg transition-colors hover:bg-[var(--color-bg-elevated)]"
                    title="Clear all history"
                  >
                    <Trash2 size={12} style={{ color: "var(--color-text-tertiary)" }} />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg transition-colors hover:bg-[var(--color-bg-elevated)]"
                >
                  <X size={12} style={{ color: "var(--color-text-tertiary)" }} />
                </button>
              </div>
            </div>

            {/* Entry list */}
            <div className="flex-1 overflow-y-auto py-2">
              {entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
                  <History size={24} style={{ color: "var(--color-text-disabled)" }} />
                  <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                    No history yet. Run an analysis on any module and it will appear here.
                  </p>
                </div>
              ) : (
                entries.map((entry) => {
                  const meta = MODULE_LABELS[entry.module];
                  return (
                    <button
                      key={entry.id}
                      onClick={() => restore(entry)}
                      className="w-full text-left px-4 py-3 transition-colors hover:bg-[var(--color-bg-elevated)] group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span
                            className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                            style={{ background: `${meta.color}18`, color: meta.color }}
                          >
                            {meta.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink size={10} style={{ color: "var(--color-text-tertiary)" }} />
                        </div>
                      </div>
                      <p
                        className="text-[11px] mt-1.5 leading-relaxed line-clamp-2"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {entry.inputPreview}
                      </p>
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>
                          {entry.summary}
                        </p>
                        <p className="text-[9px]" style={{ color: "var(--color-text-disabled)" }}>
                          {timeAgo(entry.timestamp)}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
