import { useAppTheme } from "./AppThemeContext";

export default function LogModalActions({
  actInfo,
  handle,
  isSubmitLocked,
  loggedActivitiesCount,
  onClose,
  value,
}) {
  const { theme } = useAppTheme();

  return (
    <>
      <button onClick={handle} disabled={!value || isSubmitLocked} style={{
        width: "100%", padding: "14px", borderRadius: 14, border: "none",
        background: isSubmitLocked
          ? "rgba(52,211,153,0.16)"
          : value && actInfo ? `linear-gradient(135deg, ${actInfo.color}, ${actInfo.color}88)` : theme.cardBg,
        color: isSubmitLocked ? "#059669" : value ? theme.textInverse : theme.muted,
        fontSize: 15, fontWeight: 800, cursor: value && !isSubmitLocked ? "pointer" : "default",
        fontFamily: "'Syne', sans-serif", letterSpacing: 0.5,
        boxShadow: value && actInfo && !isSubmitLocked ? `0 4px 20px ${actInfo.color}55` : "none",
        transition: "all .2s",
      }}>
        {isSubmitLocked
          ? "✓ Activity logged"
          : `${actInfo?.icon || ""} Add Activity${value ? ` · +${Math.floor(parseFloat(value || 0) * 2 + 5)} pts` : ""}`}
      </button>

      <button onClick={onClose} style={{
        width: "100%", marginTop: 10, padding: "13px", borderRadius: 14,
        border: `1px solid ${loggedActivitiesCount ? "rgba(52,211,153,0.45)" : theme.cardBorder}`,
        background: loggedActivitiesCount ? "linear-gradient(135deg, #34D399, #10B981)" : "none",
        color: loggedActivitiesCount ? "#06130D" : theme.mutedStrong,
        fontSize: 14, fontWeight: loggedActivitiesCount ? 900 : 700, cursor: "pointer",
        fontFamily: "'Space Grotesk', sans-serif",
        boxShadow: loggedActivitiesCount ? "0 8px 24px rgba(16,185,129,0.24)" : "none",
        transition: "all .2s",
      }}>
        {loggedActivitiesCount
          ? `✓ Done — ${loggedActivitiesCount} ${loggedActivitiesCount === 1 ? "activity" : "activities"} logged`
          : "Cancel"}
      </button>
    </>
  );
}
