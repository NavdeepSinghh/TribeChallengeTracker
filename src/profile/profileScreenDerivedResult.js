export function buildProfileScreenDerivedResult({
  baseData,
  communityReferralData,
  monetizationCampaignData,
}) {
  const {
    accountDeletionDecisionReplyCopy,
    accountDeletionRequested,
    activeFrame,
    activeFrameId,
    avatarColor,
    avatarEmoji,
    frameGradient,
    isAdmin,
    memberYear,
    profileImageSrc,
    supportDecisionReplyCopy,
    weeklyCampaignPrompt,
  } = baseData;
  const {
    engagementCreatorCopyData,
    partnerData,
    revenueData,
    weeklyCampaignData,
  } = monetizationCampaignData;
  const {
    creatorRevenueShareTotal,
    monetizationSignalTotal,
    proTrialDemandTotal,
    topProTrialReason,
  } = revenueData;

  return {
    accountDeletionDecisionReplyCopy,
    accountDeletionRequested,
    activeFrame,
    activeFrameId,
    avatarColor,
    avatarEmoji,
    ...engagementCreatorCopyData,
    ...communityReferralData,
    creatorRevenueShareTotal,
    frameGradient,
    isAdmin,
    memberYear,
    monetizationSignalTotal,
    ...partnerData,
    proTrialDemandTotal,
    profileImageSrc,
    ...revenueData,
    supportDecisionReplyCopy,
    topProTrialReason,
    ...weeklyCampaignData,
    weeklyCampaignPrompt,
  };
}
