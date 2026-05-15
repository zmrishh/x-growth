"use client";

import { ExpandableReasoning } from "@/components/shared/ExpandableReasoning";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ReasoningPanelProps {
  reasoning: string;
  improvements: string[];
  estimatedReadTimeSeconds: number;
}

export function ReasoningPanel({
  reasoning,
  improvements,
  estimatedReadTimeSeconds,
}: ReasoningPanelProps) {
  return (
    <div className="space-y-3">
      <ExpandableReasoning title="AI Reasoning" defaultOpen>
        <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          {reasoning}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>
            Est. read time:
          </span>
          <span className="text-[10px] font-medium" style={{ color: "var(--color-text-primary)" }}>
            {estimatedReadTimeSeconds}s
          </span>
        </div>
      </ExpandableReasoning>

      <div
        className="rounded-lg p-4"
        style={{
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border-subtle)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={13} style={{ color: "var(--color-accent)" }} />
          <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
            Improvements
          </span>
        </div>
        <div className="space-y-2">
          {improvements.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span
                className="text-[10px] tabular-nums mt-0.5 flex-shrink-0"
                style={{ color: "var(--color-accent)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
