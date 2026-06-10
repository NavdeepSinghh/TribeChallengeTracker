import {
  getApprovedCommunityEventReviews,
  getCommunityEventReviewQueue,
  reviewCommunityEventReview,
  submitCommunityEventReview,
} from '../userService';

export function buildCommunityEventReviewActionHandlers({
  approvedCommunityEventReviews,
  communityEventReviewNotes,
  isAdmin,
  isSubmittingCommunityEventReview,
  reviewingCommunityEventReviewId,
  setApprovedCommunityEventReviews,
  setCommunityEventReviewMessage,
  setCommunityEventReviewQueue,
  setIsSubmittingCommunityEventReview,
  setReviewingCommunityEventReviewId,
  user,
}) {
  const handleCommunityEventReviewSubmit = async () => {
    if (!user?.uid || isSubmittingCommunityEventReview) return;
    setIsSubmittingCommunityEventReview(true);
    setCommunityEventReviewMessage('');
    try {
      await submitCommunityEventReview(user.uid);
      setCommunityEventReviewMessage('Community event review record saved for admin review. This creates no tickets, orders, payments, merch promises, venues, partner links, payouts, or entitlements.');
      if (isAdmin) getCommunityEventReviewQueue().then(setCommunityEventReviewQueue).catch(() => {});
    } catch (err) {
      setCommunityEventReviewMessage(err?.message || 'Could not save community event review record.');
    } finally {
      setIsSubmittingCommunityEventReview(false);
    }
  };

  const handleCommunityEventReviewDecision = async (review, status) => {
    if (!review?.id || reviewingCommunityEventReviewId) return;
    setReviewingCommunityEventReviewId(review.id);
    setCommunityEventReviewMessage('');
    try {
      await reviewCommunityEventReview(review.id, {
        status,
        reviewNote: communityEventReviewNotes[review.id] || '',
        reviewedBy: user?.displayName || user?.email || 'admin',
      });
      setCommunityEventReviewMessage(`Community event review marked ${status}. No ticket, order, payment, venue, partner link, payout, or entitlement was created.`);
      getCommunityEventReviewQueue().then(setCommunityEventReviewQueue).catch(() => {});
      if (status === 'approved') {
        setApprovedCommunityEventReviews([
          { ...review, status, approvedAt: new Date() },
          ...(approvedCommunityEventReviews || []).filter(item => item.id !== review.id),
        ]);
      } else {
        getApprovedCommunityEventReviews().then(setApprovedCommunityEventReviews).catch(() => {});
      }
    } catch (err) {
      setCommunityEventReviewMessage(err?.message || 'Could not update community event review.');
    } finally {
      setReviewingCommunityEventReviewId('');
    }
  };

  return {
    handleCommunityEventReviewDecision,
    handleCommunityEventReviewSubmit,
  };
}
