import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";

// Drop-in replacement for useState that persists to sessionStorage.
// Keys are namespaced: "x-growth:{key}".
// Survives tab navigation within the same browser session.
// Images / large blobs should NOT be persisted — callers are responsible for excluding them.
export function usePersistedState<T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const storageKey = `x-growth:${key}`;
  const initialized = useRef(false);

  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw !== null) return JSON.parse(raw) as T;
    } catch {}
    return defaultValue;
  });

  // Sync to sessionStorage whenever state changes, after initial mount
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    try {
      if (state === null || state === undefined) {
        sessionStorage.removeItem(storageKey);
      } else {
        sessionStorage.setItem(storageKey, JSON.stringify(state));
      }
    } catch {}
  }, [storageKey, state]);

  return [state, setState];
}
