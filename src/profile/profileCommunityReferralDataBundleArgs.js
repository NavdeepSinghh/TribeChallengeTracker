export function buildProfileCommunityReferralDataBundleArgs({
  currentStreak,
  daysActive,
  featureReviewQueue,
  featuredSubmissions,
  profile,
  approvedReferralRewardHandoffAuditReviews,
  referralRewardHandoffAuditReviewQueue,
  referralRewardReviewQueue,
  totalWinPoints,
}, { weeklyCampaignPrompt }) {
  return {
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
  };
}
