export function buildProfileScreenStatsResult({
  badgeXP,
  rank,
  activityStats,
  reportData,
  rankedPct,
  statsGrid,
  prefRows,
  earnedList,
  goalProgress,
}) {
  const {
    activityPoints,
    allActivities,
    currentStreak,
    daysActive,
    monthlyRecap,
    onboarding,
    totalChallengePoints,
    totalWinPoints,
    weeklyRecap,
  } = activityStats;
  const {
    healthSyncInsight,
    longHistoryReport,
    monthlyReport,
    proAnalytics,
    weeklyReport,
  } = reportData;

  return {
    badgeXP,
    rank,
    daysActive,
    onboarding,
    totalChallengePoints,
    activityPoints,
    totalWinPoints,
    allActivities,
    weeklyRecap,
    monthlyRecap,
    proAnalytics,
    currentStreak,
    healthSyncInsight,
    longHistoryReport,
    weeklyReport,
    monthlyReport,
    rankedPct,
    statsGrid,
    prefRows,
    earnedList,
    goalProgress,
  };
}
