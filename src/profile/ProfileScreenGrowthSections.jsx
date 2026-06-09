import ProfileCampaignGrowthSections from './ProfileCampaignGrowthSections';
import ProfileCommunityStorySections from './ProfileCommunityStorySections';
import ProfileProgressGoalSections from './ProfileProgressGoalSections';

export default function ProfileScreenGrowthSections({ model, mode = 'settings' }) {
  if (mode === 'profile') {
    return <ProfileProgressGoalSections model={model} />;
  }

  return (
    <>
      <ProfileCampaignGrowthSections model={model} />
      <ProfileProgressGoalSections model={model} />
      <ProfileCommunityStorySections model={model} />
    </>
  );
}
