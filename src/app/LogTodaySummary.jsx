import { ACTIVITY_TYPES } from "./activityModel";
import { useAppTheme } from "./AppThemeContext";

export default function LogTodaySummary({ loggedActivities }) {
  const { theme } = useAppTheme();

  if (!loggedActivities.length) return null;

  return (
    <div style={{ marginBottom: 20, padding: "12px 14px", borderRadius: 12, background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.15)" }}>
      <p style={{ color: "#34D399", fontSize: 10, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 8px" }}>
        TODAY — {loggedActivities.length} {loggedActivities.length === 1 ? "ACTIVITY" : "ACTIVITIES"} LOGGED
      </p>
      {loggedActivities.map((a, i) => {
        const ai = ACTIVITY_TYPES.find(x => x.id === a.type);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderTop: i === 0 ? "none" : `1px solid ${theme.divider}` }}>
            <span style={{ fontSize: 15 }}>{ai?.icon}</span>
            <span style={{ flex: 1, fontSize: 12, color: theme.textSoft, fontWeight: 600 }}>
              {ai?.label} · {a.value} {ai?.unit}
              {a.note ? <span style={{ color: theme.mutedStrong, fontWeight: 400 }}> · {a.note}</span> : null}
            </span>
            <span style={{ fontSize: 11, color: ai?.color, fontFamily: "monospace", fontWeight: 700 }}>+{a.points} pts</span>
          </div>
        );
      })}
      <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${theme.divider}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: theme.mutedStrong, fontFamily: "monospace", letterSpacing: 0.5 }}>TOTAL TODAY</span>
        <span style={{ fontSize: 13, color: "#FFD700", fontFamily: "monospace", fontWeight: 800 }}>
          +{loggedActivities.reduce((s, a) => s + (a.points || 0), 0)} pts
        </span>
      </div>
    </div>
  );
}
