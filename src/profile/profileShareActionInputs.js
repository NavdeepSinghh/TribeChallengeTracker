export function buildProfileShareActionInputs({
  stats,
  screenState,
  user,
}) {
  const {
    instagramHandle,
    profile,
    setWinCardMessage,
  } = screenState;

  return {
    currentStreak: stats.currentStreak,
    daysActive: stats.daysActive,
    instagramHandle,
    monthlyReport: stats.monthlyReport,
    profile,
    rank: stats.rank,
    setWinCardMessage,
    totalWinPoints: stats.totalWinPoints,
    user,
    weeklyRecap: stats.weeklyRecap,
  };
}
