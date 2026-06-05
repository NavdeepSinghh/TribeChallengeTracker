const asNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const isChallengeEnded = (challenge, today = new Date()) => {
  const status = (challenge?.status || '').toLowerCase();
  if (status === 'completed' || status === 'ended') return true;
  const endDate = parseDate(challenge?.endDate);
  return !!endDate && endDate <= today;
};

const sortMembersForLeaderboard = (members) => [...members].sort((a, b) => {
  const pointDelta = asNumber(b.totalPoints) - asNumber(a.totalPoints);
  if (pointDelta !== 0) return pointDelta;
  const dayDelta = asNumber(b.daysCompleted) - asNumber(a.daysCompleted);
  if (dayDelta !== 0) return dayDelta;
  return asNumber(b.longestStreak) - asNumber(a.longestStreak);
});

export function deriveChallengeBadgeStats({
  uid,
  challenges = [],
  membersByChallenge = {},
  progressByChallenge = {},
  today = new Date(),
} = {}) {
  if (!uid) return { completed: 0, top1: 0 };

  return challenges.reduce((acc, challenge) => {
    const challengeId = challenge?.id;
    if (!challengeId) return acc;

    const targetDays = Math.max(1, asNumber(challenge.duration));
    const members = membersByChallenge[challengeId] || [];
    const progress = progressByChallenge[challengeId] || {};
    const me = members.find(member => member.uid === uid);
    if (!me) return acc;

    const completeLogDays = Object.values(progress).filter(log => !!log?.allComplete).length;
    const isComplete = asNumber(me.daysCompleted) >= targetDays || completeLogDays >= targetDays;
    const next = { ...acc };
    if (isComplete) next.completed += 1;

    const leader = sortMembersForLeaderboard(members)[0];
    const canRankAsChampion = isChallengeEnded(challenge, today) || completeLogDays >= targetDays;
    if (isComplete && canRankAsChampion && leader?.uid === uid) {
      next.top1 += 1;
    }
    return next;
  }, { completed: 0, top1: 0 });
}
