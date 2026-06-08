import { buildPartnerPerkClaimActionHandlers } from './partnerPerkClaimActionHandlers';
import { buildPartnerPerkInterestActionHandlers } from './partnerPerkInterestActionHandlers';

export default function usePartnerPerkActions({
  claimingPartnerPerkId,
  isAdmin,
  partnerPerkReviewNotes,
  profile,
  reviewingPartnerPerkClaimId,
  selectedPartnerPerkIds,
  setClaimingPartnerPerkId,
  setIsSavingPartnerPerks,
  setPartnerPerkClaimMessage,
  setPartnerPerkClaimReviewQueue,
  setPartnerPerkClaims,
  setPartnerPerkMessage,
  setProfile,
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

  return {
    ...partnerPerkClaimHandlers,
    ...partnerPerkInterestHandlers,
  };
}
