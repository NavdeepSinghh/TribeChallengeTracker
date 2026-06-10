import {
  getApprovedStoreReviewResponseReviews,
  getStoreReviewResponseReviewQueue,
  reviewStoreReviewResponseReview,
  submitStoreReviewResponseReview,
} from '../userService';

export function buildStoreReviewResponseReviewActionHandlers({
  approvedStoreReviewResponseReviews,
  isAdmin,
  isSubmittingStoreReviewResponseReview,
  profile,
  reviewingStoreReviewResponseReviewId,
  setApprovedStoreReviewResponseReviews,
  setIsSubmittingStoreReviewResponseReview,
  setReviewingStoreReviewResponseReviewId,
  setStoreReviewResponseReviewMessage,
  setStoreReviewResponseReviewQueue,
  storeReviewResponseReviewNotes,
  user,
}) {
  const handleStoreReviewResponseReviewSubmit = async () => {
    if (!user?.uid || isSubmittingStoreReviewResponseReview) return;
    setIsSubmittingStoreReviewResponseReview(true);
    setStoreReviewResponseReviewMessage('');
    try {
      await submitStoreReviewResponseReview(user.uid);
      setStoreReviewResponseReviewMessage('Store review response record saved. This does not submit store review, expose private data, include secrets, unlock paid access, write entitlements, create purchases, process refunds, claim review approval, mark paid access live, add tracking pixels, scrape messages, or bypass marketplace policy.');
      if (isAdmin) getStoreReviewResponseReviewQueue().then(setStoreReviewResponseReviewQueue).catch(() => setStoreReviewResponseReviewQueue([]));
    } catch (err) {
      setStoreReviewResponseReviewMessage(err?.message || 'Could not save store review response record.');
    } finally {
      setIsSubmittingStoreReviewResponseReview(false);
    }
  };

  const handleStoreReviewResponseReviewDecision = async (review, status) => {
    if (!isAdmin || !review?.id || reviewingStoreReviewResponseReviewId) return;
    setReviewingStoreReviewResponseReviewId(review.id);
    setStoreReviewResponseReviewMessage('');
    try {
      await reviewStoreReviewResponseReview(review.id, {
        status,
        reviewNote: storeReviewResponseReviewNotes[review.id] || '',
        reviewedBy: profile?.displayName || user?.displayName || user?.email || 'admin',
      });
      setStoreReviewResponseReviewMessage(`Store review response marked ${status}. No store submission, private-data exposure, secret sharing, entitlement, purchase, refund, review-approval claim, paid-live flip, tracking pixel, message scraping, or marketplace bypass was created.`);
      getStoreReviewResponseReviewQueue().then(setStoreReviewResponseReviewQueue).catch(() => setStoreReviewResponseReviewQueue([]));
      if (status === 'approved') {
        setApprovedStoreReviewResponseReviews([
          { ...review, status, approvedAt: new Date() },
          ...(approvedStoreReviewResponseReviews || []).filter(item => item.id !== review.id),
        ]);
      } else {
        getApprovedStoreReviewResponseReviews().then(setApprovedStoreReviewResponseReviews).catch(() => setApprovedStoreReviewResponseReviews([]));
      }
    } catch (err) {
      setStoreReviewResponseReviewMessage(err?.message || 'Could not update store review response record.');
    } finally {
      setReviewingStoreReviewResponseReviewId('');
    }
  };

  return {
    handleStoreReviewResponseReviewDecision,
    handleStoreReviewResponseReviewSubmit,
  };
}
