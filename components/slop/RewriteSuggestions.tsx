"use client";

import { CopyButton } from "@/components/shared/CopyButton";
import { ArrowRight } from "lucide-react";

interface RewriteSuggestionsProps {
  suggestions: string[];
}

export function RewriteSuggestions({ suggestions }: RewriteSuggestionsProps) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-border-subtle)",
      }}
    >
      <p className="text-xs font-medium mb-4" style={{ color: "var(--color-text-primary)" }}>
        Rewrite Suggestions
      </p>
      <div className="space-y-3">
        {suggestions.map((suggestion, i) => (
          <div
            key={i}
            className="rounded-lg p-4 flex items-start gap-3"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <div
              className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: "var(--color-accent-muted)" }}
            >
              <span className="text-[10px] font-bold" style={{ color: "var(--color-accent)" }}>
                {i + 1}
              </span>
            </div>
            <p
              className="text-sm flex-1 leading-relaxed"
              style={{ color: "var(--color-text-primary)" }}
            >
              {suggestion}
            </p>
            <CopyButton text={suggestion} />
          </div>
        ))}
      </div>
    </div>
  );
}
