import { ACTIVITY_TYPES } from "./activityModel";

export default function WearableWorkoutPicker({ applyWorkout, setSyncState, syncWorkouts }) {
  return (
    <div>
      <p style={{ color: "#555", fontSize: 10, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 8px" }}>
        TODAY'S WORKOUTS — TAP TO IMPORT
      </p>
      {syncWorkouts.map((w, i) => {
        const ai = ACTIVITY_TYPES.find(a => a.id === w.type);
        const pts = Math.floor(w.value * 2 + 5);
        return (
          <button key={i} onClick={() => applyWorkout(w)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "11px 12px", borderRadius: 12, marginBottom: 7,
            background: `${ai?.color || "#FF6B35"}12`,
            border: `1.5px solid ${ai?.color || "#FF6B35"}44`,
            cursor: "pointer", textAlign: "left", transition: "all .15s",
          }}>
            <span style={{ fontSize: 20 }}>{ai?.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
                {ai?.label} · {w.value} {w.unit}
              </div>
              <div style={{ fontSize: 10, color: "#555", fontFamily: "monospace", marginTop: 2 }}>
                {w.durMin} min{w.calories ? ` · ${w.calories} cal` : ""} · {w.source}
              </div>
            </div>
            <span style={{ fontSize: 11, color: ai?.color, fontFamily: "monospace", fontWeight: 700, flexShrink: 0 }}>
              +{pts} pts →
            </span>
          </button>
        );
      })}
      <button onClick={() => setSyncState("idle")} style={{
        width: "100%", padding: "7px", borderRadius: 8,
        background: "none", border: "1px solid rgba(255,255,255,0.07)",
        color: "#555", fontSize: 11, fontFamily: "monospace", cursor: "pointer", marginTop: 2,
      }}>
        ← Cancel
      </button>
    </div>
  );
}
