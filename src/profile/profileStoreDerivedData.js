import { buildProfileStoreCatalogData } from './profileStoreCatalogData';
import { buildProfileStoreMonetizationData } from './profileStoreMonetizationData';
import { buildProfileStoreReadinessDerivedData } from './profileStoreReadinessDerivedData';
import { buildProfileStoreDerivedResult } from './profileStoreDerivedResult';
import { buildProfileStoreReviewSupportInputs } from './profileStoreReviewSupportInputs';
import { buildProfileStoreReviewSupportData } from './profileStoreReviewSupportData';

export function buildProfileStoreDerivedData({
  campaignPerformanceSummary,
  creatorRevenueShareSummary,
  creatorRevenueShareTotal,
  currentStreak,
  entitlementRecoveryReviewQueue,
  monetizationSignalTotal,
  partnerDemandTotal,
  profile,
  proTrialDemandTotal,
  referralJoins,
  storeTestEvidenceLog,
  supportReviewQueue,
  topProTrialReason,
  validationReadinessMessage,
  weeklyCampaignPrompt,
}) {
  const storeCatalogData = buildProfileStoreCatalogData(profile);
  const {
    challengePackTitle,
    isPackUnlocked,
    proSource,
    storeCatalog,
    storePackCount,
    storeSubscriptionCount,
    storeTestEvidenceCases,
  } = storeCatalogData;
  const storeMonetizationData = buildProfileStoreMonetizationData({
    campaignPerformanceSummary,
    creatorRevenueShareTotal,
    creatorRevenueShareSummary,
    monetizationSignalTotal,
    partnerDemandTotal,
    proTrialDemandTotal,
    referralJoins,
    storeCatalog,
    storePackCount,
    storeSubscriptionCount,
    topProTrialReason,
    weeklyCampaignPrompt,
  });
  const {
    recommendedRevenuePath,
  } = storeMonetizationData;
  const storeReadinessData = buildProfileStoreReadinessDerivedData({
    monetizationSignalTotal,
    recommendedRevenuePath,
    storeCatalog,
    storePackCount,
    storeSubscriptionCount,
    storeTestEvidenceLog,
    validationReadinessMessage,
  });
  const storeReviewSupportInputs = buildProfileStoreReviewSupportInputs({
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
  });
  const storeReviewSupportData = buildProfileStoreReviewSupportData(storeReviewSupportInputs);

  return buildProfileStoreDerivedResult({
    storeCatalogData,
    storeMonetizationData,
    storeReadinessData,
    storeReviewSupportData,
  });
}
