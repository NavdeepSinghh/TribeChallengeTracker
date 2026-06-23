export default function RankBadge({ rank, size = 18, style, titlePrefix = "Current level" }) {
  if (!rank) return null;

  return (
    <span
      title={`${titlePrefix}: ${rank.label}`}
      aria-label={`${titlePrefix}: ${rank.label}`}
      style={{
        position: "absolute",
        right: -4,
        bottom: -4,
        width: size,
        height: size,
        borderRadius: 999,
        display: "grid",
        placeItems: "center",
        background: "#0B0B0B",
        border: `2px solid ${rank.color || "#FFD700"}`,
        boxShadow: `0 0 14px ${(rank.color || "#FFD700")}66`,
        fontSize: Math.max(10, Math.round(size * 0.58)),
        lineHeight: 1,
        zIndex: 2,
        pointerEvents: "none",
        ...style,
      }}
    >
      {rank.icon || "⭐"}
    </span>
  );
}
