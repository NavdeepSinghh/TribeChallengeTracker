export default function BadgeList({ badges, earnedBadges }) {
  return (
    <div style={{ padding: "24px 20px 0" }}>
      <p style={{ color: "#555", fontSize: 10, fontWeight: 700, letterSpacing: 2, margin: "0 0 14px", fontFamily: "monospace" }}>ALL BADGES</p>
      {badges.map(badge => {
        const earned = earnedBadges.has(badge.id);
        return (
          <div key={badge.id} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "11px 0",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            opacity: earned ? 1 : 0.45,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11, flexShrink: 0,
              background: earned ? `${badge.color}22` : "rgba(255,255,255,0.04)",
              border: `1.5px solid ${earned ? badge.color + "66" : "rgba(255,255,255,0.08)"}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
            }}>
              {earned ? badge.icon : "🔒"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: earned ? "#fff" : "#888" }}>{badge.label}</div>
              <div style={{ fontSize: 11, color: "#555", fontFamily: "monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{badge.desc}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              {earned
                ? <span style={{ fontSize: 10, color: "#34D399", fontWeight: 700, fontFamily: "monospace" }}>✓ EARNED</span>
                : <span style={{ fontSize: 10, color: "#555", fontFamily: "monospace" }}>+{badge.xp} XP</span>
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}
