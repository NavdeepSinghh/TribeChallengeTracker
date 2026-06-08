import { buildProfileEngagementCreatorCopyData } from './profileEngagementCreatorCopyData';

export function buildProfileEngagementCreatorCopyBundle({
  input,
  revenueData,
}) {
  const {
    communityHighlightRoundupItems,
    creatorBio,
    creatorHostingApplicationReviewQueue,
    creatorRevenueShareInterest,
    creatorSpecialty,
    currentStreak,
    daysActive,
    goalStreak,
    instagramWeeklyPrompt,
    monthlyRecap,
    myHistory,
    profileChallenges,
    referralJoins,
    totalChallengePoints,
    totalWinPoints,
    user,
    weeklyCampaignPrompt,
    weeklyReport,
  } = input;
  const {
    activeChallengePackCount,
    challengePackProducts,
    challengePackTitle,
    paidLaunchDecisionStatus,
    proActive,
    recommendedRevenuePath,
  } = revenueData;

  return buildProfileEngagementCreatorCopyData({
    activeChallengePackCount,
    challengePackProducts,
    challengePackTitle,
    communityHighlightRoundupItems,
    creatorBio,
    creatorHostingApplicationReviewQueue,
    creatorRevenueShareInterest,
    creatorSpecialty,
    currentStreak,
    daysActive,
    goalStreak,
    instagramWeeklyPrompt,
    monthlyRecap,
    myHistory,
    paidLaunchDecisionStatus,
    proActive,
    profileChallenges,
    recommendedRevenuePath,
    referralJoins,
    totalChallengePoints,
    totalWinPoints,
    user,
    weeklyCampaignPrompt,
    weeklyReport,
  });
}
