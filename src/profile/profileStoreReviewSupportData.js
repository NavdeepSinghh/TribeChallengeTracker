import {
  buildProfileStoreReviewSupportCounts,
} from './profileStoreReviewSupportDataInputs';
import {
  buildProfileStoreSupportCardDataBundle,
  buildStoreReviewPlanningCopyBundle,
} from './profileStoreReviewSupportDataBundles';

export function buildProfileStoreReviewSupportData({
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
}) {
  const counts = buildProfileStoreReviewSupportCounts({
    challengePackProducts,
    entitlementRecoveryReviewQueue,
    paidLaunchDecisionItems,
    supportReviewQueue,
  });
  const {
    billingSupportEscalationCopy,
    entitlementRecoveryDecisionReplyCopy,
    lapsedMemberWinbackCopy,
    renewalRecoveryCopy,
    storeSupportCopyCards,
  } = buildProfileStoreSupportCardDataBundle({
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
  });
  const {
    sandboxPurchaseTestPlanCopy,
    storeListingCopy,
    storeReviewSubmissionCopy,
    storeReviewEvidencePackCopy,
    dataSafetyDisclosureCopy,
    revenuePathwayPlannerCopy,
  } = buildStoreReviewPlanningCopyBundle({
    counts,
    paidLaunchDecisionStatus,
    paidLaunchReadyCount,
    recommendedRevenuePath,
    revenuePathways,
    storeCatalog,
    storeTestEvidenceSummary,
    validationReadinessConfirmed,
  });

  return {
    billingSupportEscalationCopy,
    dataSafetyDisclosureCopy,
    entitlementRecoveryDecisionReplyCopy,
    lapsedMemberWinbackCopy,
    renewalRecoveryCopy,
    revenuePathwayPlannerCopy,
    sandboxPurchaseTestPlanCopy,
    storeListingCopy,
    storeReviewEvidencePackCopy,
    storeReviewSubmissionCopy,
    storeSupportCopyCards,
  };
}
