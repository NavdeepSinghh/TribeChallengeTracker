import {
  getApprovedCreatorPayoutExceptionReviews,
  getCreatorPayoutExceptionReviewQueue,
  reviewCreatorPayoutExceptionReview,
  submitCreatorPayoutExceptionReview,
} from '../userService';

export function buildCreatorPayoutExceptionReviewActionHandlers({
  creatorEnabled,
  creatorPayoutExceptionReviewNotes,
  isAdmin,
  isSubmittingCreatorPayoutExceptionReview,
  proActive,
  reviewingCreatorPayoutExceptionReviewId,
  setApprovedCreatorPayoutExceptionReviews,
  setCreatorPayoutExceptionMessage,
  setCreatorPayoutExceptionReviewQueue,
  setIsSubmittingCreatorPayoutExceptionReview,
  setReviewingCreatorPayoutExceptionReviewId,
  user,
}) {
  const handleCreatorPayoutExceptionReviewSubmit = async () => {
    if (!user?.uid || !proActive || !creatorEnabled || isSubmittingCreatorPayoutExceptionReview) {
      setCreatorPayoutExceptionMessage('Enable Pro Creator / Coach Mode before saving payout exception review evidence.');
      return;
    }
    setIsSubmittingCreatorPayoutExceptionReview(true);
    try {
      await submitCreatorPayoutExceptionReview(user.uid);
      setCreatorPayoutExceptionMessage('Creator payout exception review evidence saved for admin review. This is manual evidence only and does not resolve disputes, process refunds, collect tax/bank/payout details, access payout providers, create payouts, move money, create purchases, write entitlements, or bypass marketplace policy.');
      if (isAdmin) {
        getCreatorPayoutExceptionReviewQueue().then(setCreatorPayoutExceptionReviewQueue).catch(() => {});
      }
    } catch (err) {
      setCreatorPayoutExceptionMessage(err?.message || 'Could not save creator payout exception review evidence.');
    } finally {
      setIsSubmittingCreatorPayoutExceptionReview(false);
    }
  };

  const handleCreatorPayoutExceptionReview = async (review, status) => {
    if (!isAdmin || !review?.id || reviewingCreatorPayoutExceptionReviewId) return;
    setReviewingCreatorPayoutExceptionReviewId(review.id);
    try {
      await reviewCreatorPayoutExceptionReview(review.id, {
        status,
        reviewNote: creatorPayoutExceptionReviewNotes[review.id] || '',
        reviewedBy: user?.displayName || user?.email || 'admin',
      });
      setCreatorPayoutExceptionMessage(`Creator payout exception review marked ${status}. No dispute resolution, refund, tax collection, bank collection, payout provider access, payout, money movement, purchase, entitlement, tax advice, or marketplace bypass was created.`);
      getCreatorPayoutExceptionReviewQueue().then(setCreatorPayoutExceptionReviewQueue).catch(() => {});
      getApprovedCreatorPayoutExceptionReviews().then(setApprovedCreatorPayoutExceptionReviews).catch(() => {});
    } catch (err) {
      setCreatorPayoutExceptionMessage(err?.message || 'Could not update creator payout exception review.');
    } finally {
      setReviewingCreatorPayoutExceptionReviewId('');
    }
  };

  return {
    handleCreatorPayoutExceptionReview,
    handleCreatorPayoutExceptionReviewSubmit,
  };
}
