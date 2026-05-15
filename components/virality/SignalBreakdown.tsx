"use client";

import { ViralitySignals } from "@/types/analysis";
import { ScoreBar } from "@/components/shared/ScoreBar";
import { SIGNAL_META, SIGNAL_ORDER } from "@/constants/signals";

interface SignalBreakdownProps {
  signals: ViralitySignals;
}

export function SignalBreakdown({ signals }: SignalBreakdownProps) {
  const positives = SIGNAL_ORDER.filter((key) => !SIGNAL_META[key]?.invert);
  const risks = SIGNAL_ORDER.filter((key) => SIGNAL_META[key]?.invert);

  return (
    <div className="space-y-6">
      <div>
        <p
          className="text-[10px] font-medium tracking-wider mb-3"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          POSITIVE SIGNALS
        </p>
        <div className="space-y-4">
          {positives.map((key, i) => {
            const meta = SIGNAL_META[key];
            const value = signals[key as keyof ViralitySignals];
            return (
              <ScoreBar
                key={key}
                label={meta.label}
                value={value}
                description={meta.description}
                delay={i * 0.05}
              />
            );
          })}
        </div>
      </div>

      <div
        className="pt-6"
        style={{ borderTop: "1px solid var(--color-border-subtle)" }}
      >
        <p
          className="text-[10px] font-medium tracking-wider mb-3"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          RISK SIGNALS — lower is better
        </p>
        <div className="space-y-4">
          {risks.map((key, i) => {
            const meta = SIGNAL_META[key];
            const value = signals[key as keyof ViralitySignals];
            return (
              <ScoreBar
                key={key}
                label={meta.label}
                value={value}
                invert
                description={meta.description}
                delay={positives.length * 0.05 + i * 0.05}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
