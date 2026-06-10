import {
  getApprovedPartnerPerkHandoffAuditReviews,
  getPartnerPerkHandoffAuditReviewQueue,
  reviewPartnerPerkHandoffAuditReview,
  submitPartnerPerkHandoffAuditReview,
} from '../userService';

export function buildPartnerPerkHandoffAuditReviewActionHandlers({
  approvedPartnerPerkHandoffAuditReviews,
  isAdmin,
  isSubmittingPartnerPerkHandoffAuditReview,
  partnerPerkHandoffAuditReviewNotes,
  profile,
  reviewingPartnerPerkHandoffAuditReviewId,
  setApprovedPartnerPerkHandoffAuditReviews,
  setIsSubmittingPartnerPerkHandoffAuditReview,
  setPartnerPerkHandoffAuditReviewMessage,
  setPartnerPerkHandoffAuditReviewQueue,
  setReviewingPartnerPerkHandoffAuditReviewId,
  user,
}) {
  const handlePartnerPerkHandoffAuditReviewSubmit = async () => {
    if (!user?.uid || isSubmittingPartnerPerkHandoffAuditReview) return;
    setIsSubmittingPartnerPerkHandoffAuditReview(true);
    setPartnerPerkHandoffAuditReviewMessage('');
    try {
      await submitPartnerPerkHandoffAuditReview(user.uid);
      setPartnerPerkHandoffAuditReviewMessage('Partner perk handoff audit review saved. This does not create coupons, partner links, payouts, discounts, purchases, entitlements, tracking, refunds, fulfillment promises, auto-messages, scraped messages, or pressure.');
      if (isAdmin) getPartnerPerkHandoffAuditReviewQueue().then(setPartnerPerkHandoffAuditReviewQueue).catch(() => setPartnerPerkHandoffAuditReviewQueue([]));
    } catch (err) {
      setPartnerPerkHandoffAuditReviewMessage(err?.message || 'Could not save partner perk handoff audit review.');
    } finally {
      setIsSubmittingPartnerPerkHandoffAuditReview(false);
    }
  };

  const handlePartnerPerkHandoffAuditReviewDecision = async (review, status) => {
    if (!isAdmin || !review?.id || reviewingPartnerPerkHandoffAuditReviewId) return;
    setReviewingPartnerPerkHandoffAuditReviewId(review.id);
    setPartnerPerkHandoffAuditReviewMessage('');
    try {
      await reviewPartnerPerkHandoffAuditReview(review.id, {
        status,
        reviewNote: partnerPerkHandoffAuditReviewNotes[review.id] || '',
        reviewedBy: profile?.displayName || user?.displayName || user?.email || 'admin',
      });
      setPartnerPerkHandoffAuditReviewMessage(`Partner perk handoff audit marked ${status}. No coupon, link, payout, discount, purchase, entitlement, tracking, refund, fulfillment promise, auto-message, scraped message, or pressure was created.`);
      getPartnerPerkHandoffAuditReviewQueue().then(setPartnerPerkHandoffAuditReviewQueue).catch(() => setPartnerPerkHandoffAuditReviewQueue([]));
      if (status === 'approved') {
        setApprovedPartnerPerkHandoffAuditReviews([
          { ...review, status, approvedAt: new Date() },
          ...(approvedPartnerPerkHandoffAuditReviews || []).filter(item => item.id !== review.id),
        ]);
      } else {
        getApprovedPartnerPerkHandoffAuditReviews().then(setApprovedPartnerPerkHandoffAuditReviews).catch(() => setApprovedPartnerPerkHandoffAuditReviews([]));
      }
    } catch (err) {
      setPartnerPerkHandoffAuditReviewMessage(err?.message || 'Could not update partner perk handoff audit review.');
    } finally {
      setReviewingPartnerPerkHandoffAuditReviewId('');
    }
  };

  return {
    handlePartnerPerkHandoffAuditReviewDecision,
    handlePartnerPerkHandoffAuditReviewSubmit,
  };
}
