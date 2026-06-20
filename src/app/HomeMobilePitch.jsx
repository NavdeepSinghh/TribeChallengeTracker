import { isWeb } from "../platformService";
import { useAppTheme } from "./AppThemeContext";

export default function HomeMobilePitch() {
  const { theme } = useAppTheme();

  if (!isWeb) return null;

  return (
    <div style={{ padding: "16px 20px 0" }}>
      <div style={{
        borderRadius: 16, padding: "14px 16px",
        background: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        display: "flex", gap: 14, alignItems: "center",
      }}>
        <span style={{ fontSize: 30, flexShrink: 0 }}>📱</span>
        <div>
          <p style={{ margin: "0 0 3px", fontSize: 12, fontWeight: 700, color: theme.text }}>More on the mobile app</p>
          <p style={{ margin: 0, fontSize: 11, color: theme.textSoft, lineHeight: 1.5 }}>
            Auto-sync from <span style={{ color: theme.text, fontWeight: 700 }}>Apple Watch</span> &amp; <span style={{ color: theme.text, fontWeight: 700 }}>Galaxy Watch</span>, push notifications for challenges and more — iOS &amp; Android coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
