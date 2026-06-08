import { useState } from "react";
import { healthAvailable, requestHealthPerms, getTodayWorkouts } from "../healthService";
import { ACTIVITY_TYPES } from "./activityModel";

export default function useLogModalState({ onLog, todayActivities }) {
  const [type, setType] = useState("run");
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  const [loggedActivities, setLoggedActivities] = useState(todayActivities);
  const [syncState, setSyncState] = useState("idle");
  const [syncWorkouts, setSyncWorkouts] = useState([]);
  const [syncError, setSyncError] = useState("");

  const actInfo = ACTIVITY_TYPES.find(a => a.id === type);

  const handle = () => {
    if (!value) return;
    const entry = { type, value: parseFloat(value), note, points: Math.floor(parseFloat(value) * 2 + 5) };
    onLog(entry);
    setLoggedActivities(prev => [...prev, entry]);
    setValue("");
    setNote("");
  };

  const handleSync = async () => {
    setSyncState("loading");
    try {
      const available = await healthAvailable();
      if (!available) { setSyncState("unavailable"); return; }
      await requestHealthPerms();
      const workouts = await getTodayWorkouts();
      if (!workouts.length) {
        setSyncError("No workouts found for today. Finish a workout on your watch, then try again.");
        setSyncState("error");
        return;
      }
      setSyncWorkouts(workouts);
      setSyncState("picking");
    } catch (e) {
      setSyncError(e.message || "Could not read health data.");
      setSyncState("error");
    }
  };

  const applyWorkout = (w) => {
    setType(w.type);
    setValue(String(w.value));
    setNote(`Synced from ${w.source}${w.calories ? ` · ${w.calories} cal` : ""}`);
    setSyncState("idle");
  };

  return {
    actInfo,
    applyWorkout,
    handle,
    handleSync,
    loggedActivities,
    note,
    setNote,
    setSyncState,
    setType,
    setValue,
    syncError,
    syncState,
    syncWorkouts,
    type,
    value,
  };
}
