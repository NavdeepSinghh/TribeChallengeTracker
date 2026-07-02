import { primaryActionButtonStyle, secondaryActionButtonStyle } from "../shared/workoutTabButtonStyles";

export default function PrimaryWorkoutAction({ onQuickLog, onStart, theme }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(255,107,53,0.18), rgba(255,215,0,0.08))",
      border: "1px solid rgba(255,107,53,0.28)",
      borderRadius: 22,
      marginBottom: 14,
      padding: 18,
    }}>
      <p style={{ color: "#FF8A65", fontFamily: "monospace", fontSize: 11, fontWeight: 900, letterSpacing: 1.4, margin: "0 0 8px" }}>NEXT ACTION</p>
      <h3 style={{ color: theme.text, fontFamily: "'Syne', sans-serif", fontSize: 25, fontWeight: 900, lineHeight: 1.05, margin: "0 0 8px" }}>Start the workout in front of you.</h3>
      <p style={{ color: theme.textSoft, fontSize: 13, lineHeight: 1.5, margin: "0 0 16px" }}>Guided sets, rest timing, and automatic logging when you finish.</p>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, .9fr)" }}>
        <button onClick={onStart} style={primaryActionButtonStyle}>Start workout</button>
        <button onClick={onQuickLog} style={secondaryActionButtonStyle(theme)}>Quick Log</button>
      </div>
    </div>
  );
}
