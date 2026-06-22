import { useEffect, useState } from "react";
import { deleteActivity, getActivityLog, saveActivity } from "../userService";
import { ACTIVITY_TYPES, formatDate, getEntryActivities, today } from "./activityModel";

export default function useActivityHistory({
  challengeStats,
  showToast,
  triggerBadgeCheck,
  user,
}) {
  const [myHistory, setMyHistory] = useState({});

  useEffect(() => {
    if (!user) {
      setMyHistory({});
      return;
    }
    getActivityLog(user.uid).then(log => setMyHistory(log));
  }, [user]);

  const handleLog = (entry) => {
    const key = formatDate(today);
    const existingActivities = getEntryActivities(myHistory[key]);
    const normalizedEntry = {
      ...entry,
      id: entry.id || `${key}_${Date.now()}`,
      activityId: entry.activityId || entry.type,
      loggedAt: entry.loggedAt || key,
    };
    const activities = [...existingActivities, normalizedEntry];
    const dayEntry = {
      activities,
      points: activities.reduce((s, a) => s + (a.points || 0), 0),
      totalPoints: activities.reduce((s, a) => s + (a.points || 0), 0),
      date: key,
    };
    const updated = { ...myHistory, [key]: dayEntry };
    setMyHistory(updated);
    saveActivity(user.uid, key, dayEntry).catch(console.error);
    showToast(`${ACTIVITY_TYPES.find(a => a.id === normalizedEntry.type)?.icon} +${normalizedEntry.points} pts logged!`);
    triggerBadgeCheck(updated, challengeStats);
  };

  const handleDeleteActivity = async (dateStr, activity, activityIndex) => {
    const existingActivities = getEntryActivities(myHistory[dateStr]);
    const activities = existingActivities.filter((candidate, index) => {
      if (activity?.id) return candidate.id !== activity.id;
      return index !== activityIndex;
    });
    const totalPoints = activities.reduce((s, a) => s + (a.points || 0), 0);
    const dayEntry = {
      activities,
      points: totalPoints,
      totalPoints,
      date: dateStr,
    };
    const updated = { ...myHistory, [dateStr]: dayEntry };
    setMyHistory(updated);
    await deleteActivity(user.uid, dateStr, activity?.id, activityIndex);
    showToast("Activity deleted");
    triggerBadgeCheck(updated, challengeStats);
    return dayEntry;
  };

  return {
    handleDeleteActivity,
    handleLog,
    myHistory,
    setMyHistory,
  };
}
