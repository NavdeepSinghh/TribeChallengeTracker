export default function DayDetailEmptyState({ isPast, isToday, onLogMore }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 0 24px" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>😴</div>
      <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: "#fff" }}>No activity logged</p>
      <p style={{ margin: "0 0 24px", fontSize: 12, color: "#555", fontFamily: "monospace" }}>
        {isToday ? "Log today's workout below" : "Rest day or missed — that's ok"}
      </p>
      {(isToday || isPast) && (
        <button onClick={onLogMore} style={{
          padding: "12px 28px", borderRadius: 14, border: "none",
          background: "linear-gradient(135deg, #FF6B35, #FFD700)",
          color: "#000", fontSize: 14, fontWeight: 800, cursor: "pointer",
          fontFamily: "'Syne', sans-serif",
        }}>
          {isToday ? "Log Today's Activity" : "Log for This Day"}
        </button>
      )}
    </div>
  );
}
