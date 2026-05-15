"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "x-growth:drafts";
const MAX_DRAFTS = 50;

export interface LocalDraft {
  id: string;
  content: string;
  label: string;
  savedAt: number;
}

export function useLocalDrafts() {
  const [drafts, setDrafts] = useState<LocalDraft[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDrafts(JSON.parse(raw));
    } catch {
      // corrupt storage — ignore
    }
  }, []);

  function persist(updated: LocalDraft[]) {
    setDrafts(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage quota — ignore
    }
  }

  const save = useCallback(
    (content: string, label?: string) => {
      const draft: LocalDraft = {
        id: crypto.randomUUID(),
        content,
        label: label ?? content.slice(0, 40),
        savedAt: Date.now(),
      };
      const updated = [draft, ...drafts].slice(0, MAX_DRAFTS);
      persist(updated);
      return draft.id;
    },
    [drafts]
  );

  const remove = useCallback(
    (id: string) => {
      persist(drafts.filter((d) => d.id !== id));
    },
    [drafts]
  );

  const clear = useCallback(() => {
    persist([]);
  }, []);

  return { drafts, save, remove, clear };
}
