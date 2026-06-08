export default function DayActivityList({ actMap, acts }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
      {acts.map((act, i) => {
        const info = actMap[act.type] || {};
        return (
          <div key={i} style={{
            background: `${info.color || "#fff"}11`,
            border: `1px solid ${info.color || "#fff"}33`,
            borderRadius: 14, padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <span style={{ fontSize: 28 }}>{info.icon || "🏃"}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif" }}>{info.label || act.type}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: info.color || "#FFD700", fontFamily: "monospace" }}>+{act.points || 0} pts</span>
              </div>
              <div style={{ fontSize: 12, color: "#777", fontFamily: "monospace" }}>
                {act.value}{info.unit || ""}{act.note ? ` · "${act.note}"` : ""}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
