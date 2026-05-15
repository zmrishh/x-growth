"use client";

export function AIThinkingState({ label = "Analyzing..." }: { label?: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full"
              style={{
                background: "var(--color-accent)",
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
        <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
          {label}
        </span>
      </div>
      {[80, 60, 90, 50, 70].map((w, i) => (
        <div
          key={i}
          className="shimmer h-3 rounded"
          style={{ width: `${w}%` }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
