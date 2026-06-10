import {
  getApprovedPaidLaunchDecisionReviews,
  getPaidLaunchDecisionReviewQueue,
  reviewPaidLaunchDecisionReview,
  submitPaidLaunchDecisionReview,
} from '../userService';

export function buildPaidLaunchDecisionReviewActionHandlers({
  approvedPaidLaunchDecisionReviews,
  isAdmin,
  isSubmittingPaidLaunchDecisionReview,
  paidLaunchDecisionReviewNotes,
  profile,
  reviewingPaidLaunchDecisionReviewId,
  setApprovedPaidLaunchDecisionReviews,
  setIsSubmittingPaidLaunchDecisionReview,
  setPaidLaunchDecisionReviewMessage,
  setPaidLaunchDecisionReviewQueue,
  setReviewingPaidLaunchDecisionReviewId,
  user,
}) {
  const handlePaidLaunchDecisionReviewSubmit = async () => {
    if (!user?.uid || isSubmittingPaidLaunchDecisionReview) return;
    setIsSubmittingPaidLaunchDecisionReview(true);
    setPaidLaunchDecisionReviewMessage('');
    try {
      await submitPaidLaunchDecisionReview(user.uid);
      setPaidLaunchDecisionReviewMessage('Paid launch decision review saved. This does not flip paid access live, write entitlements, create purchases, process payments or refunds, submit store review, claim launch readiness, or bypass marketplace policy.');
      if (isAdmin) getPaidLaunchDecisionReviewQueue().then(setPaidLaunchDecisionReviewQueue).catch(() => setPaidLaunchDecisionReviewQueue([]));
    } catch (err) {
      setPaidLaunchDecisionReviewMessage(err?.message || 'Could not save paid launch decision review.');
    } finally {
      setIsSubmittingPaidLaunchDecisionReview(false);
    }
  };

  const handlePaidLaunchDecisionReviewDecision = async (review, status) => {
    if (!isAdmin || !review?.id || reviewingPaidLaunchDecisionReviewId) return;
    setReviewingPaidLaunchDecisionReviewId(review.id);
    setPaidLaunchDecisionReviewMessage('');
    try {
      await reviewPaidLaunchDecisionReview(review.id, {
        status,
        reviewNote: paidLaunchDecisionReviewNotes[review.id] || '',
        reviewedBy: profile?.displayName || user?.displayName || user?.email || 'admin',
      });
      setPaidLaunchDecisionReviewMessage(`Paid launch decision marked ${status}. No paid-live flip, entitlement write, purchase, payment, refund, store submission, launch-readiness claim, tracking, scraping, or marketplace bypass was created.`);
      getPaidLaunchDecisionReviewQueue().then(setPaidLaunchDecisionReviewQueue).catch(() => setPaidLaunchDecisionReviewQueue([]));
      if (status === 'approved') {
        setApprovedPaidLaunchDecisionReviews([
          { ...review, status, approvedAt: new Date() },
          ...(approvedPaidLaunchDecisionReviews || []).filter(item => item.id !== review.id),
        ]);
      } else {
        getApprovedPaidLaunchDecisionReviews().then(setApprovedPaidLaunchDecisionReviews).catch(() => setApprovedPaidLaunchDecisionReviews([]));
      }
    } catch (err) {
      setPaidLaunchDecisionReviewMessage(err?.message || 'Could not update paid launch decision review.');
    } finally {
      setReviewingPaidLaunchDecisionReviewId('');
    }
  };

  return {
    handlePaidLaunchDecisionReviewDecision,
    handlePaidLaunchDecisionReviewSubmit,
  };
}
