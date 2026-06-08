import {
  buildProfileStoreSupportCardDataInputs,
  buildStoreReviewPlanningCopyInputs,
} from './profileStoreReviewSupportDataInputs';
import { buildProfileStoreSupportCardData } from './profileStoreSupportCardData';
import { buildStoreReviewPlanningCopy } from './storeReviewPlanningCopy';

export function buildProfileStoreSupportCardDataBundle({
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
  return buildProfileStoreSupportCardData(buildProfileStoreSupportCardDataInputs({
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
  }));
}

export function buildStoreReviewPlanningCopyBundle({
  counts,
  paidLaunchDecisionStatus,
  paidLaunchReadyCount,
  recommendedRevenuePath,
  revenuePathways,
  storeCatalog,
  storeTestEvidenceSummary,
  validationReadinessConfirmed,
}) {
  return buildStoreReviewPlanningCopy(buildStoreReviewPlanningCopyInputs({
    counts,
    paidLaunchDecisionStatus,
    paidLaunchReadyCount,
    recommendedRevenuePath,
    revenuePathways,
    storeCatalog,
    storeTestEvidenceSummary,
    validationReadinessConfirmed,
  }));
}
