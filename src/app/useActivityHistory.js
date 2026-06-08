import { useEffect, useState } from "react";
import { getActivityLog, saveActivity } from "../userService";
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
    const activities = [...existingActivities, entry];
    const dayEntry = {
      activities,
      points: activities.reduce((s, a) => s + (a.points || 0), 0),
    };
    const updated = { ...myHistory, [key]: dayEntry };
    setMyHistory(updated);
    saveActivity(user.uid, key, dayEntry).catch(console.error);
    showToast(`${ACTIVITY_TYPES.find(a => a.id === entry.type)?.icon} +${entry.points} pts logged!`);
    triggerBadgeCheck(updated, challengeStats);
  };

  return {
    handleLog,
    myHistory,
    setMyHistory,
  };
}
