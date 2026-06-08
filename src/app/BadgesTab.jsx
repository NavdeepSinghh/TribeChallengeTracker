import { BADGES, BADGE_CATEGORIES, calcBadgeXP, getBadgeProgress, getTribeRank } from "../badgeService";
import { buildActivityStats } from "./activityStats";
import BadgeCategoryFilter from "./BadgeCategoryFilter";
import BadgeGrid from "./BadgeGrid";
import BadgeList from "./BadgeList";
import BadgeRankCard from "./BadgeRankCard";
import BadgeSummaryStats from "./BadgeSummaryStats";

export default function BadgesTab({
  badgeCat,
  challengeStats,
  earnedBadges,
  myHistory,
  setBadgeCat,
  userProfile,
}) {
  const stats = buildActivityStats(myHistory, challengeStats, userProfile);
  const badgeXP = calcBadgeXP(earnedBadges);
  const rank = getTribeRank(badgeXP);
  const inProgressCount = BADGES.filter(badge => {
    if (earnedBadges.has(badge.id)) return false;
    const progress = getBadgeProgress(badge.id, stats);
    return progress.current > 0;
  }).length;
  const filteredBadges = badgeCat === "all" ? BADGES : BADGES.filter(badge => badge.cat === badgeCat);

  return (
    <div style={{ padding: "52px 0 20px" }}>
      <BadgeRankCard badgeXP={badgeXP} rank={rank} />
      <BadgeSummaryStats
        badgeXP={badgeXP}
        earnedCount={earnedBadges.size}
        inProgressCount={inProgressCount}
        rank={rank}
      />
      <BadgeCategoryFilter badgeCat={badgeCat} categories={BADGE_CATEGORIES} setBadgeCat={setBadgeCat} />
      <BadgeGrid badges={filteredBadges} earnedBadges={earnedBadges} stats={stats} />
      <BadgeList badges={filteredBadges} earnedBadges={earnedBadges} />
    </div>
  );
}
