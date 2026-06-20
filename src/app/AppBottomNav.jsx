import { useAppTheme } from "./AppThemeContext";

const NAV_ITEMS = [
  { id: "home", icon: "🏠", label: "Home" },
  { id: "challenges", icon: "🎯", label: "Challenges" },
  { id: "board", icon: "🏆", label: "Board" },
  { id: "badges", icon: "⭐", label: "Badges" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

export default function AppBottomNav({ setTab, tab }) {
  const { theme } = useAppTheme();

  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430, background: theme.navBg,
      backdropFilter: "blur(20px)", borderTop: `1px solid ${theme.cardBorder}`,
      display: "flex", padding: "10px 0",
      paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
    }}>
      {NAV_ITEMS.map(n => (
        <button key={n.id} onClick={() => setTab(n.id)} style={{
          flex: 1, background: "none", border: "none", color: tab === n.id ? "#FF6B35" : theme.navInactive,
          cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          padding: "4px 0", transition: "color .2s",
        }}>
          <span style={{ fontSize: 20 }}>{n.icon}</span>
          <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "monospace", letterSpacing: 0.5 }}>{n.label.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}
