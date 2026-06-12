import { saveStreakRecovery } from '../userService';
import { V1_PAID_FEATURES_ENABLED } from '../proFeatures';

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
    if (!V1_PAID_FEATURES_ENABLED || !proActive) {
      setRecoveryMessage('Streak recovery is planned for a later release.');
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
