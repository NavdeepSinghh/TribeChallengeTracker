function formatSet(set = {}) {
  const weight = Math.round(Number(set.weightKg || 0) * 4) / 4;
  const reps = Math.round(Number(set.reps || 0));
  return weight > 0 && reps > 0 ? `${weight} kg x ${reps}` : "Not enough sets";
}

export default function ProgressiveOverloadInsightPanel({ vm }) {
  const cooldownSeconds = vm?.suggestionCooldownSeconds || 0;
  const disabled = !vm?.candidate || vm?.suggestionStatus === "syncing" || cooldownSeconds > 0;
  const isReady = vm?.activeSuggestion?.status === "ready" && vm?.activeSuggestion?.suggestion;
  return (
    <div style={panelStyle(isReady ? "rgba(52,211,153,0.08)" : "rgba(255,107,53,0.08)", isReady ? "rgba(52,211,153,0.18)" : "rgba(255,107,53,0.18)")}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        <div>
          <p style={eyebrowStyle}>PROGRESSIVE OVERLOAD</p>
          <h4 style={titleStyle}>{vm?.progressionCopy?.title || "Next step pending"}</h4>
        </div>
        <span style={{
          alignSelf: "start",
          background: isReady ? "rgba(52,211,153,0.14)" : "rgba(255,107,53,0.14)",
          border: `1px solid ${isReady ? "rgba(52,211,153,0.28)" : "rgba(255,107,53,0.28)"}`,
          borderRadius: 999,
          color: isReady ? "#34D399" : "#FF6B35",
          fontFamily: "monospace",
          fontSize: 10,
          fontWeight: 900,
          padding: "7px 9px",
          whiteSpace: "nowrap",
        }}>
          {isReady ? "READY" : "PRIVATE"}
        </span>
      </div>
      <p style={bodyStyle}>{vm?.progressionCopy?.body || "TribeLog will use your completed sets to suggest a small, conservative next move."}</p>

      {vm?.activeSuggestion?.latestBestSet ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8, marginTop: 14 }}>
          <Metric label="Latest" value={formatSet(vm.activeSuggestion.latestBestSet)} />
          <Metric label="Previous" value={formatSet(vm.activeSuggestion.previousBestSet)} />
        </div>
      ) : null}

      <div style={{ alignItems: "center", display: "flex", gap: 10, justifyContent: "space-between", marginTop: 14 }}>
        <p style={{ color: "rgba(255,255,255,0.52)", fontSize: 11, lineHeight: 1.35, margin: 0 }}>
          {vm?.candidate ? `Candidate: ${vm.candidate.name}` : "Needs completed guided workouts first."}
        </p>
        <button
          disabled={disabled}
          onClick={vm?.refreshProgressionSuggestion}
          style={{
            ...buttonStyle,
            opacity: disabled ? 0.45 : 1,
          }}
          type="button"
        >
          {cooldownSeconds > 0 ? `Try in ${cooldownSeconds}s` : (vm?.suggestionStatus === "syncing" ? "Refreshing..." : (vm?.progressionCopy?.actionLabel || "Refresh"))}
        </button>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 12,
      padding: 10,
    }}>
      <p style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 900, margin: "0 0 3px" }}>{value}</p>
      <p style={{ color: "rgba(255,255,255,0.48)", fontFamily: "monospace", fontSize: 9, fontWeight: 900, letterSpacing: 1, margin: 0 }}>{label.toUpperCase()}</p>
    </div>
  );
}

function panelStyle(background, border) {
  return {
    background,
    border: `1px solid ${border}`,
    borderRadius: 16,
    padding: 14,
  };
}

const eyebrowStyle = {
  color: "#FF6B35",
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
  color: "rgba(255,255,255,0.68)",
  fontSize: 13,
  lineHeight: 1.45,
  margin: 0,
};

const buttonStyle = {
  background: "linear-gradient(135deg, #FF6B35, #FFD700)",
  border: "none",
  borderRadius: 12,
  color: "#040404",
  cursor: "pointer",
  fontFamily: "'Syne', sans-serif",
  fontSize: 12,
  fontWeight: 900,
  minHeight: 38,
  padding: "0 13px",
  whiteSpace: "nowrap",
};
