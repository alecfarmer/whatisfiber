"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ReaderMode = "reader" | "engineer";

const STORAGE_KEY = "whatisfiber:mode";

type ModeContextValue = {
  mode: ReaderMode;
  setMode: (mode: ReaderMode) => void;
  toggleMode: () => void;
};

const ModeContext = createContext<ModeContextValue | null>(null);

export function ModeProvider({
  children,
  initial = "reader",
}: {
  children: ReactNode;
  initial?: ReaderMode;
}) {
  const [mode, setModeState] = useState<ReaderMode>(initial);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as ReaderMode | null;
      if (stored === "reader" || stored === "engineer") {
        setModeState(stored);
      }
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") {
      document.documentElement.dataset.mode = mode;
    }
  }, [mode]);

  const setMode = useCallback((next: ReaderMode) => {
    setModeState(next);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((m) => (m === "reader" ? "engineer" : "reader"));
  }, []);

  return (
    <ModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode(): ModeContextValue {
  const ctx = useContext(ModeContext);
  if (!ctx) {
    throw new Error("useMode must be used inside <ModeProvider>");
  }
  return ctx;
}
