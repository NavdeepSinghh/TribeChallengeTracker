import { getEntryActivities } from "./activityModel";

export default function HomeStatsCards({ myHistory, streak, totalPts }) {
  const daysActive = Object.keys(myHistory).filter(d => getEntryActivities(myHistory[d]).length > 0).length;
  const stats = [
    { label: "STREAK", value: streak, suffix: "🔥", color: "#FF6B35" },
    { label: "POINTS", value: totalPts, suffix: "pts", color: "#FFD700" },
    { label: "DAYS ACTIVE", value: daysActive, suffix: "", color: "#34D399" },
  ];

  return (
    <div style={{ padding: "0 20px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
      {stats.map(stat => {
        const content = (
          <>
          <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: stat.color }}>{stat.value}<span style={{ fontSize: 14 }}>{stat.suffix}</span></div>
          <div style={{ fontSize: 9, color: "#555", fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", marginTop: 2 }}>{stat.label}</div>
          </>
        );

        const style = {
          background: "rgba(255,255,255,0.04)",
          borderRadius: 16,
          padding: "14px 12px",
          border: "1px solid rgba(255,255,255,0.06)",
          textAlign: "center",
          minWidth: 0,
        };

        return <div key={stat.label} style={style}>{content}</div>;
      })}
    </div>
  );
}
