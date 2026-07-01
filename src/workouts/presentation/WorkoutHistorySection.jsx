import { useAppTheme } from "../../app/AppThemeContext";
import { useWorkoutHistoryViewModel } from "./useWorkoutHistoryViewModel";

function formatDuration(seconds = 0) {
  const minutes = Math.round(Number(seconds || 0) / 60);
  return `${minutes} min`;
}

function formatVolume(value = 0) {
  return `${Math.round(Number(value || 0)).toLocaleString()} kg`;
}

function SessionRow({ session }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.045)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14,
      padding: 13,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 900, margin: "0 0 4px" }}>{session.name}</p>
          <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 11, fontWeight: 700, margin: 0 }}>
            {session.dateStr} · {session.exerciseCount} exercises · {formatDuration(session.durationSeconds)}
          </p>
        </div>
        <div style={{ color: "#FFD700", fontFamily: "monospace", fontSize: 11, fontWeight: 900, textAlign: "right" }}>
          {formatVolume(session.totalVolumeKg)}
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
        {session.feedId ? <span style={pillStyle("#34D399")}>FEED MIRRORED</span> : <span style={pillStyle("#FF8A65")}>NO FEED ID</span>}
        {session.activityLogId ? <span style={pillStyle("#60A5FA")}>ACTIVITY LOGGED</span> : null}
        {session.publicWorkoutId ? <span style={pillStyle("#FF6B35")}>SHARED</span> : null}
      </div>
    </div>
  );
}

function PrRow({ record }) {
  return (
    <div style={{
      alignItems: "center",
      background: "rgba(255,215,0,0.08)",
      border: "1px solid rgba(255,215,0,0.16)",
      borderRadius: 12,
      display: "flex",
      gap: 10,
      justifyContent: "space-between",
      padding: "11px 12px",
    }}>
      <div>
        <p style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 900, margin: "0 0 3px" }}>{record.exerciseId.replace(/_/g, " ")}</p>
        <p style={{ color: "rgba(255,255,255,0.56)", fontSize: 10, margin: 0 }}>Best weight {Math.round(record.bestWeightKg)} kg</p>
      </div>
      <span style={{ color: "#FFD700", fontFamily: "monospace", fontSize: 12, fontWeight: 900 }}>
        e1RM {Math.round(record.bestEstimatedOneRepMaxKg)} kg
      </span>
    </div>
  );
}

export default function WorkoutHistorySection({ useCases }) {
  const { theme } = useAppTheme();
  const vm = useWorkoutHistoryViewModel({ useCases });
  const maxVolume = Math.max(...vm.volumeTrend.map(point => point.volumeKg), 1);

  return (
    <section style={{
      background: "#040404",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 18,
      marginBottom: 24,
      overflow: "hidden",
    }}>
      <div style={{ padding: 18 }}>
        <p style={eyebrowStyle}>WORKOUT HISTORY</p>
        <h3 style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 900, margin: "0 0 8px" }}>Progress that follows the session.</h3>
        <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 13, lineHeight: 1.45, margin: 0 }}>
          Finished guided workouts write history, PRs, activity logs, and feed mirrors from the trusted backend.
        </p>
      </div>

      <div style={{ display: "grid", gap: 14, padding: "0 16px 16px" }}>
        {vm.status === "loading" ? (
          <p style={{ color: theme.textSoft, fontSize: 13, margin: 0 }}>Loading workout history...</p>
        ) : null}

        {vm.status === "failed" ? (
          <div style={panelStyle("rgba(255,107,53,0.10)", "rgba(255,107,53,0.26)")}>
            <p style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 900, margin: "0 0 8px" }}>History unavailable</p>
            <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 13, margin: "0 0 12px" }}>{vm.errorMessage}</p>
            <button onClick={vm.load} style={buttonStyle}>Retry</button>
          </div>
        ) : null}

        {vm.status === "empty" ? (
          <div style={panelStyle("rgba(255,255,255,0.04)", "rgba(255,255,255,0.08)")}>
            <p style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 900, margin: "0 0 6px" }}>No guided sessions yet</p>
            <p style={{ color: "rgba(255,255,255,0.64)", fontSize: 13, margin: 0 }}>Finish a guided workout to unlock history, PRs, and feed mirror checks.</p>
          </div>
        ) : null}

        {vm.status === "loaded" ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
              <Metric label="Sessions" value={vm.summary.sessionCount} color="#FF6B35" />
              <Metric label="Volume" value={formatVolume(vm.summary.totalVolumeKg)} color="#FFD700" />
              <Metric label="PRs" value={vm.summary.personalRecordCount} color="#34D399" />
            </div>

            {vm.volumeTrend.length ? (
              <div style={panelStyle("rgba(255,255,255,0.035)", "rgba(255,255,255,0.08)")}>
                <p style={eyebrowStyle}>VOLUME TREND</p>
                <div style={{ alignItems: "end", display: "grid", gridTemplateColumns: `repeat(${vm.volumeTrend.length}, 1fr)`, gap: 8, minHeight: 92 }}>
                  {vm.volumeTrend.map(point => (
                    <div key={point.id} style={{ display: "grid", gap: 5 }}>
                      <div style={{
                        background: "linear-gradient(180deg, #FFD700, #FF6B35)",
                        borderRadius: 999,
                        height: Math.max(12, (point.volumeKg / maxVolume) * 80),
                      }} />
                      <span style={{ color: "rgba(255,255,255,0.52)", fontFamily: "monospace", fontSize: 9, fontWeight: 900, textAlign: "center" }}>{point.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div style={{ display: "grid", gap: 9 }}>
              {vm.sessions.slice(0, 4).map(session => <SessionRow key={session.id} session={session} />)}
            </div>

            {vm.personalRecords.length ? (
              <div style={{ display: "grid", gap: 8 }}>
                <p style={eyebrowStyle}>PERSONAL RECORDS</p>
                {vm.personalRecords.slice(0, 3).map(record => <PrRow key={record.exerciseId} record={record} />)}
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}

function Metric({ label, value, color }) {
  return (
    <div style={panelStyle("rgba(255,255,255,0.04)", "rgba(255,255,255,0.08)")}>
      <p style={{ color, fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 900, margin: "0 0 3px" }}>{value}</p>
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

function pillStyle(color) {
  return {
    border: `1px solid ${color}55`,
    borderRadius: 999,
    color,
    fontFamily: "monospace",
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: 0.7,
    padding: "4px 7px",
  };
}

const eyebrowStyle = {
  color: "rgba(255,255,255,0.52)",
  fontFamily: "monospace",
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: 1.2,
  margin: "0 0 10px",
};

const buttonStyle = {
  background: "linear-gradient(135deg, #FF6B35, #FFD700)",
  border: "none",
  borderRadius: 12,
  color: "#040404",
  cursor: "pointer",
  fontFamily: "'Syne', sans-serif",
  fontSize: 13,
  fontWeight: 900,
  minHeight: 40,
  padding: "0 16px",
};
