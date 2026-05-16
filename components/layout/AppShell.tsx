"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { TopBar } from "@/components/layout/TopBar";
import { HistoryDrawer } from "@/components/shared/HistoryDrawer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <Sidebar
        onCommandPalette={() => setCmdOpen(true)}
        onHistory={() => setHistoryOpen(true)}
      />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
      <HistoryDrawer open={historyOpen} onClose={() => setHistoryOpen(false)} />
      <div
        className="flex flex-col"
        style={{ marginLeft: "220px", height: "100vh", overflow: "hidden" }}
      >
        <TopBar />
        <main
          className="flex-1 overflow-y-auto"
          style={{ background: "var(--color-bg-base)", minHeight: 0 }}
        >
          {children}
        </main>
      </div>
    </>
  );
}
