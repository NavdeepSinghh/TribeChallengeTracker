import { useEffect, useState } from "react";
import { deleteActivity, getActivityLog, saveActivity } from "../userService";
import { writeTribeFeedEntry } from "../userServices/tribeFeedService";
import { calculateRankScore, getTribeStatus, normalizeRankRules } from "../rankRules";
import { ACTIVITY_TYPES, formatDate, getEntryActivities, getStreak, today } from "./activityModel";

const rankMetricsForHistory = (history, rankRules, userProfile) => {
  const normalizedRules = normalizeRankRules(rankRules);
  const daysActive = Object.keys(history || {}).filter(d => getEntryActivities(history[d]).length > 0).length;
  const streak = getStreak(history);
  const rankScore = calculateRankScore(history, normalizedRules.dailyRankPointCap);
  const completedChallenges = userProfile?.stats?.challengesCompleted || 0;
  const { rank } = getTribeStatus({ score: rankScore, activeDays: daysActive, streak, completedChallenges }, normalizedRules);
  return { daysActive, rank, rankScore, streak };
};

const rankIndex = (rank, rankRules) => normalizeRankRules(rankRules)
  .levels
  .findIndex(level => level.id === rank?.id);

export default function useActivityHistory({
  challengeStats,
  onLevelUp,
  rankRules,
  showToast,
  triggerBadgeCheck,
  user,
  userProfile,
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
    const previousRankMetrics = rankMetricsForHistory(myHistory, rankRules, userProfile);
    const updated = { ...myHistory, [key]: dayEntry };
    const nextRankMetrics = rankMetricsForHistory(updated, rankRules, userProfile);
    setMyHistory(updated);
    saveActivity(user.uid, key, dayEntry).catch(console.error);
    const activityType = ACTIVITY_TYPES.find(a => a.id === normalizedEntry.activityId);
    if (activityType) {
      writeTribeFeedEntry({
        uid: user.uid,
        displayName: userProfile?.displayName || user.displayName || "Tribe member",
        avatarEmoji: userProfile?.avatarEmoji || "💪",
        avatarColor: userProfile?.avatarColor || "#FF6B35",
        instagramHandle: userProfile?.instagramHandle || null,
        activityType: activityType.id,
        activityLabel: activityType.label,
        activityEmoji: activityType.icon,
        value: normalizedEntry.value,
        unit: activityType.unit,
        points: normalizedEntry.points,
        currentStreak: getStreak(updated),
        activityLogId: normalizedEntry.id,
        activityDate: normalizedEntry.loggedAt,
      });
    }
    if (rankIndex(nextRankMetrics.rank, rankRules) > rankIndex(previousRankMetrics.rank, rankRules)) {
      onLevelUp?.({
        ...nextRankMetrics,
        previousRank: previousRankMetrics.rank,
      });
    }
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
