import { buildProfileEngagementCreatorCopyBundle } from './profileEngagementCreatorCopyBundle';
import { buildProfilePartnerDerivedData } from './profilePartnerDerivedData';
import { buildProfileRevenueDerivedData } from './profileRevenueDerivedData';
import { buildProfileWeeklyCampaignDerivedData } from './profileWeeklyCampaignDerivedData';

export function buildProfileMonetizationCampaignDerivedData(input) {
  const {
    campaignPerformanceSummary,
    challengePoints,
    approvedCommunityEventReviews,
    communityEventReviewQueue,
    creatorRevenueShareSummary,
    currentStreak,
    daysActive,
    entitlementRecoveryReviewQueue,
    featureReviewQueue,
    partnerCampaignApplicationReviewQueue,
    partnerPerkClaimReviewQueue,
    partnerPerkHandoffAuditReviewQueue,
    partnerPerkSummary,
    profile,
    proTrialSummary,
    approvedPartnerPerkHandoffAuditReviews,
    referralJoins,
    selectedPartnerPerkIds,
    storeTestEvidenceLog,
    supportReviewQueue,
    validationReadinessMessage,
    weeklyCampaignPrompt,
  } = input;

  const partnerData = buildProfilePartnerDerivedData({
    campaignPerformanceSummary,
    challengePoints,
    daysActive,
    partnerCampaignApplicationReviewQueue,
    partnerPerkClaimReviewQueue,
    partnerPerkHandoffAuditReviewQueue,
    partnerPerkSummary,
    approvedPartnerPerkHandoffAuditReviews,
    selectedPartnerPerkIds,
    referralJoins,
  });
  const { partnerDemandTotal } = partnerData;
  const revenueData = buildProfileRevenueDerivedData({
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
  });
  const {
    monetizationSignalTotal,
    proTrialDemandTotal,
    storeCatalog,
    storePackCount,
  } = revenueData;
  const weeklyCampaignData = buildProfileWeeklyCampaignDerivedData({
    campaignPerformanceSummary,
    featureReviewQueue,
    monetizationSignalTotal,
    partnerDemandTotal,
    proTrialDemandTotal,
    referralJoins,
    storeCatalog,
    storePackCount,
    weeklyCampaignPrompt,
  });
  const engagementCreatorCopyData = buildProfileEngagementCreatorCopyBundle({
    input,
    revenueData,
  });

  return {
    engagementCreatorCopyData,
    partnerData,
    revenueData,
    weeklyCampaignData,
  };
}
