"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { NAV_ITEMS } from "@/constants/nav";
import { cn } from "@/lib/utils/cn";
import {
  Command,
  Flame,
  PenLine,
  ShieldAlert,
  Zap,
  RadioTower,
  TrendingUp,
  Dna,
  BrainCircuit,
  Settings,
  LayoutDashboard,
} from "lucide-react";

const ICON_MAP = {
  dashboard: LayoutDashboard,
  virality: Flame,
  composer: PenLine,
  slop: ShieldAlert,
  "hooks-lab": Zap,
  feed: RadioTower,
  trends: TrendingUp,
  dna: Dna,
  strategy: BrainCircuit,
  settings: Settings,
} as const;

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = NAV_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      }
      if (e.key === "Enter") {
        const item = filtered[selected];
        if (item) navigate(item.href);
      }
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, filtered, selected]);

  function navigate(href: string) {
    router.push(href);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 cmd-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-[20%] left-1/2 z-50 w-full max-w-[560px] -translate-x-1/2"
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <div
              className="rounded-xl overflow-hidden shadow-2xl"
              style={{
                background: "var(--color-bg-elevated)",
                border: "1px solid var(--color-border-strong)",
              }}
            >
              {/* Search bar */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
              >
                <Command size={14} style={{ color: "var(--color-text-tertiary)" }} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search modules..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-text-tertiary)]"
                  style={{ color: "var(--color-text-primary)" }}
                />
                <kbd
                  className="text-[10px] px-1.5 py-0.5 rounded"
                  style={{
                    background: "var(--color-bg-overlay)",
                    color: "var(--color-text-tertiary)",
                    border: "1px solid var(--color-border-default)",
                  }}
                >
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="py-1.5 max-h-[320px] overflow-y-auto">
                {filtered.length === 0 ? (
                  <p
                    className="text-sm px-4 py-3"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    No modules found
                  </p>
                ) : (
                  filtered.map((item, i) => {
                    const Icon = ICON_MAP[item.id as keyof typeof ICON_MAP];
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigate(item.href)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                        )}
                        style={{
                          background:
                            i === selected
                              ? "var(--color-bg-hover)"
                              : "transparent",
                        }}
                        onMouseEnter={() => setSelected(i)}
                      >
                        {Icon && (
                          <Icon
                            size={14}
                            style={{
                              color:
                                i === selected
                                  ? "var(--color-accent)"
                                  : "var(--color-text-tertiary)",
                            }}
                          />
                        )}
                        <div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            {item.label}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "var(--color-text-tertiary)" }}
                          >
                            {item.description}
                          </p>
                        </div>
                        {i === selected && (
                          <kbd
                            className="ml-auto text-[10px] px-1.5 py-0.5 rounded"
                            style={{
                              background: "var(--color-bg-overlay)",
                              color: "var(--color-text-tertiary)",
                              border: "1px solid var(--color-border-default)",
                            }}
                          >
                            ↵
                          </kbd>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              <div
                className="flex items-center gap-4 px-4 py-2"
                style={{
                  borderTop: "1px solid var(--color-border-subtle)",
                  color: "var(--color-text-tertiary)",
                }}
              >
                <span className="text-[10px]">↑↓ navigate</span>
                <span className="text-[10px]">↵ open</span>
                <span className="text-[10px]">esc close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
