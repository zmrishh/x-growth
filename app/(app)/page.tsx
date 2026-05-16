"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Flame,
  PenLine,
  ShieldAlert,
  Zap,
  RadioTower,
  TrendingUp,
  Dna,
  BrainCircuit,
  ArrowRight,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SignalRadar } from "@/components/dashboard/SignalRadar";
import { QuickAnalyze } from "@/components/dashboard/QuickAnalyze";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";

const MODULES = [
  {
    id: "virality",
    label: "Virality Analyzer",
    description: "Score any tweet on 12 distribution signals",
    href: "/virality",
    icon: Flame,
    color: "var(--color-accent)",
  },
  {
    id: "composer",
    label: "Tweet Composer",
    description: "Generate 8 high-signal variants from any idea",
    href: "/composer",
    icon: PenLine,
    color: "var(--color-signal)",
  },
  {
    id: "slop",
    label: "Slop Detector",
    description: "Surface generic AI patterns and clichés",
    href: "/slop",
    icon: ShieldAlert,
    color: "var(--color-danger)",
  },
  {
    id: "hooks",
    label: "Hook Lab",
    description: "Rewrite first-line hooks for scroll-stopping power",
    href: "/hooks-lab",
    icon: Zap,
    color: "var(--color-warning)",
  },
  {
    id: "feed",
    label: "Feed Simulator",
    description: "Predict algorithmic treatment and reach",
    href: "/feed",
    icon: RadioTower,
    color: "var(--color-signal)",
  },
  {
    id: "trends",
    label: "Trend Radar",
    description: "Surface emerging topics and low-competition angles",
    href: "/trends",
    icon: TrendingUp,
    color: "var(--color-accent)",
  },
  {
    id: "dna",
    label: "Creator DNA",
    description: "Extract and replicate writing fingerprints",
    href: "/dna",
    icon: Dna,
    color: "var(--color-success)",
  },
  {
    id: "strategy",
    label: "Strategy Brain",
    description: "Build 30-day narrative arc content plans",
    href: "/strategy",
    icon: BrainCircuit,
    color: "var(--color-signal)",
  },
];

export default function HomePage() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1
          className="font-display text-[28px] leading-tight mb-1"
          style={{ color: "var(--color-text-primary)" }}
        >
          Mission Control
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          Distribution intelligence for X/Twitter. Optimize signal, eliminate noise.
        </p>
      </motion.div>

      {/* Metrics row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Analyses Run"
          value="—"
          subtext="session total"
          icon={<Flame size={14} style={{ color: "var(--color-accent)" }} />}
          index={0}
        />
        <MetricCard
          label="Avg Virality Score"
          value="—"
          subtext="last 10 analyses"
          icon={<TrendingUp size={14} style={{ color: "var(--color-signal)" }} />}
          index={1}
        />
        <MetricCard
          label="Slop Rate"
          value="—"
          subtext="content flagged"
          icon={<ShieldAlert size={14} style={{ color: "var(--color-danger)" }} />}
          index={2}
        />
        <MetricCard
          label="Top Verdict"
          value="—"
          subtext="most common outcome"
          icon={<Zap size={14} style={{ color: "var(--color-warning)" }} />}
          index={3}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-[1fr_320px] gap-6 mb-6">
        {/* Left: Module grid */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {MODULES.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link href={mod.href}>
                    <div
                      className="group rounded-xl p-4 transition-all duration-200 hover:border-[var(--color-border-strong)] cursor-pointer"
                      style={{
                        background: "var(--color-bg-surface)",
                        border: "1px solid var(--color-border-subtle)",
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: "var(--color-bg-elevated)" }}
                        >
                          <Icon size={15} style={{ color: mod.color }} />
                        </div>
                        <ArrowRight
                          size={13}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: "var(--color-text-tertiary)" }}
                        />
                      </div>
                      <p
                        className="text-sm font-medium mb-1"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {mod.label}
                      </p>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "var(--color-text-tertiary)" }}
                      >
                        {mod.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <QuickAnalyze />
        </div>

        {/* Right: Radar + Activity */}
        <div className="space-y-4">
          <SignalRadar />
          <ActivityFeed />
        </div>
      </div>

      {/* Signal principles footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl p-5"
        style={{
          background: "var(--color-bg-surface)",
          border: "1px solid var(--color-border-subtle)",
        }}
      >
        <p className="text-[10px] font-medium mb-3" style={{ color: "var(--color-text-tertiary)" }}>
          DISTRIBUTION PRINCIPLES
        </p>
        <div className="grid grid-cols-5 gap-4">
          {[
            ["Psychology > Hacks", "Behavioral mechanics outlast any format trick"],
            ["Signal > Volume", "One high-signal post > ten mediocre ones"],
            ["Dwell > Likes", "Attention quality drives algorithmic amplification"],
            ["Originality > Templates", "Novel framing compounds; copies decay"],
            ["Long-term > Vanity", "Compounding authority beats viral moments"],
          ].map(([title, desc]) => (
            <div key={title}>
              <p className="text-[11px] font-medium mb-1" style={{ color: "var(--color-accent)" }}>
                {title}
              </p>
              <p className="text-[10px] leading-relaxed" style={{ color: "var(--color-text-tertiary)" }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
