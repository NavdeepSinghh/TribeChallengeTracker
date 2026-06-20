import { getEntryActivities } from "./activityModel";

export default function HomeStatsCards({ challengeStats, myHistory, setTab, streak, totalPts }) {
  const daysActive = Object.keys(myHistory).filter(d => getEntryActivities(myHistory[d]).length > 0).length;
  const stats = [
    { label: "STREAK", value: streak, suffix: "🔥", color: "#FF6B35" },
    { label: "POINTS", value: totalPts, suffix: "pts", color: "#FFD700" },
    { label: "DAYS ACTIVE", value: daysActive, suffix: "", color: "#34D399" },
    {
      label: "CHALLENGES",
      value: challengeStats.joined,
      suffix: "",
      color: "#FF6B35",
      detail: `${challengeStats.owned} started`,
      onClick: () => setTab("challenges"),
    },
  ];

  return (
    <div style={{ padding: "0 20px 20px", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
      {stats.map(stat => {
        const content = (
          <>
          <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: stat.color }}>{stat.value}<span style={{ fontSize: 14 }}>{stat.suffix}</span></div>
          <div style={{ fontSize: 9, color: "#555", fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", marginTop: 2 }}>{stat.label}</div>
            {stat.detail && (
              <div style={{ fontSize: 9, color: "#888", fontWeight: 700, fontFamily: "monospace", marginTop: 4 }}>{stat.detail}</div>
            )}
          </>
        );

        const style = {
          background: "rgba(255,255,255,0.04)",
          borderRadius: 16,
          padding: "14px 10px",
          border: stat.onClick ? "1px solid rgba(255,107,53,0.22)" : "1px solid rgba(255,255,255,0.06)",
          textAlign: "center",
          minWidth: 0,
        };

        if (stat.onClick) {
          return (
            <button key={stat.label} onClick={stat.onClick} style={{ ...style, cursor: "pointer" }} aria-label="View challenges">
              {content}
            </button>
          );
        }

        return <div key={stat.label} style={style}>{content}</div>;
      })}
    </div>
  );
}
