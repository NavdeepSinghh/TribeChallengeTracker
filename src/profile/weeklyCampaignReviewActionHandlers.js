import {
  getApprovedWeeklyCampaignReviews,
  getWeeklyCampaignReviewQueue,
  reviewWeeklyCampaignReview,
  submitWeeklyCampaignReview,
} from '../userService';

export function buildWeeklyCampaignReviewActionHandlers({
  approvedWeeklyCampaignReviews,
  campaignPerformanceSummary,
  featureReviewQueue,
  isAdmin,
  isSubmittingWeeklyCampaignReview,
  recommendedLaunchExperiment,
  referralJoins,
  reviewingWeeklyCampaignReviewId,
  setApprovedWeeklyCampaignReviews,
  setIsSubmittingWeeklyCampaignReview,
  setReviewingWeeklyCampaignReviewId,
  setWeeklyCampaignReviewMessage,
  setWeeklyCampaignReviewQueue,
  supportReviewQueue,
  user,
  weeklyCampaignPrompt,
  weeklyCampaignReviewNotes,
}) {
  const handleWeeklyCampaignReviewSubmit = async () => {
    if (!user?.uid || isSubmittingWeeklyCampaignReview) return;
    setIsSubmittingWeeklyCampaignReview(true);
    try {
      await submitWeeklyCampaignReview(user.uid, {
        activeCampaignCount: campaignPerformanceSummary?.activeCampaigns || 0,
        campaignReach: campaignPerformanceSummary?.memberReach || 0,
        featureSubmissionCount: featureReviewQueue?.length || 0,
        recommendedExperimentLabel: recommendedLaunchExperiment?.label || 'Pro Trial CTA',
        referralJoins,
        supportRiskCount: supportReviewQueue?.length || 0,
        weeklyCampaignPrompt,
      });
      setWeeklyCampaignReviewMessage('Weekly campaign review record saved for admin review. This uses first-party app signals only and creates no attribution records, tracking pixels, auto-posting, scraped DMs, purchases, entitlements, or paid-access changes.');
      if (isAdmin) {
        getWeeklyCampaignReviewQueue().then(setWeeklyCampaignReviewQueue).catch(() => {});
      }
    } catch (err) {
      setWeeklyCampaignReviewMessage(err?.message || 'Could not save weekly campaign review record.');
    } finally {
      setIsSubmittingWeeklyCampaignReview(false);
    }
  };

  const handleWeeklyCampaignReviewDecision = async (review, status) => {
    if (!isAdmin || !review?.id || reviewingWeeklyCampaignReviewId) return;
    setReviewingWeeklyCampaignReviewId(review.id);
    try {
      await reviewWeeklyCampaignReview(review.id, {
        status,
        reviewNote: weeklyCampaignReviewNotes[review.id] || '',
        reviewedBy: user?.email || user?.uid || 'admin',
      });
      setWeeklyCampaignReviewMessage(`Weekly campaign review marked ${status}. No attribution records, tracking pixels, auto-posting, scraped DMs, purchases, entitlements, or paid-access changes were created.`);
      getWeeklyCampaignReviewQueue().then(setWeeklyCampaignReviewQueue).catch(() => {});
      getApprovedWeeklyCampaignReviews().then(setApprovedWeeklyCampaignReviews).catch(() => {});
    } catch (err) {
      setWeeklyCampaignReviewMessage(err?.message || 'Could not update weekly campaign review.');
    } finally {
      setReviewingWeeklyCampaignReviewId('');
    }
  };

  return {
    approvedWeeklyCampaignReviewCount: approvedWeeklyCampaignReviews?.length || 0,
    handleWeeklyCampaignReviewDecision,
    handleWeeklyCampaignReviewSubmit,
  };
}
