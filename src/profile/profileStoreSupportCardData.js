import { buildProfileStoreBillingSupportData } from './profileStoreBillingSupportData';
import { buildProfileStoreLifecycleSupportData } from './profileStoreLifecycleSupportData';
import { buildStoreSupportCopyCards } from './storeSupportCopyCards';

export function buildProfileStoreSupportCardData({
  activeChallengePackCount,
  challengePackCount,
  currentStreak,
  entitlementRecoveryReviewCount,
  monetizationSignalTotal,
  paidLaunchDecisionItemCount,
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
  supportReviewCount,
  validationReadinessConfirmed,
  weeklyCampaignPrompt,
}) {
  const {
    billingSupportEscalationCopy,
    entitlementRecoveryDecisionReplyCopy,
  } = buildProfileStoreBillingSupportData({
    activeChallengePackCount,
    challengePackCount,
    entitlementRecoveryReviewCount,
    proActive,
    storeCatalog,
    storePackCount,
    storeSubscriptionCount,
    storeTestEvidenceSummary,
    validationReadinessConfirmed,
  });
  const {
    renewalRecoveryCopy,
    cancellationFeedbackCopy,
    lapsedMemberWinbackCopy,
    storeLaunchDryRunCopy,
    storeTestPurchaseSessionPrepCopy,
    storeDemoAccountCopy,
    storeReviewPackCopy,
  } = buildProfileStoreLifecycleSupportData({
    activeChallengePackCount,
    challengePackCount,
    currentStreak,
    entitlementRecoveryReviewCount,
    monetizationSignalTotal,
    paidLaunchDecisionItemCount,
    paidLaunchDecisionStatus,
    paidLaunchReadyCount,
    proActive,
    proTrialDemandTotal,
    recommendedRevenuePath,
    referralJoins,
    storeCatalog,
    supportReviewCount,
    storeTestEvidenceSummary,
    validationReadinessConfirmed,
    weeklyCampaignPrompt,
  });
  const storeSupportCopyCards = buildStoreSupportCopyCards({
    subscriptionManagementGuidanceCopy,
    billingSupportEscalationCopy,
    renewalRecoveryCopy,
    cancellationFeedbackCopy,
    lapsedMemberWinbackCopy,
    storeLaunchDryRunCopy,
    storeTestPurchaseSessionPrepCopy,
    storeDemoAccountCopy,
    storeReviewPackCopy,
  });

  return {
    billingSupportEscalationCopy,
    entitlementRecoveryDecisionReplyCopy,
    lapsedMemberWinbackCopy,
    renewalRecoveryCopy,
    storeSupportCopyCards,
    storeTestPurchaseSessionPrepCopy,
  };
}
