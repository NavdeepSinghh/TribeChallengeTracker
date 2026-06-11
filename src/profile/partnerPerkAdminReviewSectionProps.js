export function buildPartnerPerkAdminReviewSectionProps({
  onPartnerPerkClaimReview,
  partnerPerkClaimReviewQueue,
  partnerPerkDecisionReplyCopy,
  partnerPerkFulfillmentHandoffCopy,
  partnerPerkFulfillmentReadinessCopy,
  partnerPerkHandoffAuditCopy,
  partnerPerkHandoffAuditDecisionReplyCopy,
  partnerPerkSupportEscalationCopy,
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
    partnerPerkHandoffAuditDecisionReplyCopy,
    partnerPerkSupportEscalationCopy,
  };
}
