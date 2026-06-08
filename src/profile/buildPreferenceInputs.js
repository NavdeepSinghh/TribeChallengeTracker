export function buildPreferenceInputs({
  computedData,
  myHistory,
  onHistoryUpdated,
  onProfileUpdated,
  screenState,
  user,
}) {
  const {
    avatarColor,
    avatarEmoji,
    proActive,
    yesterdayKey,
    yesterdayRecovered,
  } = computedData;

  const {
    goalActiveDays,
    goalPoints,
    goalStreak,
    profile,
    selectedFrameId,
    setAppearanceError,
    setCosmeticsMessage,
    setGoalsMessage,
    setIsSavingAppearance,
    setIsSavingCosmetics,
    setIsSavingGoals,
    setIsSavingRecovery,
    setProfile,
    setRecoveryMessage,
  } = screenState;

  return {
    avatarColor,
    avatarEmoji,
    goalActiveDays,
    goalPoints,
    goalStreak,
    myHistory,
    profile,
    proActive,
    selectedFrameId,
    setAppearanceError,
    setCosmeticsMessage,
    setGoalsMessage,
    setIsSavingAppearance,
    setIsSavingCosmetics,
    setIsSavingGoals,
    setIsSavingRecovery,
    setProfile,
    setRecoveryMessage,
    user,
    yesterdayKey,
    yesterdayRecovered,
    onHistoryUpdated,
    onProfileUpdated,
  };
}
