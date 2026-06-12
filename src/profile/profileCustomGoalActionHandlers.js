import { saveCustomGoals } from '../userService';
import { V1_PAID_FEATURES_ENABLED } from '../proFeatures';

export function buildProfileCustomGoalActionHandlers({
  goalActiveDays,
  goalPoints,
  goalStreak,
  proActive,
  setGoalsMessage,
  setIsSavingGoals,
  setProfile,
  user,
}) {
  const handleCustomGoalsSave = async () => {
    if (V1_PAID_FEATURES_ENABLED && !proActive) {
      setGoalsMessage('Custom goals are planned for a later release.');
      return;
    }
    setIsSavingGoals(true);
    setGoalsMessage('');
    try {
      const goals = await saveCustomGoals(user.uid, {
        weeklyActiveDaysTarget: goalActiveDays,
        weeklyPointsTarget: goalPoints,
        streakTarget: goalStreak,
      });
      setProfile(p => ({ ...(p || {}), goals }));
      setGoalsMessage('Custom goals saved.');
    } catch (err) {
      setGoalsMessage(err?.message || 'Could not save custom goals.');
    } finally {
      setIsSavingGoals(false);
    }
  };

  return { handleCustomGoalsSave };
}
