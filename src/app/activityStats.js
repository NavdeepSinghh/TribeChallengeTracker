import { ACTIVITY_TYPES, today, formatDate, getEntryActivities, getStreak } from './activityModel';

export function buildActivityStats(history, challengeStats, userProfile) {
  const allActivities = Object.values(history).flatMap(entry => getEntryActivities(entry));
  const streakRecoveryCredits = allActivities.filter(a =>
    a.recoveredByPro || a.activityId === 'streak_recovery' || a.type === 'streak_recovery'
  ).length;
  const activeDates = Object.keys(history).filter(
    date => getEntryActivities(history[date]).length > 0
  );
  const activityCounts = ACTIVITY_TYPES.reduce((acc, activity) => {
    acc[activity.id] = allActivities.filter(item => item.type === activity.id).length;
    return acc;
  }, {});
  const runKm = allActivities.filter(item => item.type === 'run').reduce((sum, item) => sum + (item.value || 0), 0);
  const cycleKm = allActivities.filter(item => item.type === 'cycle').reduce((sum, item) => sum + (item.value || 0), 0);
  const walkKm = allActivities.filter(item => item.type === 'walk').reduce((sum, item) => sum + (item.value || 0), 0);
  const sortedDates = activeDates.sort();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  weekStart.setHours(0, 0, 0, 0);

  return {
    totalLogs: allActivities.length,
    streak: getStreak(history),
    totalPts: allActivities.reduce((sum, activity) => sum + (activity.points || 0), 0),
    daysActive: activeDates.length,
    runKm,
    cycleKm,
    walkKm,
    actCounts: activityCounts,
    uniqueTypes: Object.values(activityCounts).filter(value => value > 0).length,
    challengesJoined: challengeStats.joined,
    challengesOwned: challengeStats.owned,
    referralJoins: userProfile?.stats?.referralJoins || 0,
    challengesCompleted: challengeStats.completed || 0,
    top1Finishes: challengeStats.top1 || 0,
    weekendWarrior: sortedDates.some(date => {
      const day = new Date(date);
      if (day.getDay() !== 6) return false;
      const sunday = new Date(day);
      sunday.setDate(day.getDate() + 1);
      return getEntryActivities(history[formatDate(sunday)]).length > 0;
    }),
    comeback: sortedDates.some((date, index) => index > 0 &&
      (new Date(date) - new Date(sortedDates[index - 1])) / 86400000 >= 3
    ),
    weeklyLogs: sortedDates.filter(date => new Date(date) >= weekStart).length,
    proActive: userProfile?.entitlements?.pro?.active === true,
    streakRecoveryCredits,
    isOG: true,
  };
}
