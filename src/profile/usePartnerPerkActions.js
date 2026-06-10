import { buildPartnerPerkClaimActionHandlers } from './partnerPerkClaimActionHandlers';
import { buildPartnerPerkHandoffAuditReviewActionHandlers } from './partnerPerkHandoffAuditReviewActionHandlers';
import { buildPartnerPerkInterestActionHandlers } from './partnerPerkInterestActionHandlers';

export default function usePartnerPerkActions({
  approvedPartnerPerkHandoffAuditReviews,
  claimingPartnerPerkId,
  isAdmin,
  isSubmittingPartnerPerkHandoffAuditReview,
  partnerPerkHandoffAuditReviewNotes,
  partnerPerkReviewNotes,
  profile,
  reviewingPartnerPerkHandoffAuditReviewId,
  reviewingPartnerPerkClaimId,
  selectedPartnerPerkIds,
  setClaimingPartnerPerkId,
  setApprovedPartnerPerkHandoffAuditReviews,
  setIsSubmittingPartnerPerkHandoffAuditReview,
  setIsSavingPartnerPerks,
  setPartnerPerkHandoffAuditReviewMessage,
  setPartnerPerkHandoffAuditReviewQueue,
  setPartnerPerkClaimMessage,
  setPartnerPerkClaimReviewQueue,
  setPartnerPerkClaims,
  setPartnerPerkMessage,
  setProfile,
  setReviewingPartnerPerkHandoffAuditReviewId,
  setReviewingPartnerPerkClaimId,
  setSelectedPartnerPerkIds,
  user,
  onProfileUpdated,
}) {
  const partnerPerkClaimHandlers = buildPartnerPerkClaimActionHandlers({
    claimingPartnerPerkId,
    isAdmin,
    partnerPerkReviewNotes,
    profile,
    reviewingPartnerPerkClaimId,
    setClaimingPartnerPerkId,
    setPartnerPerkClaimMessage,
    setPartnerPerkClaimReviewQueue,
    setPartnerPerkClaims,
    setReviewingPartnerPerkClaimId,
    user,
  });

  const partnerPerkInterestHandlers = buildPartnerPerkInterestActionHandlers({
    profile,
    selectedPartnerPerkIds,
    setIsSavingPartnerPerks,
    setPartnerPerkMessage,
    setProfile,
    setSelectedPartnerPerkIds,
    user,
    onProfileUpdated,
  });

  const partnerPerkHandoffAuditReviewHandlers = buildPartnerPerkHandoffAuditReviewActionHandlers({
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
  });

  return {
    ...partnerPerkClaimHandlers,
    ...partnerPerkHandoffAuditReviewHandlers,
    ...partnerPerkInterestHandlers,
  };
}
