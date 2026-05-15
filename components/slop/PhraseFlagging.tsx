"use client";

import { SlopFlaggedPhrase } from "@/types/analysis";

interface PhraseFlaggingProps {
  originalText: string;
  flaggedPhrases: SlopFlaggedPhrase[];
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "generic-ai": { bg: "rgba(139,92,246,0.15)", text: "#a78bfa", border: "rgba(139,92,246,0.4)" },
  "engagement-bait": { bg: "rgba(244,63,94,0.1)", text: "var(--color-danger)", border: "rgba(244,63,94,0.4)" },
  "cliche": { bg: "rgba(245,158,11,0.1)", text: "var(--color-warning)", border: "rgba(245,158,11,0.4)" },
  "low-density": { bg: "rgba(107,114,128,0.15)", text: "#9ca3af", border: "rgba(107,114,128,0.3)" },
  "synthetic-cadence": { bg: "rgba(59,130,246,0.1)", text: "#60a5fa", border: "rgba(59,130,246,0.3)" },
  "startup-speak": { bg: "rgba(16,185,129,0.1)", text: "#34d399", border: "rgba(16,185,129,0.3)" },
};

function highlightText(text: string, phrases: SlopFlaggedPhrase[]) {
  if (phrases.length === 0) return [{ type: "text" as const, content: text }];

  type Segment =
    | { type: "text"; content: string }
    | { type: "flagged"; content: string; phrase: SlopFlaggedPhrase };

  const segments: Segment[] = [];
  let remaining = text;
  let pos = 0;

  const sorted = [...phrases].sort((a, b) => {
    const idxA = text.toLowerCase().indexOf(a.phrase.toLowerCase());
    const idxB = text.toLowerCase().indexOf(b.phrase.toLowerCase());
    return idxA - idxB;
  });

  for (const phrase of sorted) {
    const idx = remaining.toLowerCase().indexOf(phrase.phrase.toLowerCase());
    if (idx === -1) continue;

    if (idx > 0) {
      segments.push({ type: "text", content: remaining.slice(0, idx) });
    }
    segments.push({
      type: "flagged",
      content: remaining.slice(idx, idx + phrase.phrase.length),
      phrase,
    });
    remaining = remaining.slice(idx + phrase.phrase.length);
  }

  if (remaining) {
    segments.push({ type: "text", content: remaining });
  }

  return segments;
}

export function PhraseFlagging({ originalText, flaggedPhrases }: PhraseFlaggingProps) {
  const segments = highlightText(originalText, flaggedPhrases);

  return (
    <div className="space-y-4">
      {/* Annotated text */}
      <div
        className="rounded-lg p-4"
        style={{ background: "var(--color-bg-elevated)" }}
      >
        <p className="text-[10px] font-medium mb-3" style={{ color: "var(--color-text-tertiary)" }}>
          ANNOTATED TEXT
        </p>
        <p className="text-sm leading-loose whitespace-pre-wrap" style={{ color: "var(--color-text-primary)" }}>
          {segments.map((seg, i) => {
            if (seg.type === "text") {
              return <span key={i}>{seg.content}</span>;
            }
            const colors = CATEGORY_COLORS[seg.phrase.category] ?? CATEGORY_COLORS["generic-ai"];
            return (
              <span
                key={i}
                className="relative group cursor-help"
                style={{
                  background: colors.bg,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "3px",
                  padding: "1px 2px",
                }}
                title={`${seg.phrase.category}: ${seg.phrase.reason}`}
              >
                {seg.content}
              </span>
            );
          })}
        </p>
      </div>

      {/* Flagged phrases list */}
      {flaggedPhrases.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-medium" style={{ color: "var(--color-text-tertiary)" }}>
            FLAGGED PHRASES ({flaggedPhrases.length})
          </p>
          {flaggedPhrases.map((phrase, i) => {
            const colors = CATEGORY_COLORS[phrase.category] ?? CATEGORY_COLORS["generic-ai"];
            return (
              <div
                key={i}
                className="rounded-lg p-3 flex items-start gap-3"
                style={{
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                  style={{
                    background: "var(--color-bg-elevated)",
                    color: colors.text,
                  }}
                >
                  {phrase.category.replace(/-/g, " ")}
                </span>
                <div>
                  <p className="text-xs font-medium" style={{ color: colors.text }}>
                    "{phrase.phrase}"
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                    {phrase.reason}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
