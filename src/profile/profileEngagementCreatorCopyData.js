import { buildCreatorHostingCopy } from './creatorHostingCopy';
import { buildProfileEngagementCampaignCopyData } from './profileEngagementCampaignCopyData';
import { buildProfileEngagementCreatorCopyResult } from './profileEngagementCreatorCopyResult';
import { buildProfileEngagementState } from './profileDerivedState';

export function buildProfileEngagementCreatorCopyData({
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
}) {
  const engagementState = buildProfileEngagementState({
    profileChallenges,
    userId: user.uid,
    weeklyReport,
    currentStreak,
    totalChallengePoints,
    myHistory,
    proActive,
  });
  const {
    creatorOwnedChallenges,
    creatorAnalytics,
    proValueFocus,
    yesterdayRecovered,
  } = engagementState;
  const engagementCampaignCopyData = buildProfileEngagementCampaignCopyData({
    activeChallengePackCount,
    instagramWeeklyPrompt,
    challengePackProducts,
    challengePackTitle,
    communityHighlightRoundupCount: communityHighlightRoundupItems.length,
    currentStreak,
    daysActive,
    goalStreak,
    monthlyRecap,
    paidLaunchDecisionStatus,
    proActive,
    proValueFocus,
    recommendedRevenuePath,
    referralJoins,
    totalChallengePoints,
    totalWinPoints,
    weeklyCampaignPrompt,
    weeklyReport,
    yesterdayRecovered,
  });
  const creatorHostingCopyData = buildCreatorHostingCopy({
    creatorOwnedChallenges,
    creatorSpecialty,
    creatorBio,
    creatorAnalytics,
    creatorRevenueShareInterest,
    creatorHostingApplicationReviewQueue,
    userId: user.uid,
  });

  return buildProfileEngagementCreatorCopyResult({
    engagementState,
    engagementCampaignCopyData,
    creatorHostingCopyData,
  });
}
