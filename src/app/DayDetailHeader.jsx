export default function DayDetailHeader({ isPast, isToday, label, onClose }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
      <div>
        <p style={{ margin: "0 0 4px", fontSize: 10, color: "#555", fontWeight: 700, letterSpacing: 2, fontFamily: "monospace" }}>
          {isToday ? "TODAY" : isPast ? "PAST DAY" : "UPCOMING"}
        </p>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: "#fff" }}>{label}</h2>
      </div>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", fontSize: 22, cursor: "pointer", padding: 4 }}>×</button>
    </div>
  );
}
