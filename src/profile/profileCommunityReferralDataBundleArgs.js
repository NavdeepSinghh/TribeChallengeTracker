export function buildProfileCommunityReferralDataBundleArgs({
  currentStreak,
  daysActive,
  featureReviewQueue,
  featuredSubmissions,
  profile,
  referralRewardReviewQueue,
  totalWinPoints,
}, { weeklyCampaignPrompt }) {
  return {
    currentStreak,
    daysActive,
    featureReviewQueue,
    featuredSubmissions,
    profile,
    referralRewardReviewQueue,
    totalWinPoints,
    weeklyCampaignPrompt,
  };
}
