import { buildProfileCommunityReferralDerivedData } from './profileCommunityReferralDerivedData';
import { buildProfileCommunityReferralBundleInputs } from './profileScreenBundleInputs';

export function buildProfileCommunityReferralDataBundle({
  currentStreak,
  daysActive,
  featureReviewQueue,
  featuredSubmissions,
  profile,
  approvedReferralRewardHandoffAuditReviews,
  referralRewardHandoffAuditReviewQueue,
  referralRewardReviewQueue,
  totalWinPoints,
  weeklyCampaignPrompt,
}) {
  return buildProfileCommunityReferralDerivedData(buildProfileCommunityReferralBundleInputs({
    currentStreak,
    daysActive,
    featureReviewQueue,
    featuredSubmissions,
    profile,
    approvedReferralRewardHandoffAuditReviews,
    referralRewardHandoffAuditReviewQueue,
    referralRewardReviewQueue,
    totalWinPoints,
    weeklyCampaignPrompt,
  }));
}
