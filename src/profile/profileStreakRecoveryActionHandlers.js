import { saveStreakRecovery } from '../userService';

export function buildProfileStreakRecoveryActionHandlers({
  myHistory,
  proActive,
  setIsSavingRecovery,
  setRecoveryMessage,
  user,
  yesterdayKey,
  yesterdayRecovered,
  onHistoryUpdated,
}) {
  const handleStreakRecovery = async () => {
    if (!proActive) {
      setRecoveryMessage('Streak recovery credits unlock with Tribe Pro.');
      return;
    }
    setIsSavingRecovery(true);
    setRecoveryMessage('');
    try {
      const dayEntry = await saveStreakRecovery(user.uid, yesterdayKey);
      onHistoryUpdated?.({ ...myHistory, [yesterdayKey]: dayEntry });
      setRecoveryMessage(yesterdayRecovered ? 'Yesterday already has a recovery credit.' : 'Yesterday recovered. Your streak is protected.');
    } catch (err) {
      setRecoveryMessage(err?.message || 'Could not recover that streak day.');
    } finally {
      setIsSavingRecovery(false);
    }
  };

  return { handleStreakRecovery };
}
