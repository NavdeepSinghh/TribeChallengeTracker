import { useAppTheme } from "./AppThemeContext";

const APPEARANCE_OPTIONS = [
  { id: "system", icon: "◐", label: "System appearance" },
  { id: "day", icon: "☀", label: "Day mode" },
  { id: "night", icon: "☾", label: "Night mode" },
];

export default function AppAuthenticatedFrame({ children }) {
  const { mode, setMode, theme } = useAppTheme();

  return (
    <div style={{
      minHeight: "100vh", background: theme.appBg,
      fontFamily: "'Space Grotesk', sans-serif",
      color: theme.text, maxWidth: 430, margin: "0 auto", position: "relative",
      paddingTop: "env(safe-area-inset-top)",
      paddingBottom: "calc(80px + env(safe-area-inset-bottom))",
      paddingLeft: "env(safe-area-inset-left)",
      paddingRight: "env(safe-area-inset-right)",
      transition: "background .2s ease, color .2s ease",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{
        position: "fixed", top: "max(env(safe-area-inset-top), 10px)", right: "calc(50% - 205px)",
        zIndex: 20, display: "flex", gap: 4, padding: 4, borderRadius: 999,
        background: theme.cardBgStrong, border: `1px solid ${theme.cardBorder}`, backdropFilter: "blur(18px)",
      }}>
        {APPEARANCE_OPTIONS.map(option => (
          <button
            key={option.id}
            aria-label={option.label}
            title={option.label}
            onClick={() => setMode(option.id)}
            style={{
              width: 28, height: 28, borderRadius: 999, border: 0,
              background: mode === option.id ? "#FF6B35" : "transparent",
              color: mode === option.id ? "#080808" : theme.textSoft,
              cursor: "pointer", fontSize: 15, fontWeight: 900,
            }}
          >
            {option.icon}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
