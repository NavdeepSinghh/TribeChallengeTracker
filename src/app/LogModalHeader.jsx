import { today } from "./activityModel";
import { useAppTheme } from "./AppThemeContext";

export default function LogModalHeader({ loggedActivitiesCount, onClose }) {
  const { theme } = useAppTheme();

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: loggedActivitiesCount ? 16 : 24 }}>
      <div>
        <h3 style={{ color: theme.text, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, margin: "0 0 3px" }}>Log Activity</h3>
        <p style={{ margin: 0, fontSize: 10, color: theme.mutedStrong, fontFamily: "monospace", fontWeight: 700, letterSpacing: 1 }}>
          FOR · {today.toLocaleDateString("en", { weekday: "long", day: "numeric", month: "long" }).toUpperCase()}
        </p>
      </div>
      <button onClick={onClose} style={{ background: "none", border: "none", color: theme.mutedStrong, fontSize: 24, cursor: "pointer", marginTop: -2 }}>×</button>
    </div>
  );
}
