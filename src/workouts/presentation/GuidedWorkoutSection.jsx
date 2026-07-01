import { useMemo, useState } from "react";
import { useAppTheme } from "../../app/AppThemeContext";
import { useGuidedWorkoutViewModel } from "./useGuidedWorkoutViewModel";

function labelFor(value) {
  return String(value || "")
    .split("_")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDuration(seconds = 0) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

function PickerCard({ exercise, selected, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        background: selected ? "rgba(255,107,53,0.16)" : "rgba(255,255,255,0.045)",
        border: selected ? "1px solid rgba(255,107,53,0.58)" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        color: "#FFFFFF",
        cursor: "pointer",
        padding: 13,
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <div>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 900, margin: "0 0 4px" }}>{exercise.name}</p>
          <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 11, fontWeight: 700, margin: 0 }}>
            {labelFor(exercise.level)} · {exercise.primaryMuscles.slice(0, 2).map(labelFor).join(", ")}
          </p>
        </div>
        <span style={{
          alignItems: "center",
          background: selected ? "#FF6B35" : "rgba(255,255,255,0.08)",
          borderRadius: 999,
          color: selected ? "#040404" : "rgba(255,255,255,0.62)",
          display: "flex",
          fontSize: 11,
          fontWeight: 900,
          height: 24,
          justifyContent: "center",
          width: 24,
        }}>{selected ? "✓" : "+"}</span>
      </div>
    </button>
  );
}

function ActiveWorkout({ vm }) {
  const [shareVisibility, setShareVisibility] = useState("private");
  const exercise = vm.currentExercise;
  const set = vm.currentSet;

  if (!vm.activeSession || !exercise || !set) return null;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{
        background: "linear-gradient(135deg, rgba(255,107,53,0.18), rgba(255,255,255,0.04))",
        border: "1px solid rgba(255,107,53,0.24)",
        borderRadius: 18,
        padding: 16,
      }}>
        <p style={eyebrowStyle}>ACTIVE SESSION</p>
        <h4 style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 900, margin: "0 0 6px" }}>{exercise.nameSnapshot}</h4>
        <p style={{ color: "rgba(255,255,255,0.66)", fontSize: 13, margin: 0 }}>
          Set {set.setNumber} · {vm.summary.completedSets}/{vm.summary.totalSets} completed · {formatDuration(vm.summary.durationSeconds)}
        </p>
      </div>

      {vm.activeSession.restRemainingSeconds > 0 ? (
        <div style={{
          alignItems: "center",
          background: "rgba(255,215,0,0.10)",
          border: "1px solid rgba(255,215,0,0.22)",
          borderRadius: 16,
          display: "flex",
          justifyContent: "space-between",
          padding: 14,
        }}>
          <div>
            <p style={{ color: "#FFD700", fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 900, margin: "0 0 3px" }}>Rest timer</p>
            <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 12, margin: 0 }}>Next set unlocks when you are ready.</p>
          </div>
          <span style={{ color: "#FFD700", fontFamily: "monospace", fontSize: 26, fontWeight: 900 }}>{vm.activeSession.restRemainingSeconds}s</span>
        </div>
      ) : null}

      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        display: "grid",
        gap: 12,
        padding: 14,
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <label style={fieldLabelStyle}>
            <span>REPS</span>
            <input
              inputMode="numeric"
              value={set.reps}
              onChange={event => vm.updateCurrentSet({ reps: event.target.value })}
              style={inputStyle}
            />
          </label>
          <label style={fieldLabelStyle}>
            <span>WEIGHT KG</span>
            <input
              inputMode="decimal"
              value={set.weightKg}
              onChange={event => vm.updateCurrentSet({ weightKg: event.target.value })}
              placeholder="0"
              style={inputStyle}
            />
          </label>
        </div>
        <button onClick={vm.completeSet} disabled={Boolean(set.completedAt)} style={primaryButtonStyle}>
          {set.completedAt ? "Set Complete" : "Complete Set"}
        </button>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: 14,
      }}>
        <p style={eyebrowStyle}>FINISH</p>
        <label style={fieldLabelStyle}>
          <span>VISIBILITY</span>
          <select value={shareVisibility} onChange={event => setShareVisibility(event.target.value)} style={inputStyle}>
            <option value="private">Private</option>
            <option value="tribe">Tribe</option>
            <option value="public">Public</option>
          </select>
        </label>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button onClick={() => vm.finishWorkout({ shareVisibility })} disabled={!vm.canFinish || vm.status === "saving"} style={primaryButtonStyle}>
            {vm.status === "saving" ? "Saving..." : "Finish Workout"}
          </button>
          <button onClick={vm.discardWorkout} style={secondaryButtonStyle}>Discard</button>
        </div>
        {!vm.canFinish ? (
          <p style={{ color: "rgba(255,255,255,0.52)", fontSize: 11, margin: "10px 0 0" }}>Complete all sets before finishing.</p>
        ) : null}
      </div>
    </div>
  );
}

function FinishedState({ vm }) {
  const summary = vm.finishResult?.summary || {};
  return (
    <div style={{
      background: "rgba(52,211,153,0.10)",
      border: "1px solid rgba(52,211,153,0.24)",
      borderRadius: 18,
      padding: 16,
    }}>
      <p style={eyebrowStyle}>WORKOUT SAVED</p>
      <h4 style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>Auto-logged to TribeLog</h4>
      <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 13, lineHeight: 1.45, margin: "0 0 14px" }}>
        {summary.exerciseCount || 0} exercises · {summary.completedSets || 0} sets · {Math.round(summary.totalVolumeKg || 0)} kg volume.
      </p>
      <button onClick={vm.load} style={primaryButtonStyle}>Start another</button>
    </div>
  );
}

function PendingSyncState({ vm }) {
  return (
    <div style={{
      background: "rgba(255,107,53,0.10)",
      border: "1px solid rgba(255,107,53,0.26)",
      borderRadius: 18,
      padding: 16,
    }}>
      <p style={eyebrowStyle}>SAVED LOCALLY</p>
      <h4 style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 21, fontWeight: 900, margin: "0 0 8px" }}>Workout needs sync</h4>
      <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 13, lineHeight: 1.45, margin: "0 0 14px" }}>
        {vm.errorMessage || "Network save failed. Retry when connection is available."}
      </p>
      <button onClick={vm.retryPendingFinish} style={primaryButtonStyle}>Retry sync</button>
    </div>
  );
}

export default function GuidedWorkoutSection({ catalogUseCases, guidedUseCases }) {
  const { theme } = useAppTheme();
  const vm = useGuidedWorkoutViewModel({ catalogUseCases, guidedUseCases });
  const catalogPreview = useMemo(() => vm.catalog.slice(0, 8), [vm.catalog]);

  return (
    <section style={{
      background: "#040404",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 18,
      marginBottom: 24,
      overflow: "hidden",
    }}>
      <div style={{
        background: "linear-gradient(135deg, rgba(255,107,53,0.32), rgba(255,255,255,0.04))",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: 18,
      }}>
        <p style={{ color: "#FFB199", fontFamily: "monospace", fontSize: 10, fontWeight: 900, letterSpacing: 1.6, margin: "0 0 8px" }}>GUIDED WORKOUT</p>
        <h3 style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 25, fontWeight: 900, margin: "0 0 8px" }}>Start a session</h3>
        <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 13, lineHeight: 1.45, margin: 0 }}>
          Pick exercises, track sets, rest between efforts, and finish once. TribeLog handles the activity log.
        </p>
      </div>

      <div style={{ padding: 16 }}>
        {vm.status === "loading" ? (
          <p style={{ color: theme.textSoft, fontSize: 13, margin: 0 }}>Loading workout builder...</p>
        ) : null}

        {vm.status === "failed" ? (
          <div style={{ color: "#FF8A65", fontSize: 13 }}>{vm.errorMessage}</div>
        ) : null}

        {vm.status === "selecting" ? (
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gap: 10 }}>
              {catalogPreview.map(exercise => (
                <PickerCard
                  key={exercise.id}
                  exercise={exercise}
                  selected={vm.selectedExerciseIds.includes(exercise.id)}
                  onToggle={() => vm.toggleExercise(exercise.id)}
                />
              ))}
            </div>
            {catalogPreview.length === 0 ? (
              <p style={{ color: theme.textSoft, fontSize: 13, margin: 0 }}>Seed exercises before starting a guided session.</p>
            ) : null}
            <button disabled={!vm.canStart} onClick={vm.startWorkout} style={vm.canStart ? primaryButtonStyle : disabledButtonStyle}>
              Start workout
            </button>
          </div>
        ) : null}

        {vm.status === "active" || vm.status === "saving" ? <ActiveWorkout vm={vm} /> : null}
        {vm.status === "finished" ? <FinishedState vm={vm} /> : null}
        {vm.status === "pending_sync" ? <PendingSyncState vm={vm} /> : null}
      </div>
    </section>
  );
}

const eyebrowStyle = {
  color: "rgba(255,255,255,0.52)",
  fontFamily: "monospace",
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: 1.2,
  margin: "0 0 10px",
};

const fieldLabelStyle = {
  color: "rgba(255,255,255,0.58)",
  display: "flex",
  flexDirection: "column",
  fontFamily: "monospace",
  fontSize: 10,
  fontWeight: 900,
  gap: 7,
  letterSpacing: 1,
};

const inputStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 12,
  color: "#FFFFFF",
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 15,
  fontWeight: 800,
  minHeight: 44,
  padding: "0 12px",
  width: "100%",
};

const primaryButtonStyle = {
  background: "linear-gradient(135deg, #FF6B35, #FFD700)",
  border: "none",
  borderRadius: 12,
  color: "#040404",
  cursor: "pointer",
  fontFamily: "'Syne', sans-serif",
  fontSize: 13,
  fontWeight: 900,
  minHeight: 42,
  padding: "0 16px",
};

const secondaryButtonStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 12,
  color: "#FFFFFF",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 800,
  minHeight: 42,
  padding: "0 16px",
};

const disabledButtonStyle = {
  ...primaryButtonStyle,
  cursor: "not-allowed",
  filter: "grayscale(1)",
  opacity: 0.46,
};
