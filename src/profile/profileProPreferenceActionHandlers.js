import { buildProfileCustomGoalActionHandlers } from './profileCustomGoalActionHandlers';
import { buildProfileFrameActionHandlers } from './profileFrameActionHandlers';
import { buildProfileStreakRecoveryActionHandlers } from './profileStreakRecoveryActionHandlers';

export function buildProfileProPreferenceActionHandlers({
  goalActiveDays,
  goalPoints,
  goalStreak,
  myHistory,
  profile,
  proActive,
  selectedFrameId,
  setCosmeticsMessage,
  setGoalsMessage,
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
}) {
  const customGoalHandlers = buildProfileCustomGoalActionHandlers({
    goalActiveDays,
    goalPoints,
    goalStreak,
    proActive,
    setGoalsMessage,
    setIsSavingGoals,
    setProfile,
    user,
  });
  const frameHandlers = buildProfileFrameActionHandlers({
    profile,
    proActive,
    selectedFrameId,
    setCosmeticsMessage,
    setIsSavingCosmetics,
    setProfile,
    user,
    onProfileUpdated,
  });
  const streakRecoveryHandlers = buildProfileStreakRecoveryActionHandlers({
    myHistory,
    proActive,
    setIsSavingRecovery,
    setRecoveryMessage,
    user,
    yesterdayKey,
    yesterdayRecovered,
    onHistoryUpdated,
  });

  return {
    ...customGoalHandlers,
    ...frameHandlers,
    ...streakRecoveryHandlers,
  };
}
