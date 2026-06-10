import {
  getApprovedSupportRefundReadinessReviews,
  getSupportRefundReadinessReviewQueue,
  reviewSupportRefundReadinessReview,
  submitSupportRefundReadinessReview,
} from '../userService';

export function buildSupportRefundReadinessReviewActionHandlers({
  approvedSupportRefundReadinessReviews,
  isAdmin,
  isSubmittingSupportRefundReadinessReview,
  profile,
  reviewingSupportRefundReadinessReviewId,
  setApprovedSupportRefundReadinessReviews,
  setIsSubmittingSupportRefundReadinessReview,
  setReviewingSupportRefundReadinessReviewId,
  setSupportRefundReadinessReviewMessage,
  setSupportRefundReadinessReviewQueue,
  supportRefundReadinessReviewNotes,
  user,
}) {
  const handleSupportRefundReadinessReviewSubmit = async () => {
    if (!user?.uid || isSubmittingSupportRefundReadinessReview) return;
    setIsSubmittingSupportRefundReadinessReview(true);
    setSupportRefundReadinessReviewMessage('');
    try {
      await submitSupportRefundReadinessReview(user.uid);
      setSupportRefundReadinessReviewMessage('Support refund readiness review record saved. This does not process refunds, cancel subscriptions, write entitlements, create purchases, collect payment details, bypass marketplace policy, or mark paid access live.');
      if (isAdmin) getSupportRefundReadinessReviewQueue().then(setSupportRefundReadinessReviewQueue).catch(() => setSupportRefundReadinessReviewQueue([]));
    } catch (err) {
      setSupportRefundReadinessReviewMessage(err?.message || 'Could not save support refund readiness review.');
    } finally {
      setIsSubmittingSupportRefundReadinessReview(false);
    }
  };

  const handleSupportRefundReadinessReviewDecision = async (review, status) => {
    if (!isAdmin || !review?.id || reviewingSupportRefundReadinessReviewId) return;
    setReviewingSupportRefundReadinessReviewId(review.id);
    setSupportRefundReadinessReviewMessage('');
    try {
      await reviewSupportRefundReadinessReview(review.id, {
        status,
        reviewNote: supportRefundReadinessReviewNotes[review.id] || '',
        reviewedBy: profile?.displayName || user?.displayName || user?.email || 'admin',
      });
      setSupportRefundReadinessReviewMessage(`Support refund readiness review marked ${status}. No refund, cancellation, purchase, entitlement, payment-detail, marketplace-bypass, or paid-live action was created.`);
      getSupportRefundReadinessReviewQueue().then(setSupportRefundReadinessReviewQueue).catch(() => setSupportRefundReadinessReviewQueue([]));
      if (status === 'approved') {
        setApprovedSupportRefundReadinessReviews([
          { ...review, status, approvedAt: new Date() },
          ...(approvedSupportRefundReadinessReviews || []).filter(item => item.id !== review.id),
        ]);
      } else {
        getApprovedSupportRefundReadinessReviews().then(setApprovedSupportRefundReadinessReviews).catch(() => setApprovedSupportRefundReadinessReviews([]));
      }
    } catch (err) {
      setSupportRefundReadinessReviewMessage(err?.message || 'Could not update support refund readiness review.');
    } finally {
      setReviewingSupportRefundReadinessReviewId('');
    }
  };

  return {
    handleSupportRefundReadinessReviewDecision,
    handleSupportRefundReadinessReviewSubmit,
  };
}
