export function clampPercent(value) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function safeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function boundedTarget(value, {
  fallback,
  max,
  min,
}) {
  return Math.min(max, Math.max(min, safeNumber(value, fallback)));
}

export function buildReportProgressMetrics({
  activeDays,
  activeTarget,
  points,
  pointsTarget,
  streak,
  streakTarget,
  consistencyWindow,
}) {
  const activePct = clampPercent((activeDays / activeTarget) * 100);
  const pointsPct = clampPercent((points / pointsTarget) * 100);
  const streakPct = clampPercent((streak / streakTarget) * 100);

  return {
    activePct,
    pointsPct,
    streakPct,
    score: clampPercent((activePct + pointsPct + streakPct) / 3),
    consistency: clampPercent((activeDays / consistencyWindow) * 100),
  };
}

export function reportStatus(score) {
  return score >= 80 ? 'ON TRACK' : score >= 50 ? 'BUILDING' : 'RESTART';
}

export function buildReportNextAction({
  completeAction,
  pointAction,
  activeAction,
  remainingActiveDays,
  remainingPoints,
  remainingStreakDays,
  streakAction,
}) {
  if (remainingActiveDays > 0) {
    return activeAction(remainingActiveDays);
  }
  if (remainingPoints > 0) {
    return pointAction(remainingPoints);
  }
  if (remainingStreakDays > 0) {
    return streakAction(remainingStreakDays);
  }
  return completeAction;
}
