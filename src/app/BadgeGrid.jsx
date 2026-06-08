import { getBadgeProgress } from "../badgeService";

export default function BadgeGrid({ badges, earnedBadges, stats }) {
  return (
    <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
      {badges.map(badge => {
        const earned = earnedBadges.has(badge.id);
        const progress = getBadgeProgress(badge.id, stats);
        const pct = progress.target > 0 ? Math.min(100, (progress.current / progress.target) * 100) : 0;
        const inProgress = progress.current > 0 && !earned;

        return (
          <div key={badge.id} style={{
            borderRadius: 18, padding: "15px 10px 12px", textAlign: "center",
            background: earned ? `${badge.color}18` : "rgba(255,255,255,0.03)",
            border: `1.5px solid ${earned ? badge.color + "66" : inProgress ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.05)"}`,
            opacity: earned ? 1 : inProgress ? 0.82 : 0.38,
            boxShadow: earned ? `0 0 22px ${badge.color}22` : "none",
            transition: "all .3s", position: "relative",
          }}>
            {earned && (
              <div style={{
                position: "absolute", top: 8, right: 8,
                width: 17, height: 17, borderRadius: "50%",
                background: "#34D399", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 9, color: "#000", fontWeight: 900,
              }}>✓</div>
            )}
            <div style={{ fontSize: 34, marginBottom: 7, filter: earned || inProgress ? "none" : "grayscale(1)" }}>
              {earned ? badge.icon : inProgress ? badge.icon : "🔒"}
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: earned ? "#fff" : "#888", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.3 }}>
              {badge.label}
            </div>
            {earned && (
              <div style={{ marginTop: 5, fontSize: 9, color: badge.color, fontFamily: "monospace", fontWeight: 700 }}>+{badge.xp} XP</div>
            )}
            {inProgress && (
              <>
                <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 3, marginTop: 8 }}>
                  <div style={{ height: "100%", borderRadius: 3, background: badge.color, width: `${pct}%`, transition: "width .6s" }} />
                </div>
                <div style={{ marginTop: 4, fontSize: 9, color: "#666", fontFamily: "monospace" }}>{progress.current}/{progress.target} {progress.label}</div>
              </>
            )}
            {!earned && !inProgress && (
              <div style={{ marginTop: 5, fontSize: 9, color: "#444", fontFamily: "monospace" }}>{progress.target} {progress.label}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
