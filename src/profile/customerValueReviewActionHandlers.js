import {
  getApprovedCustomerValueReviews,
  getCustomerValueReviewQueue,
  reviewCustomerValueReview,
  submitCustomerValueReview,
} from '../userService';

export function buildCustomerValueReviewActionHandlers({
  approvedCustomerValueReviews,
  customerValueReviewNotes,
  isAdmin,
  isSubmittingCustomerValueReview,
  reviewingCustomerValueReviewId,
  setApprovedCustomerValueReviews,
  setCustomerValueReviewMessage,
  setCustomerValueReviewQueue,
  setIsSubmittingCustomerValueReview,
  setReviewingCustomerValueReviewId,
  user,
}) {
  const handleCustomerValueReviewSubmit = async () => {
    if (!user?.uid || isSubmittingCustomerValueReview) return;
    setIsSubmittingCustomerValueReview(true);
    setCustomerValueReviewMessage('');
    try {
      await submitCustomerValueReview(user.uid);
      setCustomerValueReviewMessage('Customer value review record saved for admin review. This does not charge users, unlock paid access, create discounts, write entitlements, or promote paid features as live.');
      if (isAdmin) getCustomerValueReviewQueue().then(setCustomerValueReviewQueue).catch(() => {});
    } catch (err) {
      setCustomerValueReviewMessage(err?.message || 'Could not save customer value review record.');
    } finally {
      setIsSubmittingCustomerValueReview(false);
    }
  };

  const handleCustomerValueReviewDecision = async (review, status) => {
    if (!review?.id || reviewingCustomerValueReviewId) return;
    setReviewingCustomerValueReviewId(review.id);
    setCustomerValueReviewMessage('');
    try {
      await reviewCustomerValueReview(review.id, {
        status,
        reviewNote: customerValueReviewNotes[review.id] || '',
        reviewedBy: user?.displayName || user?.email || 'admin',
      });
      setCustomerValueReviewMessage(`Customer value review marked ${status}. No charge, paid-access unlock, discount, entitlement write, or paid-live promotion was created.`);
      getCustomerValueReviewQueue().then(setCustomerValueReviewQueue).catch(() => {});
      if (status === 'approved') {
        setApprovedCustomerValueReviews([
          { ...review, status, approvedAt: new Date() },
          ...(approvedCustomerValueReviews || []).filter(item => item.id !== review.id),
        ]);
      } else {
        getApprovedCustomerValueReviews().then(setApprovedCustomerValueReviews).catch(() => {});
      }
    } catch (err) {
      setCustomerValueReviewMessage(err?.message || 'Could not update customer value review.');
    } finally {
      setReviewingCustomerValueReviewId('');
    }
  };

  return {
    handleCustomerValueReviewDecision,
    handleCustomerValueReviewSubmit,
  };
}
