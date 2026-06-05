function clampPercent(value) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function safeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

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
  const activeTarget = Math.min(7, Math.max(1, safeNumber(goals.weeklyActiveDaysTarget, 5)));
  const pointsTarget = Math.min(10000, Math.max(50, safeNumber(goals.weeklyPointsTarget, 250)));
  const streakTarget = Math.min(365, Math.max(1, safeNumber(goals.streakTarget, 30)));
  const streak = safeNumber(currentStreak);

  const activePct = clampPercent((activeDays / activeTarget) * 100);
  const pointsPct = clampPercent((weeklyPoints / pointsTarget) * 100);
  const streakPct = clampPercent((streak / streakTarget) * 100);
  const weeklyScore = clampPercent((activePct + pointsPct + streakPct) / 3);
  const consistency = clampPercent((activeDays / 7) * 100);

  const remainingActiveDays = Math.max(0, activeTarget - activeDays);
  const remainingPoints = Math.max(0, pointsTarget - weeklyPoints);
  const remainingStreakDays = Math.max(0, streakTarget - streak);
  const status = weeklyScore >= 80 ? 'ON TRACK' : weeklyScore >= 50 ? 'BUILDING' : 'RESTART';
  const nextAction = remainingActiveDays > 0
    ? `Log ${remainingActiveDays} more active day${remainingActiveDays === 1 ? '' : 's'} to hit your weekly goal.`
    : remainingPoints > 0
      ? `Add ${remainingPoints} more point${remainingPoints === 1 ? '' : 's'} to finish the week strong.`
      : remainingStreakDays > 0
        ? `Protect the streak for ${remainingStreakDays} more day${remainingStreakDays === 1 ? '' : 's'} toward your focus goal.`
        : 'Goals hit. Share your weekly recap and invite someone into the next challenge.';

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
  const weeklyActiveTarget = Math.min(7, Math.max(1, safeNumber(goals.weeklyActiveDaysTarget, 5)));
  const weeklyPointsTarget = Math.min(10000, Math.max(50, safeNumber(goals.weeklyPointsTarget, 250)));
  const activeTarget = Math.min(30, weeklyActiveTarget * 4);
  const pointsTarget = weeklyPointsTarget * 4;
  const streakTarget = Math.min(365, Math.max(1, safeNumber(goals.streakTarget, 30)));
  const streak = safeNumber(currentStreak);

  const activePct = clampPercent((activeDays / activeTarget) * 100);
  const pointsPct = clampPercent((monthlyPoints / pointsTarget) * 100);
  const streakPct = clampPercent((streak / streakTarget) * 100);
  const monthlyScore = clampPercent((activePct + pointsPct + streakPct) / 3);
  const consistency = clampPercent((activeDays / 30) * 100);

  const remainingActiveDays = Math.max(0, activeTarget - activeDays);
  const remainingPoints = Math.max(0, pointsTarget - monthlyPoints);
  const remainingStreakDays = Math.max(0, streakTarget - streak);
  const status = monthlyScore >= 80 ? 'ON TRACK' : monthlyScore >= 50 ? 'BUILDING' : 'RESTART';
  const nextAction = remainingActiveDays > 0
    ? `Log ${remainingActiveDays} more active day${remainingActiveDays === 1 ? '' : 's'} to close the month strong.`
    : remainingPoints > 0
      ? `Add ${remainingPoints} more point${remainingPoints === 1 ? '' : 's'} to hit your monthly pace.`
      : remainingStreakDays > 0
        ? `Protect the streak for ${remainingStreakDays} more day${remainingStreakDays === 1 ? '' : 's'} toward your focus goal.`
        : 'Monthly goals hit. Turn this into a post and invite someone into the tribe.';

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
