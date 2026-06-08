import {
  boundedTarget,
  buildReportNextAction,
  buildReportProgressMetrics,
  reportStatus,
  safeNumber,
} from './weeklyReportMetrics';

export function buildMonthlyReport({
  monthlyRecap = {},
  goals = {},
  currentStreak = 0,
  totalChallengePoints = 0,
  bestType = 'No activity yet',
} = {}) {
  const activeDays = safeNumber(monthlyRecap.activeDays);
  const sessions = safeNumber(monthlyRecap.sessions);
  const monthlyPoints = safeNumber(monthlyRecap.points);
  const weeklyActiveTarget = boundedTarget(goals.weeklyActiveDaysTarget, { fallback: 5, min: 1, max: 7 });
  const weeklyPointsTarget = boundedTarget(goals.weeklyPointsTarget, { fallback: 250, min: 50, max: 10000 });
  const activeTarget = Math.min(30, weeklyActiveTarget * 4);
  const pointsTarget = weeklyPointsTarget * 4;
  const streakTarget = boundedTarget(goals.streakTarget, { fallback: 30, min: 1, max: 365 });
  const streak = safeNumber(currentStreak);

  const {
    activePct,
    consistency,
    pointsPct,
    score: monthlyScore,
    streakPct,
  } = buildReportProgressMetrics({
    activeDays,
    activeTarget,
    points: monthlyPoints,
    pointsTarget,
    streak,
    streakTarget,
    consistencyWindow: 30,
  });

  const remainingActiveDays = Math.max(0, activeTarget - activeDays);
  const remainingPoints = Math.max(0, pointsTarget - monthlyPoints);
  const remainingStreakDays = Math.max(0, streakTarget - streak);
  const status = reportStatus(monthlyScore);
  const nextAction = buildReportNextAction({
    activeAction: (days) => `Log ${days} more active day${days === 1 ? '' : 's'} to close the month strong.`,
    pointAction: (points) => `Add ${points} more point${points === 1 ? '' : 's'} to hit your monthly pace.`,
    streakAction: (days) => `Protect the streak for ${days} more day${days === 1 ? '' : 's'} toward your focus goal.`,
    completeAction: 'Monthly goals hit. Turn this into a post and invite someone into the tribe.',
    remainingActiveDays,
    remainingPoints,
    remainingStreakDays,
  });

  return {
    activeDays,
    sessions,
    monthlyPoints,
    totalChallengePoints: safeNumber(totalChallengePoints),
    consistency,
    activePct,
    pointsPct,
    streakPct,
    monthlyScore,
    status,
    nextAction,
    bestType,
  };
}
