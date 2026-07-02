export default function WorkoutSnapshotStrip({ daysActive, streak, theme, totalPts }) {
  const items = [
    { label: "Points", value: totalPts, color: "#FFD700" },
    { label: "Streak", value: `${streak}d`, color: "#FF6B35" },
    { label: "Active", value: `${daysActive}d`, color: "#34D399" },
  ];
  return (
    <div style={{
      background: theme.cardBg,
      border: `1px solid ${theme.cardBorder}`,
      borderRadius: 18,
      display: "grid",
      gap: 1,
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      marginBottom: 14,
      overflow: "hidden",
    }}>
      {items.map(item => (
        <div key={item.label} style={{ background: "rgba(255,255,255,0.025)", padding: "14px 10px", textAlign: "center" }}>
          <p style={{ color: item.color, fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 900, margin: "0 0 3px" }}>{item.value}</p>
          <p style={{ color: theme.mutedStrong, fontFamily: "monospace", fontSize: 9, fontWeight: 900, letterSpacing: 1, margin: 0, textTransform: "uppercase" }}>{item.label}</p>
        </div>
      ))}
    </div>
  );
}
