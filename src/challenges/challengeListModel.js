function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isCompletedChallenge(challenge, today = new Date()) {
  const status = String(challenge?.status || '').toLowerCase();
  if (status === 'completed' || status === 'ended') return true;
  if (status === 'cancelled' || status === 'deleted') return true;
  const endDate = parseDate(challenge?.endDate);
  if (!endDate) return false;
  const endOfDay = new Date(endDate);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay < today;
}

export function splitMyChallenges(challenges = [], today = new Date()) {
  return challenges.reduce((sections, challenge) => {
    if (isCompletedChallenge(challenge, today)) {
      sections.completed.push(challenge);
    } else {
      sections.active.push(challenge);
    }
    return sections;
  }, { active: [], completed: [] });
}

export function topDiscoverChallenges(challenges = [], joinedIds = new Set(), limit = 3, today = new Date()) {
  return challenges
    .filter(challenge => challenge?.id && !joinedIds.has(challenge.id))
    .filter(challenge => challenge.isPublic !== false)
    .filter(challenge => !isCompletedChallenge(challenge, today))
    .sort((left, right) => {
      const memberDelta = Number(right.memberCount || 0) - Number(left.memberCount || 0);
      if (memberDelta !== 0) return memberDelta;
      return String(left.name || '').localeCompare(String(right.name || ''));
    })
    .slice(0, limit);
}
