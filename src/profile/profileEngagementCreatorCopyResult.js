export function buildProfileEngagementCreatorCopyResult({
  engagementState,
  engagementCampaignCopyData,
  creatorHostingCopyData,
}) {
  const {
    creatorAnalytics,
    proValueNextAction,
    yesterdayKey,
    yesterdayRecovered,
  } = engagementState;
  const {
    valueProofStoryCopy,
    storyPostingChecklistCopy,
    instagramPromptCopy,
    instagramContentCalendarCopy,
    challengePackLaunchCopy,
    challengePackObjectionReplyCopy,
    streakRescuePromptCopy,
    comebackChallengeInviteCopy,
  } = engagementCampaignCopyData;
  const {
    creatorOwnedChallenges,
    creatorLaunchChallenge,
    creatorLaunchLink,
    creatorLaunchCopy,
    creatorBrandedPagePreviewCopy,
    creatorChallengeTemplateDraftCopy,
    creatorPrivateInviteCopy,
    creatorHostingOfferCopy,
    creatorTermsReadinessCopy,
    creatorPayoutReadinessCopy,
    creatorHostingObjectionReplyCopy,
    creatorHostingDecisionReplyCopy,
  } = creatorHostingCopyData;

  return {
    challengePackLaunchCopy,
    challengePackObjectionReplyCopy,
    comebackChallengeInviteCopy,
    creatorAnalytics,
    creatorBrandedPagePreviewCopy,
    creatorChallengeTemplateDraftCopy,
    creatorHostingDecisionReplyCopy,
    creatorHostingObjectionReplyCopy,
    creatorHostingOfferCopy,
    creatorLaunchChallenge,
    creatorLaunchCopy,
    creatorLaunchLink,
    creatorOwnedChallenges,
    creatorPrivateInviteCopy,
    creatorPayoutReadinessCopy,
    creatorTermsReadinessCopy,
    instagramContentCalendarCopy,
    instagramPromptCopy,
    proValueNextAction,
    storyPostingChecklistCopy,
    streakRescuePromptCopy,
    valueProofStoryCopy,
    yesterdayKey,
    yesterdayRecovered,
  };
}
