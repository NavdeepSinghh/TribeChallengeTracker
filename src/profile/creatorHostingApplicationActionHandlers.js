import {
  getCreatorHostingApplicationReviewQueue,
  reviewCreatorHostingApplication,
  submitCreatorHostingApplication,
} from '../userService';

export function buildCreatorHostingApplicationActionHandlers({
  creatorAnalytics,
  creatorEnabled,
  creatorHostingApplicationReviewNotes,
  creatorRevenueShareInterest,
  isAdmin,
  isSubmittingCreatorHostingApplication,
  proActive,
  profile,
  reviewingCreatorHostingApplicationId,
  setCreatorHostingApplicationMessage,
  setCreatorHostingApplicationReviewQueue,
  setIsSubmittingCreatorHostingApplication,
  setReviewingCreatorHostingApplicationId,
  user,
}) {
  const handleCreatorHostingApplication = async () => {
    if (isSubmittingCreatorHostingApplication) return;
    setCreatorHostingApplicationMessage('');
    if (!proActive || !creatorEnabled) {
      setCreatorHostingApplicationMessage('Enable Pro Creator / Coach Mode before applying for hosted review.');
      return;
    }
    setIsSubmittingCreatorHostingApplication(true);
    try {
      await submitCreatorHostingApplication(user.uid, {
        hostedCount: creatorAnalytics.hosted,
        memberReach: creatorAnalytics.members,
        revenueReadyCount: creatorAnalytics.revenueReady,
        revenueShareInterest: creatorRevenueShareInterest,
      });
      setCreatorHostingApplicationMessage('Creator hosting application sent for admin review. This does not create contracts, payouts, purchases, entitlements, or paid-access claims.');
      if (isAdmin) {
        getCreatorHostingApplicationReviewQueue().then(setCreatorHostingApplicationReviewQueue).catch(() => setCreatorHostingApplicationReviewQueue([]));
      }
    } catch (err) {
      setCreatorHostingApplicationMessage(err?.message || 'Could not send creator hosting application.');
    } finally {
      setIsSubmittingCreatorHostingApplication(false);
    }
  };

  const handleCreatorHostingApplicationReview = async (applicationId, status) => {
    if (reviewingCreatorHostingApplicationId) return;
    setReviewingCreatorHostingApplicationId(applicationId);
    try {
      await reviewCreatorHostingApplication(applicationId, {
        status,
        reviewNote: creatorHostingApplicationReviewNotes[applicationId] || '',
        reviewedBy: profile?.displayName || user?.email || user?.uid || 'admin',
      });
      setCreatorHostingApplicationMessage(`Creator hosting application marked ${status}. Manual review note saved without creating contracts, payouts, purchases, entitlements, revenue-share, or paid-access claims.`);
      getCreatorHostingApplicationReviewQueue().then(setCreatorHostingApplicationReviewQueue).catch(() => setCreatorHostingApplicationReviewQueue([]));
    } catch (err) {
      setCreatorHostingApplicationMessage(err?.message || 'Could not update creator hosting application review.');
    } finally {
      setReviewingCreatorHostingApplicationId('');
    }
  };

  return {
    handleCreatorHostingApplication,
    handleCreatorHostingApplicationReview,
  };
}
