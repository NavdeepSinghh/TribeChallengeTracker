import ReferralRewardsSection from './ReferralRewardsSection';
import StreakComebackSection from './StreakComebackSection';
import {
  buildReferralRewardsSectionProps,
  buildStreakComebackSectionProps,
} from './profileRetentionReferralGrowthSectionProps';

export default function ProfileRetentionReferralGrowthSections({ model }) {
  const streakComebackSectionProps = buildStreakComebackSectionProps(model);
  const referralRewardsSectionProps = buildReferralRewardsSectionProps(model);

  return (
    <>
      <StreakComebackSection {...streakComebackSectionProps} />

      <ReferralRewardsSection {...referralRewardsSectionProps} />
    </>
  );
}
