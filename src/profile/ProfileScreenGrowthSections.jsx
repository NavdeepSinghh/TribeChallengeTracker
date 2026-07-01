import ProfileCampaignGrowthSections from './ProfileCampaignGrowthSections';
import ProfileActivitySummarySection from './ProfileActivitySummarySection';
import ProfileCommunityStorySections from './ProfileCommunityStorySections';
import ProfileProgressGoalSections from './ProfileProgressGoalSections';
import { V1_PAID_FEATURES_ENABLED } from '../proFeatures';

export default function ProfileScreenGrowthSections({ model, mode = 'settings' }) {
  if (mode === 'profile') {
    return (
      <>
        <ProfileActivitySummarySection
          badgeXP={model.badgeXP}
          earnedList={model.earnedList}
          onOpenBadges={model.onOpenBadges}
          prefRows={model.prefRows}
          rank={model.rank}
          rankedPct={model.rankedPct}
          statsGrid={model.statsGrid}
        />
        {V1_PAID_FEATURES_ENABLED && <ProfileProgressGoalSections model={model} />}
      </>
    );
  }

  if (!V1_PAID_FEATURES_ENABLED) return null;

  return (
    <>
      <ProfileCampaignGrowthSections model={model} />
      <ProfileProgressGoalSections model={model} />
      <ProfileCommunityStorySections model={model} />
    </>
  );
}
