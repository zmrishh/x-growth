"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const FIELD_STYLE = {
    background: "var(--color-bg-elevated)",
    border: "1px solid var(--color-border-default)",
    color: "var(--color-text-primary)",
    borderRadius: "8px",
    padding: "10px 12px",
    fontSize: "13px",
    width: "100%",
    outline: "none",
  };

  return (
    <div className="p-6 max-w-[720px]">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1
          className="font-display text-[24px] leading-tight mb-1"
          style={{ color: "var(--color-text-primary)" }}
        >
          Settings
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          Model and API configuration for the Intelligence Platform.
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* AI Model */}
        <section
          className="rounded-xl p-5"
          style={{
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <p className="text-xs font-medium mb-4" style={{ color: "var(--color-text-primary)" }}>
            AI Model
          </p>
          <div className="space-y-3">
            {[
              {
                id: "claude-opus-4-5",
                label: "claude-opus-4-5",
                desc: "Primary — used for all analysis modules",
                active: true,
              },
              {
                id: "claude-haiku-4-5",
                label: "claude-haiku-4-5",
                desc: "Fast fallback — available for quick operations",
                active: false,
              },
            ].map((model) => (
              <div
                key={model.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{
                  background: model.active
                    ? "var(--color-accent-muted)"
                    : "var(--color-bg-elevated)",
                  border: `1px solid ${model.active ? "var(--color-accent)" : "var(--color-border-subtle)"}`,
                }}
              >
                <div>
                  <p
                    className="text-xs font-mono font-medium"
                    style={{ color: model.active ? "var(--color-accent)" : "var(--color-text-secondary)" }}
                  >
                    {model.label}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                    {model.desc}
                  </p>
                </div>
                {model.active && (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      background: "var(--color-success-muted)",
                      color: "var(--color-success)",
                      border: "1px solid var(--color-success)",
                    }}
                  >
                    active
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* API Configuration */}
        <section
          className="rounded-xl p-5"
          style={{
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <p className="text-xs font-medium mb-4" style={{ color: "var(--color-text-primary)" }}>
            API Configuration
          </p>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-medium mb-1.5 block" style={{ color: "var(--color-text-tertiary)" }}>
                ANTHROPIC API KEY
              </label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-..."
                  style={{ ...FIELD_STYLE, paddingRight: "36px" }}
                />
                <button
                  onClick={() => setShowKey((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
              <p className="text-[10px] mt-1" style={{ color: "var(--color-text-tertiary)" }}>
                Set via ANTHROPIC_API_KEY in .env.local for server-side usage
              </p>
            </div>
          </div>
        </section>

        {/* Environment */}
        <section
          className="rounded-xl p-5"
          style={{
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <p className="text-xs font-medium mb-4" style={{ color: "var(--color-text-primary)" }}>
            Environment Variables
          </p>
          <div
            className="rounded-lg p-4 font-mono text-xs leading-loose"
            style={{
              background: "var(--color-bg-elevated)",
              color: "var(--color-text-secondary)",
            }}
          >
            <p>
              <span style={{ color: "var(--color-text-tertiary)" }}># Required</span>
            </p>
            <p>
              <span style={{ color: "var(--color-accent)" }}>ANTHROPIC_API_KEY</span>
              <span style={{ color: "var(--color-text-tertiary)" }}>=sk-ant-...</span>
            </p>
            <p className="mt-2">
              <span style={{ color: "var(--color-text-tertiary)" }}># Optional — for persistence</span>
            </p>
            <p>
              <span style={{ color: "var(--color-signal)" }}>NEXT_PUBLIC_SUPABASE_URL</span>
              <span style={{ color: "var(--color-text-tertiary)" }}>=https://...</span>
            </p>
            <p>
              <span style={{ color: "var(--color-signal)" }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              <span style={{ color: "var(--color-text-tertiary)" }}>=eyJ...</span>
            </p>
            <p>
              <span style={{ color: "var(--color-signal)" }}>SUPABASE_SERVICE_ROLE_KEY</span>
              <span style={{ color: "var(--color-text-tertiary)" }}>=eyJ...</span>
            </p>
          </div>
        </section>

        {/* Platform info */}
        <section
          className="rounded-xl p-5"
          style={{
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <p className="text-xs font-medium mb-3" style={{ color: "var(--color-text-primary)" }}>
            Platform
          </p>
          <div className="space-y-2">
            {[
              ["Version", "0.1.0"],
              ["Environment", "Development"],
              ["Framework", "Next.js 16 (App Router)"],
              ["AI Provider", "Anthropic"],
              ["Font", "Geist + Instrument Serif"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center gap-4">
                <span className="text-[10px] w-28" style={{ color: "var(--color-text-tertiary)" }}>
                  {label}
                </span>
                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
