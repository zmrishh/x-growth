"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ExpandableReasoningProps {
  title?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function ExpandableReasoning({
  title = "AI Reasoning",
  children,
  defaultOpen = false,
}: ExpandableReasoningProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border-subtle)",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-[var(--color-bg-hover)]"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--color-signal)" }}
          />
          <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
            {title}
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={12} style={{ color: "var(--color-text-tertiary)" }} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-4 pt-1 prose-intelligence"
              style={{ borderTop: "1px solid var(--color-border-subtle)" }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
