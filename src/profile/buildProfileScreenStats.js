import { buildProfileActivityStats } from './profileScreenActivityStats';
import { buildProfileScreenBadgeData } from './profileScreenBadgeData';
import { buildProfileReportData } from './profileReportData';
import { buildProfileScreenStatsResult } from './profileScreenStatsResult';
import { buildProfileScreenStatsPresentation } from './profileScreenStatsPresentation';
import { calculateRankScore, getTribeStatus } from '../rankRules';

export function buildProfileScreenStats({
  profile,
  myHistory,
  challengeStats,
  referralJoins,
  earnedBadges,
  challengePoints,
  goalActiveDays,
  goalPoints,
  goalStreak,
  onChallengePointsClick,
  rankRules,
}) {
  const {
    badgeXP,
    earnedList,
    rank,
    rankedPct,
  } = buildProfileScreenBadgeData({ earnedBadges });
  const activityStats = buildProfileActivityStats({
    profile,
    myHistory,
    challengePoints,
    goalActiveDays,
    goalPoints,
    goalStreak,
  });
  const {
    allActivities,
    currentStreak,
    daysActive,
    goals,
    monthlyRecap,
    onboarding,
    totalChallengePoints,
    totalWinPoints,
    weeklyRecap,
  } = activityStats;
  const statusRank = getTribeStatus({
    score: calculateRankScore(myHistory, rankRules?.dailyRankPointCap),
    activeDays: daysActive,
    streak: currentStreak,
    completedChallenges: profile?.stats?.challengesCompleted || 0,
  }, rankRules).rank;
  const reportData = buildProfileReportData({
    allActivities,
    currentStreak,
    daysActive,
    goals,
    monthlyRecap,
    myHistory,
    totalChallengePoints,
    totalWinPoints,
    weeklyRecap,
  });
  const {
    goalProgress,
    prefRows,
    statsGrid,
  } = buildProfileScreenStatsPresentation({
    activityStats,
    badgeXP,
    challengeStats,
    earnedBadges,
    goalActiveDays,
    goalPoints,
    goalStreak,
    onChallengePointsClick,
    profile,
    rank,
    referralJoins,
  });

  return buildProfileScreenStatsResult({
    badgeXP,
    rank,
    statusRank,
    activityStats,
    reportData,
    rankedPct,
    statsGrid,
    prefRows,
    earnedList,
    goalProgress,
  });
}
