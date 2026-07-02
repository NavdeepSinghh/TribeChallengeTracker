export default function WorkoutEntryCard({ accent, copy, icon, onClick, theme, title }) {
  return (
    <button
      onClick={onClick}
      style={{
        alignItems: "stretch",
        background: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: 18,
        color: theme.text,
        cursor: "pointer",
        display: "flex",
        gap: 12,
        padding: 14,
        textAlign: "left",
        width: "100%",
      }}
    >
      <span style={{
        alignItems: "center",
        background: `${accent}1f`,
        border: `1px solid ${accent}40`,
        borderRadius: 14,
        color: accent,
        display: "flex",
        flex: "0 0 46px",
        fontSize: 22,
        height: 46,
        justifyContent: "center",
      }}>
        {icon}
      </span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 900, lineHeight: 1.1, marginBottom: 5 }}>{title}</span>
        <span style={{ color: theme.textSoft, display: "block", fontSize: 12, lineHeight: 1.4 }}>{copy}</span>
      </span>
    </button>
  );
}
