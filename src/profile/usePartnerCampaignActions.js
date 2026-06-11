import { buildPartnerCampaignApplicationActionHandlers } from './partnerCampaignApplicationActionHandlers';
import { buildPartnerCampaignRetrospectiveReviewActionHandlers } from './partnerCampaignRetrospectiveReviewActionHandlers';
import { buildPartnerCampaignReviewActionHandlers } from './partnerCampaignReviewActionHandlers';

export default function usePartnerCampaignActions({
  approvedPartnerCampaignRetrospectiveReviews,
  applicationPartnerPerk,
  applicationPartnerSignalCount,
  campaignPerformanceSummary,
  isAdmin,
  isSubmittingPartnerCampaignApplication,
  isSubmittingPartnerCampaignRetrospectiveReview,
  partnerCampaignApplicationReviewNotes,
  partnerCampaignRetrospectiveReviewNotes,
  partnerCampaignApplicationSignalTotal,
  profile,
  referralJoins,
  reviewingPartnerCampaignApplicationId,
  reviewingPartnerCampaignRetrospectiveReviewId,
  setApprovedPartnerCampaignRetrospectiveReviews,
  setIsSubmittingPartnerCampaignApplication,
  setIsSubmittingPartnerCampaignRetrospectiveReview,
  setPartnerCampaignApplicationMessage,
  setPartnerCampaignApplicationReviewQueue,
  setPartnerCampaignRetrospectiveReviewMessage,
  setPartnerCampaignRetrospectiveReviewQueue,
  setReviewingPartnerCampaignApplicationId,
  setReviewingPartnerCampaignRetrospectiveReviewId,
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
  const retrospectiveReviewHandlers = buildPartnerCampaignRetrospectiveReviewActionHandlers({
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
  });

  return {
    ...applicationHandlers,
    ...retrospectiveReviewHandlers,
    ...reviewHandlers,
  };
}
