import { BADGES, calcBadgeXP, getTribeRank } from '../badgeService';

export function buildProfileScreenBadgeData({ earnedBadges }) {
  const badgeXP = calcBadgeXP(earnedBadges);
  const rank = getTribeRank(badgeXP);
  const rankedPct = rank.next
    ? Math.min(100, ((badgeXP - rank.min) / (rank.next.min - rank.min)) * 100)
    : 100;
  const earnedList = BADGES.filter(b => earnedBadges.has(b.id));

  return {
    badgeXP,
    earnedList,
    rank,
    rankedPct,
  };
}
