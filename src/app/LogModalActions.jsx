export default function LogModalActions({
  actInfo,
  handle,
  loggedActivitiesCount,
  onClose,
  value,
}) {
  return (
    <>
      <button onClick={handle} disabled={!value} style={{
        width: "100%", padding: "14px", borderRadius: 14, border: "none",
        background: value && actInfo ? `linear-gradient(135deg, ${actInfo.color}, ${actInfo.color}88)` : "rgba(255,255,255,0.07)",
        color: value ? "#fff" : "#555", fontSize: 15, fontWeight: 800, cursor: value ? "pointer" : "default",
        fontFamily: "'Syne', sans-serif", letterSpacing: 0.5,
        boxShadow: value && actInfo ? `0 4px 20px ${actInfo.color}55` : "none",
        transition: "all .2s",
      }}>
        {actInfo?.icon} Add Activity{value ? ` · +${Math.floor(parseFloat(value || 0) * 2 + 5)} pts` : ""}
      </button>

      <button onClick={onClose} style={{
        width: "100%", marginTop: 10, padding: "13px", borderRadius: 14,
        border: `1px solid ${loggedActivitiesCount ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.07)"}`,
        background: "none",
        color: loggedActivitiesCount ? "#34D399" : "#444",
        fontSize: 14, fontWeight: 700, cursor: "pointer",
        fontFamily: "'Space Grotesk', sans-serif",
        transition: "all .2s",
      }}>
        {loggedActivitiesCount
          ? `✓ Done — ${loggedActivitiesCount} ${loggedActivitiesCount === 1 ? "activity" : "activities"} logged`
          : "Cancel"}
      </button>
    </>
  );
}
