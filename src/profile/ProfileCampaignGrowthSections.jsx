import ProfileRetentionReferralGrowthSections from './ProfileRetentionReferralGrowthSections';
import ProfileWeeklyCampaignGrowthSection from './ProfileWeeklyCampaignGrowthSection';

export default function ProfileCampaignGrowthSections({ model }) {
  return (
    <>
      <ProfileWeeklyCampaignGrowthSection model={model} />
      <ProfileRetentionReferralGrowthSections model={model} />
    </>
  );
}
