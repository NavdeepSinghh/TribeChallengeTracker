import {
  buildRecentRecap,
  calculateCurrentStreak,
  countActiveDays,
  flattenHistoryActivities,
  sumActivityPoints,
} from './profileStats';

export function buildProfileActivityStats({
  profile,
  myHistory,
  challengePoints,
  goalActiveDays,
  goalPoints,
  goalStreak,
}) {
  const daysActive = countActiveDays(myHistory);
  const onboarding = profile?.onboarding;
  const totalChallengePoints = challengePoints.reduce((sum, challenge) => (
    sum + (challenge.totalPoints || 0)
  ), 0);
  const activityPoints = sumActivityPoints(myHistory);
  const totalWinPoints = activityPoints + totalChallengePoints;
  const allActivities = flattenHistoryActivities(myHistory);
  const weeklyRecap = buildRecentRecap(myHistory, 7);
  const monthlyRecap = buildRecentRecap(myHistory, 30);
  const currentStreak = calculateCurrentStreak(myHistory);
  const goals = {
    weeklyActiveDaysTarget: goalActiveDays,
    weeklyPointsTarget: goalPoints,
    streakTarget: goalStreak,
  };

  return {
    daysActive,
    onboarding,
    totalChallengePoints,
    activityPoints,
    totalWinPoints,
    allActivities,
    weeklyRecap,
    monthlyRecap,
    currentStreak,
    goals,
  };
}
