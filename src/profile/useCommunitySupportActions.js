import useAccountSupportActions from './useAccountSupportActions';
import useFeatureSubmissionActions from './useFeatureSubmissionActions';
import useReferralRewardActions from './useReferralRewardActions';
import useSocialReminderActions from './useSocialReminderActions';

export default function useCommunitySupportActions(inputs) {
  const copyText = async text => {
    await navigator.clipboard?.writeText(text);
  };

  return {
    copyText,
    ...useAccountSupportActions(inputs),
    ...useFeatureSubmissionActions(inputs),
    ...useReferralRewardActions(inputs),
    ...useSocialReminderActions(inputs),
  };
}
