import { buildProfileMonetizationSignalData } from './profileMonetizationSignalData';
import { buildProfileStoreDerivedData } from './profileStoreDerivedData';
import { buildRevenueReadinessCopy } from './revenueReadinessCopy';

export function buildProfileRevenueDerivedData({
  approvedCommunityEventReviews,
  campaignPerformanceSummary,
  communityEventReviewQueue,
  creatorRevenueShareSummary,
  currentStreak,
  daysActive,
  entitlementRecoveryReviewQueue,
  partnerDemandTotal,
  profile,
  proTrialSummary,
  referralJoins,
  storeTestEvidenceLog,
  supportReviewQueue,
  validationReadinessMessage,
  weeklyCampaignPrompt,
}) {
  const monetizationSignalData = buildProfileMonetizationSignalData({
    creatorRevenueShareSummary,
    partnerDemandTotal,
    proTrialSummary,
  });
  const {
    creatorRevenueShareTotal,
    monetizationSignalTotal,
    proTrialDemandTotal,
    topProTrialReason,
  } = monetizationSignalData;
  const storeData = buildProfileStoreDerivedData({
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
  });
  const {
    recommendedRevenuePath,
    storeCatalog,
  } = storeData;
  const revenueReadinessCopy = buildRevenueReadinessCopy({
    approvedCommunityEventReviews,
    communityEventReviewQueue,
    storeCatalog,
    recommendedRevenuePath,
    monetizationSignalTotal,
    campaignPerformanceSummary,
    referralJoins,
    daysActive,
  });

  return {
    ...monetizationSignalData,
    ...storeData,
    ...revenueReadinessCopy,
  };
}
