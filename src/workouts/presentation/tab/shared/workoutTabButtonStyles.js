export const primaryActionButtonStyle = {
  background: "linear-gradient(135deg, #FF6B35, #FFD700)",
  border: "none",
  borderRadius: 14,
  color: "#040404",
  cursor: "pointer",
  fontFamily: "'Syne', sans-serif",
  fontSize: 13,
  fontWeight: 900,
  minHeight: 44,
};

export function secondaryActionButtonStyle(theme) {
  return {
    background: theme.cardBg,
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: 14,
    color: theme.text,
    cursor: "pointer",
    fontFamily: "'Syne', sans-serif",
    fontSize: 13,
    fontWeight: 900,
    minHeight: 44,
  };
}
