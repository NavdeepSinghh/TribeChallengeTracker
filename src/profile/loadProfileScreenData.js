import { getUserChallenges } from '../challengeService';
import {
  getAccountDeletionReviewQueue,
  getCampaignPerformanceSummary,
  getCommunityEventInterestSummary,
  getApprovedCommunityEventReviews,
  getCommunityEventReviewQueue,
  getApprovedCustomerValueReviews,
  getCustomerValueReviewQueue,
  getCreatorChallengeTemplateDraftReviewQueue,
  getCreatorBrandedPageReviewQueue,
  getCreatorHostingApplicationReviewQueue,
  getCreatorLeaderboardSnapshotReviewQueue,
  getCreatorPrivateInviteLaunchReviewQueue,
  getCreatorPaidHostingLaunchGateReviewQueue,
  getCreatorPayoutExceptionReviewQueue,
  getCreatorRevenueShareSummary,
  getEntitlementRecoveryReviewQueue,
  getApprovedPaidLaunchDecisionReviews,
  getApprovedSupportRefundReadinessReviews,
  getApprovedStoreReviewResponseReviews,
  getFeaturedSubmissions,
  getFeatureReviewQueue,
  getFeatureSubmissions,
  getApprovedLaunchExperimentReviews,
  getApprovedProTrialReviews,
  getApprovedWeeklyCampaignReviews,
  getLaunchExperimentReviewQueue,
  getProTrialReviewQueue,
  getPaidLaunchDecisionReviewQueue,
  getWeeklyCampaignReviewQueue,
  getPartnerCampaignApplicationReviewQueue,
  getApprovedPartnerCampaignRetrospectiveReviews,
  getPartnerCampaignRetrospectiveReviewQueue,
  getApprovedPartnerPerkHandoffAuditReviews,
  getApprovedReferralRewardHandoffAuditReviews,
  getPartnerPerkHandoffAuditReviewQueue,
  getPartnerPerkClaimReviewQueue,
  getPartnerPerkClaims,
  getPartnerPerkInterestSummary,
  getPublishedCreatorChallengeTemplates,
  getPublishedCreatorBrandedPages,
  getPublishedCreatorLeaderboardSnapshots,
  getApprovedCreatorPrivateInviteLaunches,
  getApprovedCreatorPaidHostingLaunchGateReviews,
  getApprovedCreatorPayoutExceptionReviews,
  getProTrialInterestSummary,
  getReferralRewardReviewQueue,
  getReferralRewardHandoffAuditReviewQueue,
  getStoreTestPurchaseEvidenceLog,
  getSupportRefundReadinessReviewQueue,
  getStoreReviewResponseReviewQueue,
  getSupportReviewQueue,
  getUserChallengePoints,
  getUserProfile,
} from '../userService';

export function loadProfileScreenData(userUid, setters) {
  const setIfPresent = (name, value) => {
    if (typeof setters[name] === 'function') {
      setters[name](value);
    }
  };

  getUserProfile(userUid).then(profile => {
    setIfPresent('setProfile', profile);
    setIfPresent('setDisplayNameDraft', profile?.displayName || '');
    setIfPresent('setInstagramHandle', profile?.instagramHandle || '');
    setIfPresent('setGoalActiveDays', profile?.goals?.weeklyActiveDaysTarget || 5);
    setIfPresent('setGoalPoints', profile?.goals?.weeklyPointsTarget || 250);
    setIfPresent('setGoalStreak', profile?.goals?.streakTarget || 30);
    setIfPresent('setSelectedFrameId', profile?.cosmetics?.profileFrameId || 'none');
    setIfPresent('setCreatorEnabled', profile?.creatorProfile?.enabled || false);
    setIfPresent('setCreatorSpecialty', profile?.creatorProfile?.specialty || '');
    setIfPresent('setCreatorBio', profile?.creatorProfile?.bio || '');
    setIfPresent('setCreatorCtaUrl', profile?.creatorProfile?.ctaUrl || '');
    setIfPresent('setCreatorRevenueShareInterest', profile?.creatorProfile?.revenueShareInterest || false);
    setIfPresent('setSelectedPartnerPerkIds', profile?.partnerPerkInterest?.selectedIds || []);
    setIfPresent('setSelectedCommunityEventInterestIds', profile?.communityEventInterest?.selectedIds || []);
    setIfPresent('setSelectedProTrialReasonIds', profile?.proTrialInterest?.selectedIds || []);

    const ids = profile?.joinedChallengeIds || [];
    if (ids.length) {
      getUserChallengePoints(userUid, ids).then(setters.setChallengePoints);
      getUserChallenges(ids).then(setters.setProfileChallenges).catch(() => setters.setProfileChallenges([]));
    }

    if (profile?.isAdmin || profile?.role === 'admin') {
      getFeatureReviewQueue().then(setters.setFeatureReviewQueue).catch(() => setters.setFeatureReviewQueue([]));
      getAccountDeletionReviewQueue().then(setters.setAccountDeletionReviewQueue).catch(() => setters.setAccountDeletionReviewQueue([]));
      getSupportReviewQueue().then(setters.setSupportReviewQueue).catch(() => setters.setSupportReviewQueue([]));
      getEntitlementRecoveryReviewQueue().then(setters.setEntitlementRecoveryReviewQueue).catch(() => setters.setEntitlementRecoveryReviewQueue([]));
      getStoreTestPurchaseEvidenceLog().then(setters.setStoreTestEvidenceLog).catch(() => setters.setStoreTestEvidenceLog([]));
      getSupportRefundReadinessReviewQueue().then(setters.setSupportRefundReadinessReviewQueue).catch(() => setters.setSupportRefundReadinessReviewQueue([]));
      getApprovedSupportRefundReadinessReviews().then(setters.setApprovedSupportRefundReadinessReviews).catch(() => setters.setApprovedSupportRefundReadinessReviews([]));
      getStoreReviewResponseReviewQueue().then(setters.setStoreReviewResponseReviewQueue).catch(() => setters.setStoreReviewResponseReviewQueue([]));
      getApprovedStoreReviewResponseReviews().then(setters.setApprovedStoreReviewResponseReviews).catch(() => setters.setApprovedStoreReviewResponseReviews([]));
      getPaidLaunchDecisionReviewQueue().then(setters.setPaidLaunchDecisionReviewQueue).catch(() => setters.setPaidLaunchDecisionReviewQueue([]));
      getApprovedPaidLaunchDecisionReviews().then(setters.setApprovedPaidLaunchDecisionReviews).catch(() => setters.setApprovedPaidLaunchDecisionReviews([]));
      getReferralRewardReviewQueue().then(setters.setReferralRewardReviewQueue).catch(() => setters.setReferralRewardReviewQueue([]));
      getReferralRewardHandoffAuditReviewQueue().then(setters.setReferralRewardHandoffAuditReviewQueue).catch(() => setters.setReferralRewardHandoffAuditReviewQueue([]));
      getApprovedReferralRewardHandoffAuditReviews().then(setters.setApprovedReferralRewardHandoffAuditReviews).catch(() => setters.setApprovedReferralRewardHandoffAuditReviews([]));
      getPartnerPerkInterestSummary().then(setters.setPartnerPerkSummary).catch(() => setters.setPartnerPerkSummary({}));
      getCommunityEventInterestSummary().then(setters.setCommunityEventInterestSummary).catch(() => setters.setCommunityEventInterestSummary({}));
      getCommunityEventReviewQueue().then(setters.setCommunityEventReviewQueue).catch(() => setters.setCommunityEventReviewQueue([]));
      getApprovedCommunityEventReviews().then(setters.setApprovedCommunityEventReviews).catch(() => setters.setApprovedCommunityEventReviews([]));
      getCustomerValueReviewQueue().then(setters.setCustomerValueReviewQueue).catch(() => setters.setCustomerValueReviewQueue([]));
      getApprovedCustomerValueReviews().then(setters.setApprovedCustomerValueReviews).catch(() => setters.setApprovedCustomerValueReviews([]));
      getProTrialInterestSummary().then(setters.setProTrialSummary).catch(() => setters.setProTrialSummary({}));
      getProTrialReviewQueue().then(setters.setProTrialReviewQueue).catch(() => setters.setProTrialReviewQueue([]));
      getApprovedProTrialReviews().then(setters.setApprovedProTrialReviews).catch(() => setters.setApprovedProTrialReviews([]));
      getCreatorRevenueShareSummary().then(setters.setCreatorRevenueShareSummary).catch(() => setters.setCreatorRevenueShareSummary({}));
      getCreatorChallengeTemplateDraftReviewQueue().then(setters.setCreatorTemplateDraftReviewQueue).catch(() => setters.setCreatorTemplateDraftReviewQueue([]));
      getPublishedCreatorChallengeTemplates().then(setters.setPublishedCreatorChallengeTemplates).catch(() => setters.setPublishedCreatorChallengeTemplates([]));
      getCreatorBrandedPageReviewQueue().then(setters.setCreatorBrandedPageReviewQueue).catch(() => setters.setCreatorBrandedPageReviewQueue([]));
      getPublishedCreatorBrandedPages().then(setters.setPublishedCreatorBrandedPages).catch(() => setters.setPublishedCreatorBrandedPages([]));
      getCreatorPrivateInviteLaunchReviewQueue().then(setters.setCreatorPrivateInviteLaunchReviewQueue).catch(() => setters.setCreatorPrivateInviteLaunchReviewQueue([]));
      getApprovedCreatorPrivateInviteLaunches().then(setters.setApprovedCreatorPrivateInviteLaunches).catch(() => setters.setApprovedCreatorPrivateInviteLaunches([]));
      getCreatorPaidHostingLaunchGateReviewQueue().then(setters.setCreatorPaidHostingLaunchGateReviewQueue).catch(() => setters.setCreatorPaidHostingLaunchGateReviewQueue([]));
      getApprovedCreatorPaidHostingLaunchGateReviews().then(setters.setApprovedCreatorPaidHostingLaunchGateReviews).catch(() => setters.setApprovedCreatorPaidHostingLaunchGateReviews([]));
      getCreatorPayoutExceptionReviewQueue().then(setters.setCreatorPayoutExceptionReviewQueue).catch(() => setters.setCreatorPayoutExceptionReviewQueue([]));
      getApprovedCreatorPayoutExceptionReviews().then(setters.setApprovedCreatorPayoutExceptionReviews).catch(() => setters.setApprovedCreatorPayoutExceptionReviews([]));
      getCreatorLeaderboardSnapshotReviewQueue().then(setters.setCreatorLeaderboardSnapshotReviewQueue).catch(() => setters.setCreatorLeaderboardSnapshotReviewQueue([]));
      getPublishedCreatorLeaderboardSnapshots().then(setters.setPublishedCreatorLeaderboardSnapshots).catch(() => setters.setPublishedCreatorLeaderboardSnapshots([]));
      getCreatorHostingApplicationReviewQueue().then(setters.setCreatorHostingApplicationReviewQueue).catch(() => setters.setCreatorHostingApplicationReviewQueue([]));
      getPartnerCampaignApplicationReviewQueue().then(setters.setPartnerCampaignApplicationReviewQueue).catch(() => setters.setPartnerCampaignApplicationReviewQueue([]));
      getPartnerCampaignRetrospectiveReviewQueue().then(setters.setPartnerCampaignRetrospectiveReviewQueue).catch(() => setters.setPartnerCampaignRetrospectiveReviewQueue([]));
      getApprovedPartnerCampaignRetrospectiveReviews().then(setters.setApprovedPartnerCampaignRetrospectiveReviews).catch(() => setters.setApprovedPartnerCampaignRetrospectiveReviews([]));
      getPartnerPerkClaimReviewQueue().then(setters.setPartnerPerkClaimReviewQueue).catch(() => setters.setPartnerPerkClaimReviewQueue([]));
      getPartnerPerkHandoffAuditReviewQueue().then(setters.setPartnerPerkHandoffAuditReviewQueue).catch(() => setters.setPartnerPerkHandoffAuditReviewQueue([]));
      getApprovedPartnerPerkHandoffAuditReviews().then(setters.setApprovedPartnerPerkHandoffAuditReviews).catch(() => setters.setApprovedPartnerPerkHandoffAuditReviews([]));
      getCampaignPerformanceSummary().then(setters.setCampaignPerformanceSummary).catch(() => setters.setCampaignPerformanceSummary({}));
      getLaunchExperimentReviewQueue().then(setters.setLaunchExperimentReviewQueue).catch(() => setters.setLaunchExperimentReviewQueue([]));
      getApprovedLaunchExperimentReviews().then(setters.setApprovedLaunchExperimentReviews).catch(() => setters.setApprovedLaunchExperimentReviews([]));
      getWeeklyCampaignReviewQueue().then(setters.setWeeklyCampaignReviewQueue).catch(() => setters.setWeeklyCampaignReviewQueue([]));
      getApprovedWeeklyCampaignReviews().then(setters.setApprovedWeeklyCampaignReviews).catch(() => setters.setApprovedWeeklyCampaignReviews([]));
    }
  });

  getFeatureSubmissions(userUid).then(setters.setFeatureSubmissions).catch(() => setters.setFeatureSubmissions([]));
  getFeaturedSubmissions().then(setters.setFeaturedSubmissions).catch(() => setters.setFeaturedSubmissions([]));
  getPartnerPerkClaims(userUid).then(setters.setPartnerPerkClaims).catch(() => setters.setPartnerPerkClaims([]));
  setTimeout(() => setters.setVisible(true), 40);
}
