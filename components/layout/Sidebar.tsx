"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { NAV_ITEMS } from "@/constants/nav";
import { cn } from "@/lib/utils/cn";
import { useHistory } from "@/lib/hooks/useHistory";

interface SidebarProps {
  onCommandPalette: () => void;
  onHistory: () => void;
}

export function Sidebar({ onCommandPalette, onHistory }: SidebarProps) {
  const pathname = usePathname();
  const { entries } = useHistory();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[220px] flex flex-col z-40"
      style={{
        background: "var(--color-bg-surface)",
        borderRight: "1px solid var(--color-border-subtle)",
      }}
    >
      {/* Logo */}
      <div
        className="px-5 py-5"
        style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-[5px] flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--color-accent)" }}
          >
            <span
              className="text-[10px] font-bold"
              style={{ color: "#09090b", fontFamily: "var(--font-sans)" }}
            >
              XG
            </span>
          </div>
          <div>
            <p
              className="text-[13px] font-semibold tracking-tight leading-none"
              style={{ color: "var(--color-text-primary)" }}
            >
              x-growth
            </p>
            <p
              className="text-[10px] mt-0.5"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Intelligence Platform
            </p>
          </div>
        </div>
      </div>

      {/* Command palette trigger */}
      <div className="px-3 py-3">
        <button
          onClick={onCommandPalette}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors hover:bg-[var(--color-bg-hover)]"
          style={{
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
          </svg>
          <span className="text-xs flex-1" style={{ color: "var(--color-text-tertiary)" }}>
            Search...
          </span>
          <kbd
            className="text-[10px] px-1 py-0.5 rounded"
            style={{
              background: "var(--color-bg-overlay)",
              color: "var(--color-text-tertiary)",
              border: "1px solid var(--color-border-default)",
            }}
          >
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link key={item.id} href={item.href} className="block">
              <div
                className={cn(
                  "relative flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 group"
                )}
                style={{
                  background: isActive
                    ? "var(--color-bg-hover)"
                    : "transparent",
                  color: isActive
                    ? "var(--color-text-primary)"
                    : "var(--color-text-secondary)",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: "var(--color-bg-hover)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  size={14}
                  className="relative z-10 flex-shrink-0"
                  style={{
                    color: isActive
                      ? "var(--color-accent)"
                      : "var(--color-text-tertiary)",
                  }}
                />
                <span className="relative z-10 text-[13px] font-medium truncate">
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-3 py-3 space-y-1"
        style={{ borderTop: "1px solid var(--color-border-subtle)" }}
      >
        {/* History button */}
        <button
          onClick={onHistory}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all hover:bg-[var(--color-bg-hover)]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <Clock size={14} style={{ color: "var(--color-text-tertiary)" }} />
          <span className="text-[13px] font-medium flex-1">History</span>
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
        </button>

        <div className="px-2 pt-1">
          <p className="text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>
            Distribution Intelligence
          </p>
          <p className="text-[10px]" style={{ color: "var(--color-text-disabled)" }}>
            v0.1.0 — private
          </p>
        </div>
      </div>
    </aside>
  );
}
