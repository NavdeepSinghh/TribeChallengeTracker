export function buildPartnerPerksMemberProps({
  claimingPartnerPerkId,
  handlePartnerPerkClaim,
  handlePartnerPerkToggle,
  isSavingPartnerPerks,
  partnerPerkClaimMessage,
  partnerPerkClaims,
  partnerPerkMessage,
  partnerPerkStats,
  selectedPartnerPerkIds,
}) {
  return {
    selectedPartnerPerkIds,
    partnerPerkStats,
    isSavingPartnerPerks,
    onPartnerPerkToggle: handlePartnerPerkToggle,
    claimingPartnerPerkId,
    onPartnerPerkClaim: handlePartnerPerkClaim,
    partnerPerkMessage,
    partnerPerkClaimMessage,
    partnerPerkClaims,
  };
}
