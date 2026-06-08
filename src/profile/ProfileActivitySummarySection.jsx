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
}) {
  return (
    <>
      <ProfileRankProgressCard badgeXP={badgeXP} rank={rank} rankedPct={rankedPct} />
      <ProfileStatsGrid statsGrid={statsGrid} />
      <ProfileBadgeShowcase earnedList={earnedList} />
      <ProfilePreferenceRows prefRows={prefRows} />
    </>
  );
}
