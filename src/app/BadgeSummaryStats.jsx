export default function BadgeSummaryStats({ badgeXP, earnedCount, inProgressCount, rank }) {
  const stats = [
    { label: "UNLOCKED", value: earnedCount, color: "#FFD700" },
    { label: "TOTAL XP", value: badgeXP, color: rank.color },
    { label: "IN PROGRESS", value: inProgressCount, color: "#60A5FA" },
  ];

  return (
    <div style={{ padding: "0 20px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
      {stats.map(stat => (
        <div key={stat.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "12px 10px", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: stat.color }}>{stat.value}</div>
          <div style={{ fontSize: 8, color: "#555", fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", marginTop: 2 }}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
