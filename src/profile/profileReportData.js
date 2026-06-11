import { buildMonthlyReport, buildWeeklyReport } from '../weeklyReport';
import { buildRecentRecap, summarizeProAnalytics } from './profileStats';

export function buildLongHistoryReport({ history = {} }) {
  const recap = buildRecentRecap(history, 90);
  const keys = new Set();
  for (let i = 0; i < 90; i += 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    keys.add(d.toISOString().split('T')[0]);
  }
  const activities = Object.entries(history)
    .filter(([date]) => keys.has(date))
    .flatMap(([, entry]) => entry?.activities || (entry?.type ? [entry] : []));
  const counts = activities.reduce((acc, activity) => {
    const key = activity.activityId || activity.type || 'activity';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const topType = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const activeRate = Math.round((recap.activeDays / 90) * 100);
  const status = activeRate >= 70 ? 'DEEP BASE' : activeRate >= 40 ? 'BUILDING BASE' : 'RESET WINDOW';
  const nextAction = activeRate >= 70
    ? 'Turn the 90-day base into a harder challenge or creator-hosted accountability loop.'
    : activeRate >= 40
      ? 'Use the last 90 days to pick one repeatable weekly pattern before adding paid structure.'
      : 'Restart with the free challenge loop and use the 90-day view to spot the simplest comeback window.';

  return {
    activeDays: recap.activeDays,
    activeRate,
    sessions: recap.sessions,
    points: recap.points,
    status,
    topType: topType ? String(topType[0]).replace(/_/g, ' ').toUpperCase() : 'No activity yet',
    topTypeSessions: topType ? topType[1] : 0,
    nextAction,
  };
}

export function buildProfileReportData({
  allActivities,
  currentStreak,
  daysActive,
  goals,
  monthlyRecap,
  myHistory,
  totalChallengePoints,
  totalWinPoints,
  weeklyRecap,
}) {
  const proAnalytics = summarizeProAnalytics({
    activities: allActivities,
    daysActive,
    totalWinPoints,
    weeklyRecap,
    separator: ' · ',
  });
  const weeklyReport = buildWeeklyReport({
    weeklyRecap,
    goals,
    currentStreak,
    totalChallengePoints,
    bestType: proAnalytics.bestType,
  });
  const monthlyReport = buildMonthlyReport({
    monthlyRecap,
    goals,
    currentStreak,
    totalChallengePoints,
    bestType: proAnalytics.bestType,
  });
  const longHistoryReport = buildLongHistoryReport({
    history: myHistory,
  });

  return {
    longHistoryReport,
    monthlyReport,
    proAnalytics,
    weeklyReport,
  };
}
