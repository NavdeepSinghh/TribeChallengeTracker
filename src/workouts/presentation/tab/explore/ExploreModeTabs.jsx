export default function ExploreModeTabs({ mode, onChange, theme }) {
  const tabs = [
    { id: "exercises", label: "Exercises" },
    { id: "tribe", label: "Tribe workouts" },
  ];
  return (
    <div style={{
      background: theme.cardBg,
      border: `1px solid ${theme.cardBorder}`,
      borderRadius: 999,
      display: "grid",
      gap: 4,
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      marginBottom: 14,
      padding: 4,
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            background: mode === tab.id ? "linear-gradient(135deg, #FF6B35, #FFD700)" : "transparent",
            border: "none",
            borderRadius: 999,
            color: mode === tab.id ? "#040404" : theme.textSoft,
            cursor: "pointer",
            fontFamily: "'Syne', sans-serif",
            fontSize: 12,
            fontWeight: 900,
            minHeight: 34,
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
