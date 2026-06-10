import {
  getApprovedLaunchExperimentReviews,
  getLaunchExperimentReviewQueue,
  reviewLaunchExperimentReview,
  submitLaunchExperimentReview,
} from '../userService';

export function buildLaunchExperimentReviewActionHandlers({
  isAdmin,
  isSubmittingLaunchExperimentReview,
  launchExperimentReviewNotes,
  reviewingLaunchExperimentReviewId,
  setApprovedLaunchExperimentReviews,
  setIsSubmittingLaunchExperimentReview,
  setLaunchExperimentReviewMessage,
  setLaunchExperimentReviewQueue,
  setReviewingLaunchExperimentReviewId,
  user,
}) {
  const handleLaunchExperimentReviewSubmit = async () => {
    if (!user?.uid || isSubmittingLaunchExperimentReview) return;
    setIsSubmittingLaunchExperimentReview(true);
    try {
      await submitLaunchExperimentReview(user.uid);
      setLaunchExperimentReviewMessage('Launch experiment review record saved for admin review. This uses first-party app signals only and creates no attribution records, tracking pixels, purchases, entitlements, or paid-access changes.');
      if (isAdmin) {
        getLaunchExperimentReviewQueue().then(setLaunchExperimentReviewQueue).catch(() => {});
      }
    } catch (err) {
      setLaunchExperimentReviewMessage(err?.message || 'Could not save launch experiment review record.');
    } finally {
      setIsSubmittingLaunchExperimentReview(false);
    }
  };

  const handleLaunchExperimentReviewDecision = async (review, status) => {
    if (!isAdmin || !review?.id || reviewingLaunchExperimentReviewId) return;
    setReviewingLaunchExperimentReviewId(review.id);
    try {
      await reviewLaunchExperimentReview(review.id, {
        status,
        reviewNote: launchExperimentReviewNotes[review.id] || '',
        reviewedBy: user?.email || user?.uid || 'admin',
      });
      setLaunchExperimentReviewMessage(`Launch experiment review marked ${status}. No attribution records, tracking pixels, purchases, entitlements, or paid-access changes were created.`);
      getLaunchExperimentReviewQueue().then(setLaunchExperimentReviewQueue).catch(() => {});
      getApprovedLaunchExperimentReviews().then(setApprovedLaunchExperimentReviews).catch(() => {});
    } catch (err) {
      setLaunchExperimentReviewMessage(err?.message || 'Could not update launch experiment review.');
    } finally {
      setReviewingLaunchExperimentReviewId('');
    }
  };

  return {
    handleLaunchExperimentReviewDecision,
    handleLaunchExperimentReviewSubmit,
  };
}
