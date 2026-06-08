import { today } from "./activityModel";

export default function LogModalHeader({ loggedActivitiesCount, onClose }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: loggedActivitiesCount ? 16 : 24 }}>
      <div>
        <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, margin: "0 0 3px" }}>Log Activity</h3>
        <p style={{ margin: 0, fontSize: 10, color: "#555", fontFamily: "monospace", fontWeight: 700, letterSpacing: 1 }}>
          FOR · {today.toLocaleDateString("en", { weekday: "long", day: "numeric", month: "long" }).toUpperCase()}
        </p>
      </div>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", fontSize: 24, cursor: "pointer", marginTop: -2 }}>×</button>
    </div>
  );
}
