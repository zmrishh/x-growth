"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/constants/nav";

export function TopBar() {
  const pathname = usePathname();

  const activeItem =
    NAV_ITEMS.find((item) =>
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
    ) ?? NAV_ITEMS[0];

  return (
    <div
      className="h-14 flex items-center px-6 gap-4 flex-shrink-0"
      style={{
        borderBottom: "1px solid var(--color-border-subtle)",
        background: "var(--color-bg-surface)",
      }}
    >
      <div className="flex items-center gap-2">
        {activeItem.icon && (
          <activeItem.icon
            size={14}
            style={{ color: "var(--color-accent)" }}
          />
        )}
        <h1
          className="font-display text-[15px]"
          style={{ color: "var(--color-text-primary)" }}
        >
          {activeItem.label}
        </h1>
      </div>
      <span
        className="text-[12px]"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        {activeItem.description}
      </span>

      <div className="ml-auto flex items-center gap-2">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "var(--color-success)" }}
        />
        <span className="text-[11px]" style={{ color: "var(--color-text-tertiary)" }}>
          claude-opus-4-5
        </span>
      </div>
    </div>
  );
}
