import {
  buildGoalProgress,
  buildPreferenceRows,
  buildStatsGrid,
} from './profileDerivedState';
import {
  ACCENT,
  GOLD,
  GOAL_LABELS,
  LEVEL_LABELS,
  FREQ_LABELS,
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
