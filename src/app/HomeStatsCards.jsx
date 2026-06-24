import { getEntryActivities } from "./activityModel";
import { useAppTheme } from "./AppThemeContext";

export default function HomeStatsCards({ myHistory, streak, totalPts }) {
  const { theme } = useAppTheme();
  const daysActive = Object.keys(myHistory).filter(d => getEntryActivities(myHistory[d]).length > 0).length;
  const stats = [
    { label: "STREAK", value: streak, suffix: "🔥", color: "#FF6B35" },
    { label: "ACTIVITY PTS", value: totalPts, suffix: "pts", color: "#FFD700" },
    { label: "DAYS ACTIVE", value: daysActive, suffix: "", color: "#34D399" },
  ];

  return (
    <div style={{ padding: "0 20px 20px", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
      {stats.map(stat => {
        const content = (
          <>
          <div style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 3,
            maxWidth: "100%",
            minWidth: 0,
            color: stat.color,
            fontFamily: "'Syne', sans-serif",
            fontWeight: 900,
            lineHeight: 1,
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}>
            <span style={{
              display: "block",
              minWidth: 0,
              maxWidth: "100%",
              fontSize: "clamp(18px, 5.2vw, 24px)",
              overflow: "hidden",
              textOverflow: "clip",
            }}>
              {stat.value}
            </span>
            {stat.suffix && (
              <span style={{
                flex: "0 0 auto",
                fontSize: "clamp(10px, 2.8vw, 13px)",
                lineHeight: 1,
              }}>
                {stat.suffix}
              </span>
            )}
          </div>
          <div style={{ fontSize: 9, color: theme.mutedStrong, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", marginTop: 5, lineHeight: 1.15 }}>{stat.label}</div>
          </>
        );

        const style = {
          background: theme.cardBgStrong,
          borderRadius: 16,
          padding: "14px 8px",
          border: `1px solid ${theme.cardBorder}`,
          textAlign: "center",
          minWidth: 0,
          overflow: "hidden",
        };

        return <div key={stat.label} style={style}>{content}</div>;
      })}
    </div>
  );
}
