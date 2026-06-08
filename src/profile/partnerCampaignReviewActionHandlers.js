import {
  getPartnerCampaignApplicationReviewQueue,
  reviewPartnerCampaignApplication,
} from '../userService';

export function buildPartnerCampaignReviewActionHandlers({
  partnerCampaignApplicationReviewNotes,
  profile,
  reviewingPartnerCampaignApplicationId,
  setPartnerCampaignApplicationMessage,
  setPartnerCampaignApplicationReviewQueue,
  setReviewingPartnerCampaignApplicationId,
  user,
}) {
  const handlePartnerCampaignApplicationReview = async (applicationId, status) => {
    if (reviewingPartnerCampaignApplicationId) return;
    setReviewingPartnerCampaignApplicationId(applicationId);
    try {
      await reviewPartnerCampaignApplication(applicationId, {
        status,
        reviewNote: partnerCampaignApplicationReviewNotes[applicationId] || '',
        reviewedBy: profile?.displayName || user?.email || user?.uid || 'admin',
      });
      setPartnerCampaignApplicationMessage(`Partner campaign application marked ${status}. Manual review note saved without adding partner links, tracking pixels, ad targeting, affiliate payouts, purchases, entitlements, revenue-share, or paid-access claims.`);
      getPartnerCampaignApplicationReviewQueue().then(setPartnerCampaignApplicationReviewQueue).catch(() => setPartnerCampaignApplicationReviewQueue([]));
    } catch (err) {
      setPartnerCampaignApplicationMessage(err?.message || 'Could not update partner campaign application review.');
    } finally {
      setReviewingPartnerCampaignApplicationId('');
    }
  };

  return { handlePartnerCampaignApplicationReview };
}
