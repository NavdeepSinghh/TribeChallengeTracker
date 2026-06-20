import { ACTIVITY_TYPES } from "./activityModel";
import { useAppTheme } from "./AppThemeContext";

export default function HomeActivityBreakdown({ actCounts, embedded = false }) {
  const { theme } = useAppTheme();
  const activeActivities = ACTIVITY_TYPES.filter(activity => actCounts[activity.id] > 0);

  return (
    <div style={{ padding: embedded ? 0 : "0 20px 24px" }}>
      <p style={{ color: theme.mutedStrong, fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 12px" }}>ACTIVITY BREAKDOWN</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {activeActivities.length === 0 && (
          <div style={{
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: 14,
            background: theme.cardBg,
            color: theme.textSoft,
            fontSize: 12,
            lineHeight: 1.45,
            padding: 14,
          }}>
            Log your first activity to see your mix here.
          </div>
        )}
        {activeActivities.map(activity => (
          <div key={activity.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{activity.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: theme.text }}>{activity.label}</span>
                <span style={{ fontSize: 11, color: theme.mutedStrong, fontFamily: "monospace" }}>{actCounts[activity.id]}x</span>
              </div>
              <div style={{ height: 4, background: theme.progressTrack, borderRadius: 4 }}>
                <div style={{ height: "100%", borderRadius: 4, background: activity.color, width: `${Math.min(100, (actCounts[activity.id] / 15) * 100)}%`, transition: "width .6s ease" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
