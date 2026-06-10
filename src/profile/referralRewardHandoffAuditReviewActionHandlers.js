import {
  getApprovedReferralRewardHandoffAuditReviews,
  getReferralRewardHandoffAuditReviewQueue,
  reviewReferralRewardHandoffAuditReview,
  submitReferralRewardHandoffAuditReview,
} from '../userService';

export function buildReferralRewardHandoffAuditReviewActionHandlers({
  approvedReferralRewardHandoffAuditReviews,
  isAdmin,
  isSubmittingReferralRewardHandoffAuditReview,
  profile,
  referralRewardHandoffAuditReviewNotes,
  reviewingReferralRewardHandoffAuditReviewId,
  setApprovedReferralRewardHandoffAuditReviews,
  setIsSubmittingReferralRewardHandoffAuditReview,
  setReferralRewardHandoffAuditReviewMessage,
  setReferralRewardHandoffAuditReviewQueue,
  setReviewingReferralRewardHandoffAuditReviewId,
  user,
}) {
  const handleReferralRewardHandoffAuditReviewSubmit = async () => {
    if (!user?.uid || isSubmittingReferralRewardHandoffAuditReview) return;
    setIsSubmittingReferralRewardHandoffAuditReview(true);
    setReferralRewardHandoffAuditReviewMessage('');
    try {
      await submitReferralRewardHandoffAuditReview(user.uid);
      setReferralRewardHandoffAuditReviewMessage('Referral reward handoff audit review saved. This does not grant Pro, write entitlements, create payouts, purchases, discounts, affiliate rewards, referral state, tracking, fulfillment claims, auto-messages, scraped replies, or pressure.');
      if (isAdmin) getReferralRewardHandoffAuditReviewQueue().then(setReferralRewardHandoffAuditReviewQueue).catch(() => setReferralRewardHandoffAuditReviewQueue([]));
    } catch (err) {
      setReferralRewardHandoffAuditReviewMessage(err?.message || 'Could not save referral reward handoff audit review.');
    } finally {
      setIsSubmittingReferralRewardHandoffAuditReview(false);
    }
  };

  const handleReferralRewardHandoffAuditReviewDecision = async (review, status) => {
    if (!isAdmin || !review?.id || reviewingReferralRewardHandoffAuditReviewId) return;
    setReviewingReferralRewardHandoffAuditReviewId(review.id);
    setReferralRewardHandoffAuditReviewMessage('');
    try {
      await reviewReferralRewardHandoffAuditReview(review.id, {
        status,
        reviewNote: referralRewardHandoffAuditReviewNotes[review.id] || '',
        reviewedBy: profile?.displayName || user?.displayName || user?.email || 'admin',
      });
      setReferralRewardHandoffAuditReviewMessage(`Referral reward handoff audit marked ${status}. No Pro grant, entitlement, payout, purchase, discount, affiliate reward, referral-state write, tracking, fulfillment claim, auto-message, scraped reply, or pressure was created.`);
      getReferralRewardHandoffAuditReviewQueue().then(setReferralRewardHandoffAuditReviewQueue).catch(() => setReferralRewardHandoffAuditReviewQueue([]));
      if (status === 'approved') {
        setApprovedReferralRewardHandoffAuditReviews([
          { ...review, status, approvedAt: new Date() },
          ...(approvedReferralRewardHandoffAuditReviews || []).filter(item => item.id !== review.id),
        ]);
      } else {
        getApprovedReferralRewardHandoffAuditReviews().then(setApprovedReferralRewardHandoffAuditReviews).catch(() => setApprovedReferralRewardHandoffAuditReviews([]));
      }
    } catch (err) {
      setReferralRewardHandoffAuditReviewMessage(err?.message || 'Could not update referral reward handoff audit review.');
    } finally {
      setReviewingReferralRewardHandoffAuditReviewId('');
    }
  };

  return {
    handleReferralRewardHandoffAuditReviewDecision,
    handleReferralRewardHandoffAuditReviewSubmit,
  };
}
