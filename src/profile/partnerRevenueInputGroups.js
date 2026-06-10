import { buildPartnerRevenueCreatorScreenInputs } from './partnerRevenueCreatorScreenInputs';
import { buildPartnerRevenueDemandScreenInputs } from './partnerRevenueDemandScreenInputs';
import { buildPartnerRevenuePartnerScreenInputs } from './partnerRevenuePartnerScreenInputs';

export function buildPartnerRevenueComputedInputs(computedData) {
  const {
    applicationPartnerPerk,
    applicationPartnerSignalCount,
    campaignPerformanceSummary,
    creatorAnalytics,
    creatorLaunchChallenge,
    featureReviewQueue,
    isAdmin,
    partnerCampaignApplicationSignalTotal,
    proActive,
    recommendedLaunchExperiment,
    referralJoins,
    supportReviewQueue,
    weeklyCampaignPrompt,
  } = computedData;

  return {
    applicationPartnerPerk,
    applicationPartnerSignalCount,
    campaignPerformanceSummary,
    creatorAnalytics,
    creatorLaunchChallenge,
    featureReviewQueue,
    isAdmin,
    partnerCampaignApplicationSignalTotal,
    proActive,
    recommendedLaunchExperiment,
    referralJoins,
    supportReviewQueue,
    weeklyCampaignPrompt,
  };
}

export function buildPartnerRevenueScreenInputs(screenState) {
  return {
    ...buildPartnerRevenueCreatorScreenInputs(screenState),
    ...buildPartnerRevenuePartnerScreenInputs(screenState),
    ...buildPartnerRevenueDemandScreenInputs(screenState),
  };
}
