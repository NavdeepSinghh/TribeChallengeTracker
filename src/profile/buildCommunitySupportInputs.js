import { buildCommunityFeatureReferralScreenInputs } from './communityFeatureReferralScreenInputs';
import { buildCommunitySocialReminderScreenInputs } from './communitySocialReminderScreenInputs';
import { buildCommunitySupportReviewScreenInputs } from './communitySupportReviewScreenInputs';

export function buildCommunitySupportInputs({ computedData, screenState, user, onProfileUpdated }) {
  const {
    accountDeletionRequested,
    isAdmin,
    referralJoins,
    unlockedReferralRewardTier,
  } = computedData;

  return {
    accountDeletionRequested,
    isAdmin,
    referralJoins,
    ...buildCommunitySupportReviewScreenInputs(screenState),
    ...buildCommunityFeatureReferralScreenInputs(screenState),
    ...buildCommunitySocialReminderScreenInputs(screenState),
    unlockedReferralRewardTier,
    user,
    onProfileUpdated,
  };
}
