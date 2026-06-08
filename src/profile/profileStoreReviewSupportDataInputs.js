import {
  POLICY_LINKS,
  SANDBOX_PURCHASE_TEST_ITEMS,
} from './profileConstants';

export function buildProfileStoreReviewSupportCounts({
  challengePackProducts,
  entitlementRecoveryReviewQueue,
  paidLaunchDecisionItems,
  supportReviewQueue,
}) {
  return {
    challengePackCount: challengePackProducts.length,
    entitlementRecoveryReviewCount: entitlementRecoveryReviewQueue.length,
    paidLaunchDecisionItemCount: paidLaunchDecisionItems.length,
    supportReviewCount: supportReviewQueue.length,
  };
}

export function buildProfileStoreSupportCardDataInputs({
  activeChallengePackCount,
  counts,
  currentStreak,
  monetizationSignalTotal,
  paidLaunchDecisionStatus,
  paidLaunchReadyCount,
  proActive,
  proTrialDemandTotal,
  recommendedRevenuePath,
  referralJoins,
  storeCatalog,
  storePackCount,
  storeSubscriptionCount,
  storeTestEvidenceSummary,
  subscriptionManagementGuidanceCopy,
  validationReadinessConfirmed,
  weeklyCampaignPrompt,
}) {
  return {
    activeChallengePackCount,
    challengePackCount: counts.challengePackCount,
    storeCatalog,
    storeSubscriptionCount,
    storePackCount,
    storeTestEvidenceSummary,
    entitlementRecoveryReviewCount: counts.entitlementRecoveryReviewCount,
    validationReadinessConfirmed,
    proActive,
    currentStreak,
    monetizationSignalTotal,
    referralJoins,
    proTrialDemandTotal,
    recommendedRevenuePath,
    paidLaunchDecisionStatus,
    paidLaunchReadyCount,
    subscriptionManagementGuidanceCopy,
    supportReviewCount: counts.supportReviewCount,
    paidLaunchDecisionItemCount: counts.paidLaunchDecisionItemCount,
    weeklyCampaignPrompt,
  };
}

export function buildStoreReviewPlanningCopyInputs({
  counts,
  paidLaunchDecisionStatus,
  paidLaunchReadyCount,
  recommendedRevenuePath,
  revenuePathways,
  storeCatalog,
  storeTestEvidenceSummary,
  validationReadinessConfirmed,
}) {
  return {
    sandboxPurchaseTestItems: SANDBOX_PURCHASE_TEST_ITEMS,
    storeCatalog,
    policyLinks: POLICY_LINKS,
    revenuePathways,
    recommendedRevenuePath,
    storeTestEvidenceSummary,
    validationReadinessConfirmed,
    paidLaunchDecisionStatus,
    paidLaunchReadyCount,
    paidLaunchDecisionItemCount: counts.paidLaunchDecisionItemCount,
  };
}
