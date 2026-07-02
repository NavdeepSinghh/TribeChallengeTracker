import { WORKOUT_FLOWS } from "./workoutTabFlowCopy";

export default function WorkoutFlowHeader({ activeFlow, onBack, theme }) {
  const flow = WORKOUT_FLOWS[activeFlow] || WORKOUT_FLOWS.hub;
  return (
    <div style={{ marginBottom: 18 }}>
      {activeFlow !== "hub" ? (
        <button
          onClick={onBack}
          style={{
            alignItems: "center",
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: 999,
            color: theme.text,
            cursor: "pointer",
            display: "inline-flex",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 12,
            fontWeight: 900,
            gap: 8,
            marginBottom: 16,
            minHeight: 36,
            padding: "0 13px",
          }}
        >
          Workouts
        </button>
      ) : null}
      <p style={{ color: theme.mutedStrong, fontSize: 11, fontWeight: 800, letterSpacing: 2, margin: "0 0 6px", fontFamily: "monospace" }}>{flow.eyebrow}</p>
      <h2 style={{ margin: "0 0 8px", fontSize: activeFlow === "hub" ? 30 : 26, lineHeight: 1.04, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: theme.text }}>{flow.title}</h2>
      <p style={{ color: theme.textSoft, fontSize: 13, lineHeight: 1.5, margin: 0, maxWidth: 520 }}>{flow.copy}</p>
    </div>
  );
}
