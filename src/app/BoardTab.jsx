import { ACTIVITY_TYPES } from "./activityModel";

export default function BoardTab({
  actCounts,
  allActivities,
  daysActive,
  setTab,
  streak,
  totalPts,
}) {
  return (
    <div style={{ padding: "52px 20px 20px" }}>
      <p style={{ color: "#555", fontSize: 11, fontWeight: 700, letterSpacing: 2, margin: "0 0 6px", fontFamily: "monospace" }}>YOUR STATS</p>
      <h2 style={{ margin: "0 0 24px", fontSize: 26, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>Performance 📊</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[
          { label: "TOTAL POINTS", value: totalPts, suffix: " pts", color: "#FFD700", icon: "⭐" },
          { label: "CURRENT STREAK", value: streak, suffix: " days", color: "#FF6B35", icon: "🔥" },
          { label: "DAYS ACTIVE", value: daysActive, suffix: " days", color: "#34D399", icon: "📅" },
          { label: "ACTIVITIES", value: allActivities.length, suffix: " total", color: "#60A5FA", icon: "💪" },
        ].map(stat => (
          <div key={stat.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "16px", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>{stat.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: stat.color }}>{stat.value}<span style={{ fontSize: 13 }}>{stat.suffix}</span></div>
            <div style={{ fontSize: 9, color: "#555", fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "20px", borderRadius: 18, background: "linear-gradient(135deg, rgba(255,107,53,0.12), rgba(255,215,0,0.08))", border: "1px solid rgba(255,107,53,0.2)", marginBottom: 24 }}>
        <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 800, color: "#FFD700", fontFamily: "'Syne', sans-serif" }}>Challenge Leaderboards 🏆</p>
        <p style={{ margin: "0 0 14px", fontSize: 12, color: "#888" }}>Join or create a challenge to compete with the tribe and climb the leaderboard.</p>
        <button onClick={() => setTab("challenges")} style={{ padding: "10px 18px", borderRadius: 12, background: "linear-gradient(135deg, #FF6B35, #FFD700)", border: "none", color: "#000", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>
          View Challenges →
        </button>
      </div>

      <p style={{ color: "#555", fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 12px" }}>ACTIVITY BREAKDOWN</p>
      {Object.values(actCounts).some(value => value > 0) ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ACTIVITY_TYPES.filter(activity => actCounts[activity.id] > 0).map(activity => (
            <div key={activity.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: 22 }}>{activity.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#ccc" }}>{activity.label}</span>
                  <span style={{ fontSize: 11, color: "#666", fontFamily: "monospace" }}>{actCounts[activity.id]}x</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 4 }}>
                  <div style={{ height: "100%", borderRadius: 4, background: activity.color, width: `${Math.min(100, (actCounts[activity.id] / 15) * 100)}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "32px 20px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#555" }}>No activities logged yet.<br />Tap <span style={{ color: "#FF6B35", fontWeight: 700 }}>Log Today's Activity</span> to get started!</p>
        </div>
      )}
    </div>
  );
}
