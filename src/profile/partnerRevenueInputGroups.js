import { buildPartnerRevenueCreatorScreenInputs } from './partnerRevenueCreatorScreenInputs';
import { buildPartnerRevenueDemandScreenInputs } from './partnerRevenueDemandScreenInputs';
import { buildPartnerRevenuePartnerScreenInputs } from './partnerRevenuePartnerScreenInputs';

export function buildPartnerRevenueComputedInputs(computedData) {
  const {
    applicationPartnerPerk,
    applicationPartnerSignalCount,
    campaignPerformanceSummary,
    creatorAnalytics,
    isAdmin,
    partnerCampaignApplicationSignalTotal,
    proActive,
    referralJoins,
  } = computedData;

  return {
    applicationPartnerPerk,
    applicationPartnerSignalCount,
    campaignPerformanceSummary,
    creatorAnalytics,
    isAdmin,
    partnerCampaignApplicationSignalTotal,
    proActive,
    referralJoins,
  };
}

export function buildPartnerRevenueScreenInputs(screenState) {
  return {
    ...buildPartnerRevenueCreatorScreenInputs(screenState),
    ...buildPartnerRevenuePartnerScreenInputs(screenState),
    ...buildPartnerRevenueDemandScreenInputs(screenState),
  };
}
