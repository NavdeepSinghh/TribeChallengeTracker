import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "tribelog.appearance";
const DAY_THEME_ENABLED = false;

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
    cardBorderStrong: "rgba(255,255,255,0.12)",
    divider: "rgba(255,255,255,0.05)",
    inputBg: "rgba(255,255,255,0.05)",
    inputBorder: "rgba(255,255,255,0.10)",
    overlayBg: "rgba(0,0,0,0.8)",
    progressTrack: "rgba(255,255,255,0.06)",
    heroBg: "linear-gradient(180deg, #0f0f0f 0%, #080808 100%)",
    text: "#FFFFFF",
    textSoft: "#CCCCCC",
    textInverse: "#080808",
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
    cardBorderStrong: "rgba(34,34,34,0.18)",
    divider: "rgba(34,34,34,0.08)",
    inputBg: "rgba(255,255,255,0.98)",
    inputBorder: "rgba(34,34,34,0.16)",
    overlayBg: "rgba(23,23,23,0.34)",
    progressTrack: "rgba(34,34,34,0.12)",
    heroBg: "linear-gradient(180deg, #FFF8EF 0%, #F7F4EF 100%)",
    text: "#171717",
    textSoft: "#2F2F2F",
    textInverse: "#FFFFFF",
    muted: "#76716A",
    mutedStrong: "#514B44",
    navBg: "rgba(255,255,255,0.92)",
    navInactive: "#7A746E",
  },
};

function getSystemMode() {
  if (!DAY_THEME_ENABLED) return "night";
  if (typeof window === "undefined") return "night";
  return window.matchMedia?.("(prefers-color-scheme: light)")?.matches ? "day" : "night";
}

function getInitialMode() {
  if (!DAY_THEME_ENABLED || typeof window === "undefined") return "night";
  return localStorage.getItem(STORAGE_KEY) || "night";
}

export function AppThemeProvider({ children }) {
  const [mode, setModeState] = useState(getInitialMode);
  const [systemMode, setSystemMode] = useState(getSystemMode);
  const requestedMode = mode === "system" ? systemMode : mode;
  const resolvedMode = DAY_THEME_ENABLED ? requestedMode : "night";
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
      const safeMode = DAY_THEME_ENABLED ? nextMode : "night";
      setModeState(safeMode);
      localStorage.setItem(STORAGE_KEY, safeMode);
    },
    theme,
  }), [mode, resolvedMode, theme]);

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  return useContext(AppThemeContext);
}
