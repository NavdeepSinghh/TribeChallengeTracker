import ProfileCampaignGrowthSections from './ProfileCampaignGrowthSections';
import ProfileCommunityStorySections from './ProfileCommunityStorySections';
import ProfileProgressGoalSections from './ProfileProgressGoalSections';

export default function ProfileScreenGrowthSections({ model }) {
  return (
    <>
      <ProfileCampaignGrowthSections model={model} />
      <ProfileProgressGoalSections model={model} />
      <ProfileCommunityStorySections model={model} />
    </>
  );
}
