import { getUserChallenges } from '../challengeService';
import {
  getAccountDeletionReviewQueue,
  getCampaignPerformanceSummary,
  getCommunityEventInterestSummary,
  getCreatorChallengeTemplateDraftReviewQueue,
  getCreatorBrandedPageReviewQueue,
  getCreatorHostingApplicationReviewQueue,
  getCreatorLeaderboardSnapshotReviewQueue,
  getCreatorPrivateInviteLaunchReviewQueue,
  getCreatorPaidHostingLaunchGateReviewQueue,
  getCreatorRevenueShareSummary,
  getEntitlementRecoveryReviewQueue,
  getFeaturedSubmissions,
  getFeatureReviewQueue,
  getFeatureSubmissions,
  getApprovedLaunchExperimentReviews,
  getApprovedProTrialReviews,
  getApprovedWeeklyCampaignReviews,
  getLaunchExperimentReviewQueue,
  getProTrialReviewQueue,
  getWeeklyCampaignReviewQueue,
  getPartnerCampaignApplicationReviewQueue,
  getPartnerPerkClaimReviewQueue,
  getPartnerPerkClaims,
  getPartnerPerkInterestSummary,
  getPublishedCreatorChallengeTemplates,
  getPublishedCreatorBrandedPages,
  getPublishedCreatorLeaderboardSnapshots,
  getApprovedCreatorPrivateInviteLaunches,
  getApprovedCreatorPaidHostingLaunchGateReviews,
  getProTrialInterestSummary,
  getReferralRewardReviewQueue,
  getStoreTestPurchaseEvidenceLog,
  getSupportReviewQueue,
  getUserChallengePoints,
  getUserProfile,
} from '../userService';

export function loadProfileScreenData(userUid, setters) {
  getUserProfile(userUid).then(profile => {
    setters.setProfile(profile);
    setters.setInstagramHandle(profile?.instagramHandle || '');
    setters.setGoalActiveDays(profile?.goals?.weeklyActiveDaysTarget || 5);
    setters.setGoalPoints(profile?.goals?.weeklyPointsTarget || 250);
    setters.setGoalStreak(profile?.goals?.streakTarget || 30);
    setters.setSelectedFrameId(profile?.cosmetics?.profileFrameId || 'none');
    setters.setCreatorEnabled(profile?.creatorProfile?.enabled || false);
    setters.setCreatorSpecialty(profile?.creatorProfile?.specialty || '');
    setters.setCreatorBio(profile?.creatorProfile?.bio || '');
    setters.setCreatorCtaUrl(profile?.creatorProfile?.ctaUrl || '');
    setters.setCreatorRevenueShareInterest(profile?.creatorProfile?.revenueShareInterest || false);
    setters.setSelectedPartnerPerkIds(profile?.partnerPerkInterest?.selectedIds || []);
    setters.setSelectedCommunityEventInterestIds(profile?.communityEventInterest?.selectedIds || []);
    setters.setSelectedProTrialReasonIds(profile?.proTrialInterest?.selectedIds || []);

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
      getReferralRewardReviewQueue().then(setters.setReferralRewardReviewQueue).catch(() => setters.setReferralRewardReviewQueue([]));
      getPartnerPerkInterestSummary().then(setters.setPartnerPerkSummary).catch(() => setters.setPartnerPerkSummary({}));
      getCommunityEventInterestSummary().then(setters.setCommunityEventInterestSummary).catch(() => setters.setCommunityEventInterestSummary({}));
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
      getCreatorLeaderboardSnapshotReviewQueue().then(setters.setCreatorLeaderboardSnapshotReviewQueue).catch(() => setters.setCreatorLeaderboardSnapshotReviewQueue([]));
      getPublishedCreatorLeaderboardSnapshots().then(setters.setPublishedCreatorLeaderboardSnapshots).catch(() => setters.setPublishedCreatorLeaderboardSnapshots([]));
      getCreatorHostingApplicationReviewQueue().then(setters.setCreatorHostingApplicationReviewQueue).catch(() => setters.setCreatorHostingApplicationReviewQueue([]));
      getPartnerCampaignApplicationReviewQueue().then(setters.setPartnerCampaignApplicationReviewQueue).catch(() => setters.setPartnerCampaignApplicationReviewQueue([]));
      getPartnerPerkClaimReviewQueue().then(setters.setPartnerPerkClaimReviewQueue).catch(() => setters.setPartnerPerkClaimReviewQueue([]));
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
