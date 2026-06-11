export function buildPartnerCampaignRetrospectiveReviewCardProps({
  approvedPartnerCampaignRetrospectiveReviews,
  handlePartnerCampaignRetrospectiveReviewDecision,
  handlePartnerCampaignRetrospectiveReviewSubmit,
  isSubmittingPartnerCampaignRetrospectiveReview,
  partnerCampaignRetrospectiveReviewMessage,
  partnerCampaignRetrospectiveReviewNotes,
  partnerCampaignRetrospectiveReviewQueue,
  reviewingPartnerCampaignRetrospectiveReviewId,
  setPartnerCampaignRetrospectiveReviewNotes,
}) {
  return {
    approvedPartnerCampaignRetrospectiveReviews,
    isSubmittingPartnerCampaignRetrospectiveReview,
    onDecision: handlePartnerCampaignRetrospectiveReviewDecision,
    onSubmit: handlePartnerCampaignRetrospectiveReviewSubmit,
    partnerCampaignRetrospectiveReviewMessage,
    partnerCampaignRetrospectiveReviewNotes,
    partnerCampaignRetrospectiveReviewQueue,
    reviewingPartnerCampaignRetrospectiveReviewId,
    setPartnerCampaignRetrospectiveReviewNotes,
  };
}
