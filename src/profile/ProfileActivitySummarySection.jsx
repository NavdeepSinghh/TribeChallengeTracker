import ProfileBadgeShowcase from './ProfileBadgeShowcase';
import ProfilePreferenceRows from './ProfilePreferenceRows';
import ProfileRankProgressCard from './ProfileRankProgressCard';
import ProfileStatsGrid from './ProfileStatsGrid';

export default function ProfileActivitySummarySection({
  rank,
  badgeXP,
  rankedPct,
  statsGrid,
  earnedList,
  prefRows,
  onOpenBadges,
}) {
  return (
    <>
      <ProfileRankProgressCard badgeXP={badgeXP} onOpenBadges={onOpenBadges} rank={rank} rankedPct={rankedPct} />
      <ProfileStatsGrid statsGrid={statsGrid} />
      <ProfileBadgeShowcase earnedList={earnedList} onOpenBadges={onOpenBadges} />
      <ProfilePreferenceRows prefRows={prefRows} />
    </>
  );
}
