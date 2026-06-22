import DayActivityList from "./DayActivityList";

export default function DayDetailLoggedSummary({
  actMap,
  acts,
  isPast,
  isToday,
  onDeleteActivity,
  onLogMore,
  total,
}) {
  return (
    <>
      <DayActivityList actMap={actMap} acts={acts} onDeleteActivity={onDeleteActivity} />

      <div style={{
        background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "12px 16px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20,
      }}>
        <span style={{ fontSize: 11, color: "#555", fontWeight: 700, letterSpacing: 1, fontFamily: "monospace" }}>TOTAL POINTS TODAY</span>
        <span style={{ fontSize: 20, fontWeight: 900, color: "#FFD700", fontFamily: "'Syne', sans-serif" }}>{total} pts</span>
      </div>

      {(isToday || isPast) && (
        <button onClick={onLogMore} style={{
          width: "100%", padding: "13px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.05)", color: "#ccc", fontSize: 13, fontWeight: 700,
          cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
        }}>
          + Add another activity
        </button>
      )}
    </>
  );
}
