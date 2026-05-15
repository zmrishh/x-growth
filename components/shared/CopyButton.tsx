"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md transition-all ${className}`}
      style={{
        background: copied ? "var(--color-accent-muted)" : "var(--color-bg-overlay)",
        color: copied ? "var(--color-accent)" : "var(--color-text-tertiary)",
        border: `1px solid ${copied ? "var(--color-accent)" : "var(--color-border-default)"}`,
      }}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
