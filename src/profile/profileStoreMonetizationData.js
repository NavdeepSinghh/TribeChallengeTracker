import {
  buildMonetizationSummaryCopy,
  buildRevenuePathways,
  pickRecommendedRevenuePath,
} from './monetizationModel';

export function buildProfileStoreMonetizationData({
  campaignPerformanceSummary,
  creatorRevenueShareSummary,
  creatorRevenueShareTotal,
  monetizationSignalTotal,
  partnerDemandTotal,
  proTrialDemandTotal,
  referralJoins,
  storeCatalog,
  storePackCount,
  storeSubscriptionCount,
  topProTrialReason,
  weeklyCampaignPrompt,
}) {
  const summaryCopy = buildMonetizationSummaryCopy({
    topProTrialReason,
    proTrialDemandTotal,
    weeklyCampaignPrompt,
    creatorRevenueShareTotal,
    creatorRevenueShareSummary,
    partnerDemandTotal,
    monetizationSignalTotal,
    storeCatalog,
    storeSubscriptionCount,
    storePackCount,
  });
  const revenuePathways = buildRevenuePathways({
    proTrialDemandTotal,
    campaignPerformanceSummary,
    storePackCount,
    creatorRevenueShareTotal,
    creatorRevenueShareSummary,
    partnerDemandTotal,
    referralJoins,
  });

  return {
    ...summaryCopy,
    recommendedRevenuePath: pickRecommendedRevenuePath(revenuePathways),
    revenuePathways,
  };
}
