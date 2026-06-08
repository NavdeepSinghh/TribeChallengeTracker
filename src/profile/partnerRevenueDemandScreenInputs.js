export function buildPartnerRevenueDemandScreenInputs(screenState) {
  const {
    selectedCommunityEventInterestIds,
    selectedProTrialReasonIds,
    setCommunityEventInterestMessage,
    setIsSavingCommunityEventInterest,
    setIsSavingProTrialInterest,
    setProTrialMessage,
    setSelectedCommunityEventInterestIds,
    setSelectedProTrialReasonIds,
  } = screenState;

  return {
    selectedCommunityEventInterestIds,
    selectedProTrialReasonIds,
    setCommunityEventInterestMessage,
    setIsSavingCommunityEventInterest,
    setIsSavingProTrialInterest,
    setProTrialMessage,
    setSelectedCommunityEventInterestIds,
    setSelectedProTrialReasonIds,
  };
}
