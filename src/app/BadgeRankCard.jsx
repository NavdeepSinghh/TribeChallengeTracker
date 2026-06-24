export default function BadgeRankCard({ badgeXP, rank }) {
  return (
    <div style={{ padding: "0 20px 20px" }}>
      <div style={{
        borderRadius: 22, padding: "20px 22px",
        background: `linear-gradient(135deg, ${rank.color}18, rgba(255,255,255,0.02))`,
        border: `1px solid ${rank.color}44`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: 10, color: "#555", fontFamily: "monospace", fontWeight: 700, letterSpacing: 2 }}>BADGE STATUS</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 28 }}>{rank.icon}</span>
              <span style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: rank.color }}>{rank.label}</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 26, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: rank.color }}>{badgeXP}</div>
            <div style={{ fontSize: 9, color: "#555", fontFamily: "monospace", fontWeight: 700, letterSpacing: 1 }}>TOTAL XP</div>
          </div>
        </div>
        {rank.next ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: "#555", fontFamily: "monospace" }}>Next: {rank.next.icon} {rank.next.label}</span>
              <span style={{ fontSize: 10, color: rank.color, fontFamily: "monospace", fontWeight: 700 }}>{badgeXP}/{rank.next.min} XP</span>
            </div>
            <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 5 }}>
              <div style={{
                height: "100%", borderRadius: 5,
                background: `linear-gradient(90deg, ${rank.color}, ${rank.next.color})`,
                width: `${Math.min(100, ((badgeXP - rank.min) / (rank.next.min - rank.min)) * 100)}%`,
                transition: "width .8s ease",
              }} />
            </div>
          </>
        ) : (
          <div style={{ padding: "8px 14px", borderRadius: 10, background: `${rank.color}22`, textAlign: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: rank.color, fontFamily: "'Syne', sans-serif" }}>👑 Maximum Badge Status Achieved!</span>
          </div>
        )}
      </div>
    </div>
  );
}
