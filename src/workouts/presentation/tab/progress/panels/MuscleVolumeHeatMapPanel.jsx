function formatVolume(value = 0) {
  return `${Math.round(Number(value || 0)).toLocaleString()} kg`;
}

export default function MuscleVolumeHeatMapPanel({ vm }) {
  const insight = vm?.muscleVolumeInsight;
  const topMuscles = insight?.topMuscles || [];
  const isInsufficient = insight?.insufficientData;
  const cooldownSeconds = vm?.aggregateCooldownSeconds || 0;
  return (
    <div style={panelStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        <div>
          <p style={eyebrowStyle}>MUSCLE VOLUME</p>
          <h4 style={titleStyle}>{insight?.periodKey || "This week"}</h4>
        </div>
        <button
          disabled={vm?.aggregateStatus === "syncing" || cooldownSeconds > 0}
          onClick={vm?.refreshMuscleVolume}
          style={{
            ...buttonStyle,
            opacity: vm?.aggregateStatus === "syncing" || cooldownSeconds > 0 ? 0.5 : 1,
          }}
          type="button"
        >
          {cooldownSeconds > 0 ? `Try in ${cooldownSeconds}s` : (vm?.aggregateStatus === "syncing" ? "Refreshing..." : "Refresh weekly read")}
        </button>
      </div>

      {vm?.aggregateStatus === "loading" ? (
        <p style={bodyStyle}>Loading weekly muscle focus...</p>
      ) : null}

      {vm?.aggregateStatus === "failed" ? (
        <p style={bodyStyle}>{vm.errorMessage || "Muscle volume could not load. Try again shortly."}</p>
      ) : null}

      {topMuscles.length ? (
        <div style={{ display: "grid", gap: 9 }}>
          <div style={{
            alignItems: "center",
            display: "grid",
            gap: 10,
            gridTemplateColumns: "88px 1fr 72px",
          }}>
            {topMuscles.map(muscle => (
              <MuscleBar key={muscle.muscle} muscle={muscle} />
            ))}
          </div>
          <p style={{ ...bodyStyle, fontSize: 11 }}>
            {isInsufficient
              ? `Needs ${Math.max(0, (insight?.minimumSessionCount || 3) - (insight?.sessionCount || 0))} more completed workout(s) for a stronger weekly read.`
              : "Rounded weekly volume by primary muscle group. Private until you choose to share."}
          </p>
        </div>
      ) : (
        <p style={bodyStyle}>Finish three guided workouts this week to unlock a private muscle-focus map.</p>
      )}
    </div>
  );
}

function MuscleBar({ muscle }) {
  return (
    <>
      <span style={{
        color: "rgba(255,255,255,0.72)",
        fontFamily: "monospace",
        fontSize: 10,
        fontWeight: 900,
        letterSpacing: 0.7,
        textTransform: "uppercase",
      }}>
        {muscle.label}
      </span>
      <div style={{
        background: "rgba(255,255,255,0.06)",
        borderRadius: 999,
        height: 10,
        overflow: "hidden",
      }}>
        <div style={{
          background: "linear-gradient(90deg, #FF6B35, #FFD700)",
          borderRadius: 999,
          height: "100%",
          width: `${Math.round((muscle.intensity || 0) * 100)}%`,
        }} />
      </div>
      <span style={{
        color: "#FFD700",
        fontFamily: "monospace",
        fontSize: 10,
        fontWeight: 900,
        textAlign: "right",
      }}>
        {formatVolume(muscle.volumeKg)}
      </span>
    </>
  );
}

const panelStyle = {
  background: "rgba(255,255,255,0.035)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
  padding: 14,
};

const eyebrowStyle = {
  color: "rgba(255,255,255,0.52)",
  fontFamily: "monospace",
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: 1.2,
  margin: "0 0 7px",
};

const titleStyle = {
  color: "#FFFFFF",
  fontFamily: "'Syne', sans-serif",
  fontSize: 20,
  fontWeight: 900,
  margin: 0,
};

const bodyStyle = {
  color: "rgba(255,255,255,0.66)",
  fontSize: 13,
  lineHeight: 1.45,
  margin: 0,
};

const buttonStyle = {
  background: "rgba(255,107,53,0.14)",
  border: "1px solid rgba(255,107,53,0.28)",
  borderRadius: 12,
  color: "#FF6B35",
  cursor: "pointer",
  fontFamily: "'Syne', sans-serif",
  fontSize: 12,
  fontWeight: 900,
  minHeight: 36,
  padding: "0 12px",
  whiteSpace: "nowrap",
};
