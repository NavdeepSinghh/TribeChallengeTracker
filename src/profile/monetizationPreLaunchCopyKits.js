import { buildMonetizationCommunityPreLaunchCopyKits } from './monetizationCommunityPreLaunchCopyKits';
import { buildMonetizationRevenuePreLaunchCopyKits } from './monetizationRevenuePreLaunchCopyKits';

export function buildMonetizationPreLaunchCopyKits({
  campaignPerformanceSummary,
  communityAmbassadorCopy,
  communityEventInterestCopy,
  customerValueChecklistCopy,
  daysActive,
  founderMemberOfferCopy,
  monetizationSignalTotal,
  pricingTestKitCopy,
  recommendedRevenuePath,
  referralJoins,
  storePackCount,
  storeSubscriptionCount,
}) {
  const kitArgs = {
    campaignPerformanceSummary,
    communityAmbassadorCopy,
    communityEventInterestCopy,
    customerValueChecklistCopy,
    daysActive,
    founderMemberOfferCopy,
    monetizationSignalTotal,
    pricingTestKitCopy,
    recommendedRevenuePath,
    referralJoins,
    storePackCount,
    storeSubscriptionCount,
  };

  return [
    ...buildMonetizationRevenuePreLaunchCopyKits(kitArgs),
    ...buildMonetizationCommunityPreLaunchCopyKits(kitArgs),
  ];
}
