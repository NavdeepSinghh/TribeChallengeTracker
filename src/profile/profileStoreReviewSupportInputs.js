export function buildProfileStoreReviewSupportInputs({
  currentStreak,
  entitlementRecoveryReviewQueue,
  monetizationSignalTotal,
  proTrialDemandTotal,
  referralJoins,
  storeCatalogData,
  storeMonetizationData,
  storeReadinessData,
  supportReviewQueue,
  weeklyCampaignPrompt,
}) {
  const {
    activeChallengePackCount,
    challengePackProducts,
    proActive,
    storeCatalog,
    storePackCount,
    storeSubscriptionCount,
  } = storeCatalogData;
  const {
    recommendedRevenuePath,
    revenuePathways,
  } = storeMonetizationData;
  const {
    subscriptionManagementGuidanceCopy,
    paidLaunchDecisionItems,
    paidLaunchDecisionStatus,
    paidLaunchReadyCount,
    storeTestEvidenceSummary,
    validationReadinessConfirmed,
  } = storeReadinessData;

  return {
    activeChallengePackCount,
    challengePackProducts,
    currentStreak,
    entitlementRecoveryReviewQueue,
    monetizationSignalTotal,
    paidLaunchDecisionItems,
    paidLaunchDecisionStatus,
    paidLaunchReadyCount,
    proActive,
    proTrialDemandTotal,
    recommendedRevenuePath,
    referralJoins,
    revenuePathways,
    storeCatalog,
    storePackCount,
    storeSubscriptionCount,
    storeTestEvidenceSummary,
    subscriptionManagementGuidanceCopy,
    supportReviewQueue,
    validationReadinessConfirmed,
    weeklyCampaignPrompt,
  };
}
