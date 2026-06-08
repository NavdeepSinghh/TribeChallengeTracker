import { buildPartnerCampaignApplicationActionHandlers } from './partnerCampaignApplicationActionHandlers';
import { buildPartnerCampaignReviewActionHandlers } from './partnerCampaignReviewActionHandlers';

export default function usePartnerCampaignActions({
  applicationPartnerPerk,
  applicationPartnerSignalCount,
  campaignPerformanceSummary,
  isAdmin,
  isSubmittingPartnerCampaignApplication,
  partnerCampaignApplicationReviewNotes,
  partnerCampaignApplicationSignalTotal,
  profile,
  referralJoins,
  reviewingPartnerCampaignApplicationId,
  setIsSubmittingPartnerCampaignApplication,
  setPartnerCampaignApplicationMessage,
  setPartnerCampaignApplicationReviewQueue,
  setReviewingPartnerCampaignApplicationId,
  user,
}) {
  const applicationHandlers = buildPartnerCampaignApplicationActionHandlers({
    applicationPartnerPerk,
    applicationPartnerSignalCount,
    campaignPerformanceSummary,
    isAdmin,
    isSubmittingPartnerCampaignApplication,
    partnerCampaignApplicationSignalTotal,
    referralJoins,
    setIsSubmittingPartnerCampaignApplication,
    setPartnerCampaignApplicationMessage,
    setPartnerCampaignApplicationReviewQueue,
    user,
  });
  const reviewHandlers = buildPartnerCampaignReviewActionHandlers({
    partnerCampaignApplicationReviewNotes,
    profile,
    reviewingPartnerCampaignApplicationId,
    setPartnerCampaignApplicationMessage,
    setPartnerCampaignApplicationReviewQueue,
    setReviewingPartnerCampaignApplicationId,
    user,
  });

  return {
    ...applicationHandlers,
    ...reviewHandlers,
  };
}
