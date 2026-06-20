import ProfileCampaignGrowthSections from './ProfileCampaignGrowthSections';
import ProfileCommunityStorySections from './ProfileCommunityStorySections';
import ProfileProgressGoalSections from './ProfileProgressGoalSections';
import { V1_PAID_FEATURES_ENABLED } from '../proFeatures';

export default function ProfileScreenGrowthSections({ model, mode = 'settings' }) {
  if (mode === 'profile') {
    return V1_PAID_FEATURES_ENABLED ? <ProfileProgressGoalSections model={model} /> : null;
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
