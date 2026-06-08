export function hasHistoryActivity(entry) {
  return entry?.activities ? entry.activities.length > 0 : !!entry?.type;
}

export function countActiveDays(history) {
  return Object.values(history).filter(hasHistoryActivity).length;
}

export function sumActivityPoints(history) {
  return Object.values(history).reduce((sum, entry) => sum + (entry?.totalPoints || 0), 0);
}

export function flattenHistoryActivities(history) {
  return Object.values(history).flatMap(entry => entry?.activities || (entry?.type ? [entry] : []));
}

export function buildRecentRecap(history, days) {
  const keys = new Set();
  for (let i = 0; i < days; i += 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    keys.add(d.toISOString().split('T')[0]);
  }
  const entries = Object.entries(history).filter(([date]) => keys.has(date));
  const sessions = entries.reduce((sum, [, entry]) => sum + (entry?.activities?.length || (entry?.type ? 1 : 0)), 0);
  const points = entries.reduce((sum, [, entry]) => sum + (entry?.totalPoints || entry?.points || 0), 0);
  const activeDays = entries.filter(([, entry]) => hasHistoryActivity(entry)).length;
  return { activeDays, sessions, points };
}

export function calculateCurrentStreak(history) {
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = d.toISOString().split('T')[0];
    const entry = history[key];
    if (!hasHistoryActivity(entry)) break;
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function summarizeProAnalytics({ activities, daysActive, totalWinPoints, weeklyRecap, separator = ' - ' }) {
  const counts = activities.reduce((acc, activity) => {
    const key = activity.activityId || activity.type || 'activity';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const bestType = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const avgPoints = daysActive ? Math.round(totalWinPoints / daysActive) : 0;
  const consistency = Math.round((weeklyRecap.activeDays / 7) * 100);
  const report = weeklyRecap.activeDays >= 5
    ? 'Strong consistency week. Keep the streak protected.'
    : weeklyRecap.activeDays >= 3
      ? 'Solid base. Aim for five active days next week.'
      : 'Rebuild momentum with two simple logs this week.';
  return {
    consistency,
    avgPoints,
    bestType: bestType ? `${String(bestType[0]).replace(/_/g, ' ').toUpperCase()}${separator}${bestType[1]} session${bestType[1] === 1 ? '' : 's'}` : 'No activity yet',
    report,
  };
}
