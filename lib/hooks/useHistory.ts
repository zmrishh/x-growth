import { useCallback, useEffect, useState } from "react";

export type ModuleKey =
  | "virality"
  | "composer"
  | "slop"
  | "hooks-lab"
  | "feed"
  | "dna"
  | "strategy"
  | "trends"
  | "reply";

export interface HistoryEntry {
  id: string;
  module: ModuleKey;
  inputPreview: string; // first 120 chars of input
  summary: string;      // human-readable one-liner: "Score: 72 · distribute"
  timestamp: number;
  input: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any;
}

const STORAGE_KEY = "x-growth:history";
const MAX_ENTRIES = 60;

function load(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function save(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage full — drop oldest half and retry
    try {
      const trimmed = entries.slice(0, Math.floor(entries.length / 2));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {}
  }
}

// Called by pages to add an entry. Deduplicates by exact input+module within
// the same minute so rapid re-runs don't flood the list.
export function addHistoryEntry(entry: Omit<HistoryEntry, "id">): void {
  const entries = load();
  const minute = Math.floor(entry.timestamp / 60000);
  const isDuplicate = entries.some(
    (e) =>
      e.module === entry.module &&
      e.input === entry.input &&
      Math.floor(e.timestamp / 60000) === minute
  );
  if (isDuplicate) return;

  const newEntry: HistoryEntry = { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` };
  const updated = [newEntry, ...entries].slice(0, MAX_ENTRIES);
  save(updated);
}

// Writes the entry's input+result back to sessionStorage for the target page,
// so usePersistedState picks it up on navigation.
export function primeRestoreForModule(entry: HistoryEntry): void {
  const inputKey = `x-growth:${entry.module}:input`;
  const resultKey = `x-growth:${entry.module}:result`;
  try {
    sessionStorage.setItem(inputKey, JSON.stringify(entry.input));
    sessionStorage.setItem(resultKey, JSON.stringify(entry.result));
    // Trends uses 'niche', composer uses 'idea' — handle aliases
    if (entry.module === "trends") {
      sessionStorage.setItem("x-growth:trends:niche", JSON.stringify(entry.input));
    }
    if (entry.module === "composer") {
      sessionStorage.setItem("x-growth:composer:idea", JSON.stringify(entry.input));
    }
  } catch {}
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function useHistory(module?: ModuleKey) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const all = load();
    setEntries(module ? all.filter((e) => e.module === module) : all);
  }, [module]);

  const refresh = useCallback(() => {
    const all = load();
    setEntries(module ? all.filter((e) => e.module === module) : all);
  }, [module]);

  return { entries, refresh };
}
