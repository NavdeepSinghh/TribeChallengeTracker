import { useState } from 'react';

export default function useProfilePreferenceState() {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [displayNameDraft, setDisplayNameDraft] = useState('');
  const [displayNameMessage, setDisplayNameMessage] = useState('');
  const [isSavingDisplayName, setIsSavingDisplayName] = useState(false);
  const [isSavingAppearance, setIsSavingAppearance] = useState(false);
  const [appearanceError, setAppearanceError] = useState('');
  const [goalActiveDays, setGoalActiveDays] = useState(5);
  const [goalPoints, setGoalPoints] = useState(250);
  const [goalStreak, setGoalStreak] = useState(30);
  const [goalsMessage, setGoalsMessage] = useState('');
  const [isSavingGoals, setIsSavingGoals] = useState(false);
  const [selectedFrameId, setSelectedFrameId] = useState('none');
  const [cosmeticsMessage, setCosmeticsMessage] = useState('');
  const [isSavingCosmetics, setIsSavingCosmetics] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [isSavingRecovery, setIsSavingRecovery] = useState(false);

  return {
    appearanceError,
    cosmeticsMessage,
    displayNameDraft,
    displayNameMessage,
    goalActiveDays,
    goalPoints,
    goalStreak,
    goalsMessage,
    isSavingAppearance,
    isSavingCosmetics,
    isSavingDisplayName,
    isSavingGoals,
    isSavingRecovery,
    recoveryMessage,
    selectedFrameId,
    setAppearanceError,
    setCosmeticsMessage,
    setDisplayNameDraft,
    setDisplayNameMessage,
    setGoalActiveDays,
    setGoalPoints,
    setGoalStreak,
    setGoalsMessage,
    setIsSavingAppearance,
    setIsSavingCosmetics,
    setIsSavingDisplayName,
    setIsSavingGoals,
    setIsSavingRecovery,
    setRecoveryMessage,
    setSelectedFrameId,
    setShowAvatarPicker,
    setShowBreakdown,
    showAvatarPicker,
    showBreakdown,
  };
}
