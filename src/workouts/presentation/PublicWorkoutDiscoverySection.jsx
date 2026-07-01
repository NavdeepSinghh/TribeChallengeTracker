import { useAppTheme } from "../../app/AppThemeContext";
import { publicWorkoutSummary } from "../domain/workoutSocialModels";
import { useWorkoutSocialViewModel } from "./useWorkoutSocialViewModel";

function formatVolume(value = 0) {
  return `${Math.round(Number(value || 0)).toLocaleString()} kg`;
}

function CreatorAvatar({ workout }) {
  return (
    <div style={{
      alignItems: "center",
      background: workout.ownerAvatarColor || "#FF6B35",
      borderRadius: 14,
      color: "#040404",
      display: "grid",
      flex: "0 0 38px",
      fontSize: 20,
      fontWeight: 900,
      height: 38,
      justifyItems: "center",
      width: 38,
    }}>
      {workout.ownerAvatarEmoji || "💪"}
    </div>
  );
}

function PublicWorkoutCard({ copiedTemplateId, isCopying, isFollowingUpdating, onCopy, onToggleFollow, workout }) {
  const copied = Boolean(copiedTemplateId);
  const followLabel = workout.followStatus === "following" ? "Following" : "Follow";
  return (
    <article style={{
      background: "rgba(255,255,255,0.045)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      padding: 14,
    }}>
      <div style={{ alignItems: "start", display: "flex", gap: 11 }}>
        <CreatorAvatar workout={workout} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 900, margin: "0 0 4px" }}>{workout.name}</p>
          <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 11, fontWeight: 700, margin: 0 }}>
            By {workout.ownerDisplayName} · {publicWorkoutSummary(workout)}
          </p>
        </div>
        <span style={{
          border: "1px solid rgba(255,107,53,0.42)",
          borderRadius: 999,
          color: "#FF6B35",
          fontFamily: "monospace",
          fontSize: 9,
          fontWeight: 900,
          padding: "4px 7px",
        }}>
          PUBLIC
        </span>
      </div>

      <div style={{ display: "grid", gap: 7, marginTop: 12 }}>
        {workout.exercises.slice(0, 3).map(exercise => (
          <div key={exercise.exerciseId} style={{
            alignItems: "center",
            background: "rgba(4,4,4,0.28)",
            borderRadius: 12,
            display: "flex",
            justifyContent: "space-between",
            padding: "9px 10px",
          }}>
            <span style={{ color: "#FFFFFF", fontSize: 12, fontWeight: 800 }}>{exercise.name}</span>
            <span style={{ color: "rgba(255,255,255,0.52)", fontFamily: "monospace", fontSize: 10, fontWeight: 900 }}>{exercise.repSummary || `${exercise.setCount} sets`}</span>
          </div>
        ))}
      </div>

      <div style={{ alignItems: "center", display: "flex", gap: 8, justifyContent: "space-between", marginTop: 12 }}>
        <span style={{ color: "#FFD700", fontFamily: "monospace", fontSize: 11, fontWeight: 900 }}>
          {formatVolume(workout.totalVolumeKg)} · {workout.copiedCount || 0} copies
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            disabled={workout.followStatus === "self" || workout.followStatus === "unavailable" || isFollowingUpdating}
            onClick={onToggleFollow}
            style={secondaryButtonStyle}
          >
            {isFollowingUpdating ? "..." : followLabel}
          </button>
          <button disabled={isCopying || copied} onClick={onCopy} style={primaryButtonStyle}>
            {copied ? "Copied" : isCopying ? "Copying..." : "Copy"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function PublicWorkoutDiscoverySection({ useCases }) {
  const { theme } = useAppTheme();
  const vm = useWorkoutSocialViewModel({ useCases });

  return (
    <section style={{
      background: "#040404",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 18,
      marginBottom: 24,
      overflow: "hidden",
    }}>
      <div style={{ padding: 18 }}>
        <p style={eyebrowStyle}>PUBLIC WORKOUTS</p>
        <h3 style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 900, margin: "0 0 8px" }}>Copy what the tribe is doing.</h3>
        <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 13, lineHeight: 1.45, margin: 0 }}>
          Discover public guided sessions, follow the creator, and save a private draft with attribution preserved.
        </p>
      </div>

      <div style={{ display: "grid", gap: 12, padding: "0 16px 16px" }}>
        {vm.errorMessage ? (
          <div style={panelStyle("rgba(255,107,53,0.10)", "rgba(255,107,53,0.24)")}>
            <p style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 800, margin: "0 0 10px" }}>{vm.errorMessage}</p>
            {vm.status === "failed" ? <button onClick={vm.load} style={primaryButtonStyle}>Retry</button> : null}
          </div>
        ) : null}

        {vm.status === "loading" ? (
          <p style={{ color: theme.textSoft, fontSize: 13, margin: 0 }}>Loading public workouts...</p>
        ) : null}

        {vm.status === "empty" ? (
          <div style={panelStyle("rgba(255,255,255,0.04)", "rgba(255,255,255,0.08)")}>
            <p style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 900, margin: "0 0 6px" }}>No public workouts yet</p>
            <p style={{ color: "rgba(255,255,255,0.64)", fontSize: 13, margin: 0 }}>When tribe members share guided sessions publicly, they will appear here.</p>
          </div>
        ) : null}

        {vm.status === "loaded" ? vm.workouts.map(workout => (
          <PublicWorkoutCard
            copiedTemplateId={vm.copiedTemplateIds[workout.publicWorkoutId]}
            isCopying={vm.copyingId === workout.publicWorkoutId}
            isFollowingUpdating={vm.followUpdatingUid === workout.ownerUid}
            key={workout.publicWorkoutId}
            onCopy={() => vm.copyWorkout(workout)}
            onToggleFollow={() => vm.toggleFollow(workout)}
            workout={workout}
          />
        )) : null}
      </div>
    </section>
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
  color: "rgba(255,255,255,0.52)",
  fontFamily: "monospace",
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: 1.2,
  margin: "0 0 10px",
};

const primaryButtonStyle = {
  background: "linear-gradient(135deg, #FF6B35, #FFD700)",
  border: "none",
  borderRadius: 12,
  color: "#040404",
  cursor: "pointer",
  fontFamily: "'Syne', sans-serif",
  fontSize: 12,
  fontWeight: 900,
  minHeight: 36,
  padding: "0 13px",
};

const secondaryButtonStyle = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 12,
  color: "#FFFFFF",
  cursor: "pointer",
  fontFamily: "'Syne', sans-serif",
  fontSize: 12,
  fontWeight: 900,
  minHeight: 36,
  padding: "0 13px",
};
