import { saveCustomGoals } from '../userService';

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
    if (!proActive) {
      setGoalsMessage('Custom goals unlock with Tribe Pro.');
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
