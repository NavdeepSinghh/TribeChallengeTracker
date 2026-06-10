export function buildProfileBaseBundleInputs({
  accountDeletionReviewQueue,
  profile,
  rank,
  selectedFrameId,
  supportCategory,
  supportReviewQueue,
  user,
}) {
  return {
    accountDeletionReviewQueue,
    profile,
    rank,
    selectedFrameId,
    supportCategory,
    supportReviewQueue,
    user,
  };
}

export function buildProfileCommunityReferralBundleInputs({
  currentStreak,
  daysActive,
  featureReviewQueue,
  featuredSubmissions,
  profile,
  referralRewardReviewQueue,
  approvedReferralRewardHandoffAuditReviews,
  referralRewardHandoffAuditReviewQueue,
  totalWinPoints,
  weeklyCampaignPrompt,
}) {
  return {
    currentStreak,
    daysActive,
    featureReviewQueue,
    featuredSubmissions,
    profile,
    referralRewardReviewQueue,
    approvedReferralRewardHandoffAuditReviews,
    referralRewardHandoffAuditReviewQueue,
    totalWinPoints,
    weeklyCampaignPrompt,
  };
}
