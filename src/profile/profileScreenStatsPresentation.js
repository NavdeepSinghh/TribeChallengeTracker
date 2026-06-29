import {
  buildGoalProgress,
  buildPreferenceRows,
  buildStatsGrid,
} from './profileDerivedState';
import {
  ACCENT,
  DATA_SOURCE_LABELS,
  FREQ_LABELS,
  GOLD,
  GOAL_LABELS,
  HEALTH_SYNC_LABELS,
  LEVEL_LABELS,
  MOTIVATION_LABELS,
} from './profileConstants';

export function buildProfileScreenStatsPresentation({
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
}) {
  const {
    currentStreak,
    daysActive,
    onboarding,
    totalChallengePoints,
    weeklyRecap,
  } = activityStats;
  const statsGrid = buildStatsGrid({
    profile,
    challengeStats,
    referralJoins,
    earnedBadges,
    badgeXP,
    rank,
    totalChallengePoints,
    daysActive,
    accent: ACCENT,
    gold: GOLD,
    onChallengePointsClick,
  });
  const prefRows = buildPreferenceRows({
    onboarding,
    goalLabels: GOAL_LABELS,
    levelLabels: LEVEL_LABELS,
    frequencyLabels: FREQ_LABELS,
    motivationLabels: MOTIVATION_LABELS,
    dataSourceLabels: DATA_SOURCE_LABELS,
    healthSyncLabels: HEALTH_SYNC_LABELS,
  });
  const goalProgress = buildGoalProgress({
    weeklyRecap,
    goalActiveDays,
    goalPoints,
    goalStreak,
    currentStreak,
  });

  return {
    goalProgress,
    prefRows,
    statsGrid,
  };
}
