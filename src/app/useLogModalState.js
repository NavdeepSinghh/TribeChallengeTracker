import { useRef, useState } from "react";
import { healthAvailable, requestHealthPerms, getTodayWorkouts } from "../healthService";
import { ACTIVITY_TYPES, getEntryActivities } from "./activityModel";

export default function useLogModalState({ onDeleteActivity, onLog, todayActivities }) {
  const [type, setType] = useState("run");
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  const [loggedActivities, setLoggedActivities] = useState(todayActivities);
  const [syncState, setSyncState] = useState("idle");
  const [syncWorkouts, setSyncWorkouts] = useState([]);
  const [syncError, setSyncError] = useState("");
  const [isSubmitLocked, setIsSubmitLocked] = useState(false);
  const submitLockRef = useRef(false);

  const actInfo = ACTIVITY_TYPES.find(a => a.id === type);

  const handle = () => {
    if (!value || submitLockRef.current) return;
    submitLockRef.current = true;
    setIsSubmitLocked(true);
    const dateStr = new Date().toISOString().split("T")[0];
    const id = globalThis.crypto?.randomUUID?.() || `${dateStr}_${Date.now()}`;
    const entry = {
      id,
      type,
      activityId: type,
      value: parseFloat(value),
      note,
      points: Math.floor(parseFloat(value) * 2 + 5),
      loggedAt: dateStr,
    };
    onLog(entry);
    setLoggedActivities(prev => [...prev, entry]);
    setValue("");
    setNote("");
    window.setTimeout(() => {
      submitLockRef.current = false;
      setIsSubmitLocked(false);
    }, 1600);
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

  const handleDeleteActivity = async (activity, index) => {
    if (!onDeleteActivity) return;
    const updatedDay = await onDeleteActivity(activity, index);
    if (updatedDay) {
      setLoggedActivities(getEntryActivities(updatedDay));
      return;
    }
    setLoggedActivities(prev => prev.filter((candidate, candidateIndex) => {
      if (activity?.id) return candidate.id !== activity.id;
      return candidateIndex !== index;
    }));
  };

  return {
    actInfo,
    applyWorkout,
    handle,
    handleDeleteActivity,
    handleSync,
    isSubmitLocked,
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
