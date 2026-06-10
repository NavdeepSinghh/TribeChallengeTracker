import {
  getApprovedProTrialReviews,
  getProTrialReviewQueue,
  reviewProTrialReview,
  submitProTrialReview,
} from '../userService';

export function buildProTrialReviewActionHandlers({
  approvedProTrialReviews,
  isAdmin,
  isSubmittingProTrialReview,
  proTrialReviewNotes,
  reviewingProTrialReviewId,
  setApprovedProTrialReviews,
  setIsSubmittingProTrialReview,
  setProTrialReviewMessage,
  setProTrialReviewQueue,
  setReviewingProTrialReviewId,
  user,
}) {
  const handleProTrialReviewSubmit = async () => {
    if (!user?.uid || isSubmittingProTrialReview) return;
    setIsSubmittingProTrialReview(true);
    setProTrialReviewMessage('');
    try {
      await submitProTrialReview(user.uid);
      setProTrialReviewMessage('Pro trial review record saved for admin review. This does not start trials, create purchases, write entitlements, or change paid access.');
      if (isAdmin) {
        getProTrialReviewQueue().then(setProTrialReviewQueue).catch(() => {});
      }
    } catch (err) {
      setProTrialReviewMessage(err?.message || 'Could not save Pro trial review record.');
    } finally {
      setIsSubmittingProTrialReview(false);
    }
  };

  const handleProTrialReviewDecision = async (review, status) => {
    if (!review?.id || reviewingProTrialReviewId) return;
    setReviewingProTrialReviewId(review.id);
    setProTrialReviewMessage('');
    try {
      await reviewProTrialReview(review.id, {
        status,
        reviewNote: proTrialReviewNotes[review.id] || '',
        reviewedBy: user?.displayName || user?.email || 'admin',
      });
      setProTrialReviewMessage(`Pro trial review marked ${status}. No trial, purchase, entitlement, or paid-access change was created.`);
      getProTrialReviewQueue().then(setProTrialReviewQueue).catch(() => {});
      if (status === 'approved') {
        setApprovedProTrialReviews([
          { ...review, status, approvedAt: new Date() },
          ...(approvedProTrialReviews || []).filter(item => item.id !== review.id),
        ]);
      } else {
        getApprovedProTrialReviews().then(setApprovedProTrialReviews).catch(() => {});
      }
    } catch (err) {
      setProTrialReviewMessage(err?.message || 'Could not update Pro trial review.');
    } finally {
      setReviewingProTrialReviewId('');
    }
  };

  return {
    handleProTrialReviewDecision,
    handleProTrialReviewSubmit,
  };
}
