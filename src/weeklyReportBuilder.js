import {
  boundedTarget,
  buildReportNextAction,
  buildReportProgressMetrics,
  reportStatus,
  safeNumber,
} from './weeklyReportMetrics';

export function buildWeeklyReport({
  weeklyRecap = {},
  goals = {},
  currentStreak = 0,
  totalChallengePoints = 0,
  bestType = 'No activity yet',
} = {}) {
  const activeDays = safeNumber(weeklyRecap.activeDays);
  const sessions = safeNumber(weeklyRecap.sessions);
  const weeklyPoints = safeNumber(weeklyRecap.points);
  const activeTarget = boundedTarget(goals.weeklyActiveDaysTarget, { fallback: 5, min: 1, max: 7 });
  const pointsTarget = boundedTarget(goals.weeklyPointsTarget, { fallback: 250, min: 50, max: 10000 });
  const streakTarget = boundedTarget(goals.streakTarget, { fallback: 30, min: 1, max: 365 });
  const streak = safeNumber(currentStreak);

  const {
    activePct,
    consistency,
    pointsPct,
    score: weeklyScore,
    streakPct,
  } = buildReportProgressMetrics({
    activeDays,
    activeTarget,
    points: weeklyPoints,
    pointsTarget,
    streak,
    streakTarget,
    consistencyWindow: 7,
  });

  const remainingActiveDays = Math.max(0, activeTarget - activeDays);
  const remainingPoints = Math.max(0, pointsTarget - weeklyPoints);
  const remainingStreakDays = Math.max(0, streakTarget - streak);
  const status = reportStatus(weeklyScore);
  const nextAction = buildReportNextAction({
    activeAction: (days) => `Log ${days} more active day${days === 1 ? '' : 's'} to hit your weekly goal.`,
    pointAction: (points) => `Add ${points} more point${points === 1 ? '' : 's'} to finish the week strong.`,
    streakAction: (days) => `Protect the streak for ${days} more day${days === 1 ? '' : 's'} toward your focus goal.`,
    completeAction: 'Goals hit. Share your weekly recap and invite someone into the next challenge.',
    remainingActiveDays,
    remainingPoints,
    remainingStreakDays,
  });

  return {
    activeDays,
    sessions,
    weeklyPoints,
    totalChallengePoints: safeNumber(totalChallengePoints),
    consistency,
    activePct,
    pointsPct,
    streakPct,
    weeklyScore,
    status,
    nextAction,
    bestType,
  };
}
