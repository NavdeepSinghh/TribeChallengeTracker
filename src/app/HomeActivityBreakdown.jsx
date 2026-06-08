import { ACTIVITY_TYPES } from "./activityModel";

export default function HomeActivityBreakdown({ actCounts }) {
  return (
    <div style={{ padding: "0 20px 24px" }}>
      <p style={{ color: "#555", fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 12px" }}>ACTIVITY BREAKDOWN</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ACTIVITY_TYPES.filter(activity => actCounts[activity.id] > 0).map(activity => (
          <div key={activity.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{activity.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#ccc" }}>{activity.label}</span>
                <span style={{ fontSize: 11, color: "#666", fontFamily: "monospace" }}>{actCounts[activity.id]}x</span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 4 }}>
                <div style={{ height: "100%", borderRadius: 4, background: activity.color, width: `${Math.min(100, (actCounts[activity.id] / 15) * 100)}%`, transition: "width .6s ease" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
