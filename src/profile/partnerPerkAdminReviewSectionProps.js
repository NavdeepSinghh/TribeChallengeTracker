export function buildPartnerPerkAdminReviewSectionProps({
  onPartnerPerkClaimReview,
  partnerPerkClaimReviewQueue,
  partnerPerkDecisionReplyCopy,
  partnerPerkFulfillmentHandoffCopy,
  partnerPerkFulfillmentReadinessCopy,
  partnerPerkHandoffAuditCopy,
  partnerPerkReviewNotes,
  reviewingPartnerPerkClaimId,
  setPartnerPerkReviewNotes,
}) {
  return {
    partnerPerkClaimReviewQueue,
    partnerPerkReviewNotes,
    setPartnerPerkReviewNotes,
    reviewingPartnerPerkClaimId,
    onPartnerPerkClaimReview,
    partnerPerkDecisionReplyCopy,
    partnerPerkFulfillmentReadinessCopy,
    partnerPerkFulfillmentHandoffCopy,
    partnerPerkHandoffAuditCopy,
  };
}
