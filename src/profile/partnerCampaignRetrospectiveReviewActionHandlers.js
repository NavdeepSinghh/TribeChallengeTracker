import {
  getApprovedPartnerCampaignRetrospectiveReviews,
  getPartnerCampaignRetrospectiveReviewQueue,
  reviewPartnerCampaignRetrospectiveReview,
  submitPartnerCampaignRetrospectiveReview,
} from '../userService';

export function buildPartnerCampaignRetrospectiveReviewActionHandlers({
  approvedPartnerCampaignRetrospectiveReviews,
  isAdmin,
  isSubmittingPartnerCampaignRetrospectiveReview,
  partnerCampaignRetrospectiveReviewNotes,
  profile,
  reviewingPartnerCampaignRetrospectiveReviewId,
  setApprovedPartnerCampaignRetrospectiveReviews,
  setIsSubmittingPartnerCampaignRetrospectiveReview,
  setPartnerCampaignRetrospectiveReviewMessage,
  setPartnerCampaignRetrospectiveReviewQueue,
  setReviewingPartnerCampaignRetrospectiveReviewId,
  user,
}) {
  const handlePartnerCampaignRetrospectiveReviewSubmit = async () => {
    if (!isAdmin || !user?.uid || isSubmittingPartnerCampaignRetrospectiveReview) return;
    setIsSubmittingPartnerCampaignRetrospectiveReview(true);
    setPartnerCampaignRetrospectiveReviewMessage('');
    try {
      await submitPartnerCampaignRetrospectiveReview(user.uid);
      setPartnerCampaignRetrospectiveReviewMessage('Partner campaign retrospective review saved. This does not create partner links, tracking pixels, payouts, coupons, purchases, entitlements, revenue-share, third-party exports, fulfillment promises, auto-messages, scraped messages, or pressure.');
      getPartnerCampaignRetrospectiveReviewQueue().then(setPartnerCampaignRetrospectiveReviewQueue).catch(() => setPartnerCampaignRetrospectiveReviewQueue([]));
    } catch (err) {
      setPartnerCampaignRetrospectiveReviewMessage(err?.message || 'Could not save partner campaign retrospective review.');
    } finally {
      setIsSubmittingPartnerCampaignRetrospectiveReview(false);
    }
  };

  const handlePartnerCampaignRetrospectiveReviewDecision = async (review, status) => {
    if (!isAdmin || !review?.id || reviewingPartnerCampaignRetrospectiveReviewId) return;
    setReviewingPartnerCampaignRetrospectiveReviewId(review.id);
    setPartnerCampaignRetrospectiveReviewMessage('');
    try {
      await reviewPartnerCampaignRetrospectiveReview(review.id, {
        status,
        reviewNote: partnerCampaignRetrospectiveReviewNotes[review.id] || '',
        reviewedBy: profile?.displayName || user?.displayName || user?.email || 'admin',
      });
      setPartnerCampaignRetrospectiveReviewMessage(`Partner campaign retrospective marked ${status}. No partner link, tracking pixel, payout, coupon, purchase, entitlement, revenue-share, third-party export, fulfillment promise, auto-message, scraped message, or pressure was created.`);
      getPartnerCampaignRetrospectiveReviewQueue().then(setPartnerCampaignRetrospectiveReviewQueue).catch(() => setPartnerCampaignRetrospectiveReviewQueue([]));
      if (status === 'approved') {
        setApprovedPartnerCampaignRetrospectiveReviews([
          { ...review, status, approvedAt: new Date() },
          ...(approvedPartnerCampaignRetrospectiveReviews || []).filter(item => item.id !== review.id),
        ]);
      } else {
        getApprovedPartnerCampaignRetrospectiveReviews().then(setApprovedPartnerCampaignRetrospectiveReviews).catch(() => setApprovedPartnerCampaignRetrospectiveReviews([]));
      }
    } catch (err) {
      setPartnerCampaignRetrospectiveReviewMessage(err?.message || 'Could not update partner campaign retrospective review.');
    } finally {
      setReviewingPartnerCampaignRetrospectiveReviewId('');
    }
  };

  return {
    handlePartnerCampaignRetrospectiveReviewDecision,
    handlePartnerCampaignRetrospectiveReviewSubmit,
  };
}
