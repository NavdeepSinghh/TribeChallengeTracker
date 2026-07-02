import { ACTIVITY_TYPES } from "../../../../../app/activityModel";

export default function ActivityBreakdownPanel({ actCounts, theme }) {
  const activeActivities = ACTIVITY_TYPES.filter(activity => (actCounts?.[activity.id] || 0) > 0);
  return (
    <div style={{ marginTop: 20 }}>
      <p style={{ color: theme.mutedStrong, fontSize: 11, fontWeight: 800, letterSpacing: 1.4, fontFamily: "monospace", margin: "0 0 12px" }}>ACTIVITY BREAKDOWN</p>
      {activeActivities.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {activeActivities.map(activity => (
            <div key={activity.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: theme.cardBg, borderRadius: 14, border: `1px solid ${theme.cardBorder}` }}>
              <span style={{ fontSize: 22 }}>{activity.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: theme.text }}>{activity.label}</span>
                  <span style={{ fontSize: 11, color: theme.mutedStrong, fontFamily: "monospace" }}>{actCounts[activity.id]}x</span>
                </div>
                <div style={{ height: 4, background: theme.progressTrack, borderRadius: 4 }}>
                  <div style={{ height: "100%", borderRadius: 4, background: activity.color, width: `${Math.min(100, (actCounts[activity.id] / 15) * 100)}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "26px 18px", borderRadius: 16, background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 13, color: theme.textSoft }}>No activities logged yet. Quick Log gets the first one in fast.</p>
        </div>
      )}
    </div>
  );
}
