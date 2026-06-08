import { isNative, isWeb } from "../platformService";
import WearableIdleSyncOptions from "./WearableIdleSyncOptions";
import WearableSyncError from "./WearableSyncError";
import WearableUnavailable from "./WearableUnavailable";
import WearableWebPromo from "./WearableWebPromo";
import WearableWorkoutPicker from "./WearableWorkoutPicker";

export default function WearableSyncPanel({
  applyWorkout,
  handleSync,
  openHealthSettings,
  setSyncState,
  syncError,
  syncState,
  syncWorkouts,
}) {
  return (
    <div style={{ marginBottom: 20, padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <p style={{ color: "#555", fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 10px" }}>SYNC FROM WEARABLE</p>

      {isWeb && <WearableWebPromo />}

      {isNative && syncState === "idle" && (
        <WearableIdleSyncOptions handleSync={handleSync} />
      )}

      {isNative && syncState === "loading" && (
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#888" }}>⏳  Fetching workouts…</p>
        </div>
      )}

      {isNative && syncState === "picking" && (
        <WearableWorkoutPicker applyWorkout={applyWorkout} setSyncState={setSyncState} syncWorkouts={syncWorkouts} />
      )}

      {isNative && syncState === "error" && (
        <WearableSyncError handleSync={handleSync} setSyncState={setSyncState} syncError={syncError} />
      )}

      {isNative && syncState === "unavailable" && (
        <WearableUnavailable openHealthSettings={openHealthSettings} setSyncState={setSyncState} />
      )}
    </div>
  );
}
