export default function BadgeSummaryStats({ badgeXP, earnedCount, inProgressCount, rank }) {
  const stats = [
    { label: "EARNED", value: earnedCount, color: "#FFD700" },
    { label: "TOTAL XP", value: badgeXP, color: rank.color },
    { label: "BADGES STARTED", value: inProgressCount, color: "#60A5FA" },
  ];

  return (
    <div style={{ padding: "0 20px 20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {stats.map(stat => (
          <div key={stat.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "12px 8px", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center", minWidth: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 7, color: "#666", fontWeight: 800, letterSpacing: 0.7, fontFamily: "monospace", marginTop: 2, lineHeight: 1.2 }}>{stat.label}</div>
          </div>
        ))}
      </div>
      <p style={{ margin: "10px 2px 0", color: "#777", fontSize: 11, lineHeight: 1.35 }}>
        Badges Started are achievements you have progress on but have not earned yet.
      </p>
    </div>
  );
}
