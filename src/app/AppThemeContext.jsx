import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "tribelog.appearance";

const AppThemeContext = createContext({
  mode: "system",
  resolvedMode: "night",
  setMode: () => {},
  theme: {},
});

const PALETTES = {
  night: {
    appBg: "#080808",
    cardBg: "rgba(255,255,255,0.03)",
    cardBgStrong: "rgba(255,255,255,0.05)",
    cardBorder: "rgba(255,255,255,0.06)",
    divider: "rgba(255,255,255,0.05)",
    text: "#FFFFFF",
    textSoft: "#CCCCCC",
    muted: "#555555",
    mutedStrong: "#888888",
    navBg: "rgba(8,8,8,0.95)",
    navInactive: "#444444",
  },
  day: {
    appBg: "#F7F4EF",
    cardBg: "rgba(255,255,255,0.84)",
    cardBgStrong: "rgba(255,255,255,0.96)",
    cardBorder: "rgba(34,34,34,0.10)",
    divider: "rgba(34,34,34,0.08)",
    text: "#171717",
    textSoft: "#2F2F2F",
    muted: "#76716A",
    mutedStrong: "#514B44",
    navBg: "rgba(255,255,255,0.92)",
    navInactive: "#7A746E",
  },
};

function getSystemMode() {
  if (typeof window === "undefined") return "night";
  return window.matchMedia?.("(prefers-color-scheme: light)")?.matches ? "day" : "night";
}

function getInitialMode() {
  if (typeof window === "undefined") return "system";
  return localStorage.getItem(STORAGE_KEY) || "system";
}

export function AppThemeProvider({ children }) {
  const [mode, setModeState] = useState(getInitialMode);
  const [systemMode, setSystemMode] = useState(getSystemMode);
  const resolvedMode = mode === "system" ? systemMode : mode;
  const theme = PALETTES[resolvedMode] || PALETTES.night;

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: light)");
    if (!media) return undefined;
    const onChange = () => setSystemMode(getSystemMode());
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.appearance = resolvedMode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", resolvedMode === "day" ? "#F7F4EF" : "#12C7C1");
  }, [resolvedMode]);

  const value = useMemo(() => ({
    mode,
    resolvedMode,
    setMode: nextMode => {
      setModeState(nextMode);
      localStorage.setItem(STORAGE_KEY, nextMode);
    },
    theme,
  }), [mode, resolvedMode, theme]);

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  return useContext(AppThemeContext);
}
