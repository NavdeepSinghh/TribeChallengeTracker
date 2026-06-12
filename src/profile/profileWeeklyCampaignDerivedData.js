import { buildLaunchExperimentCopy } from './launchExperimentCopy';
import {
  DM_KEYWORD_PROMPTS,
} from './profileConstants';
import { buildWeeklyCampaignCoreCopy } from './weeklyCampaignCoreCopy';
import { buildProfileWeeklyCampaignDerivedResult } from './profileWeeklyCampaignDerivedResult';
import { buildWeeklyCampaignEngagementCopy } from './weeklyCampaignEngagementCopy';

export function buildProfileWeeklyCampaignDerivedData({
  campaignPerformanceSummary,
  featureReviewQueue,
  monetizationSignalTotal,
  partnerDemandTotal,
  proTrialDemandTotal,
  referralJoins,
  storeCatalog,
  storePackCount,
  supportReviewQueue = [],
  weeklyCampaignPrompt,
}) {
  const coreData = buildWeeklyCampaignCoreCopy({
    weeklyCampaignPrompt,
    campaignPerformanceSummary,
    referralJoins,
    featureReviewQueue,
    dmKeywordPrompts: DM_KEYWORD_PROMPTS,
  });
  const experimentData = buildLaunchExperimentCopy({
    proTrialDemandTotal,
    storePackCount,
    referralJoins,
    partnerDemandTotal,
    weeklyCampaignPrompt,
    monetizationSignalTotal,
    campaignPerformanceSummary,
    storeCatalog,
  });
  const engagementData = buildWeeklyCampaignEngagementCopy({
    weeklyCampaignPrompt,
    recommendedLaunchExperiment: experimentData.recommendedLaunchExperiment,
    campaignPerformanceSummary,
    referralJoins,
    featureReviewQueue,
    supportReviewQueue,
  });

  return buildProfileWeeklyCampaignDerivedResult({
    coreData,
    experimentData,
    engagementData,
  });
}
