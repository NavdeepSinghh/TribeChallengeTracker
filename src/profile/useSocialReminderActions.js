import { cancelDailyReminder, getDailyReminderLabel, setDailyReminder } from '../reminderService';
import { saveSocialProfile } from '../userService';

export default function useSocialReminderActions({
  instagramHandle,
  profile,
  setInstagramHandle,
  setIsSavingSocial,
  setProfile,
  setReminderError,
  setReminderLabel,
  setSocialMessage,
  user,
  onProfileUpdated,
}) {
  const handleSocialSave = async () => {
    setIsSavingSocial(true);
    setSocialMessage('');
    try {
      const normalized = await saveSocialProfile(user.uid, { instagramHandle });
      const nextProfile = { ...(profile || {}), instagramHandle: normalized };
      setInstagramHandle(normalized);
      setProfile(nextProfile);
      onProfileUpdated?.(nextProfile);
      setSocialMessage(normalized ? 'Instagram handle saved.' : 'Instagram handle removed.');
    } catch (err) {
      setSocialMessage(err?.message || 'Could not save Instagram handle.');
    } finally {
      setIsSavingSocial(false);
    }
  };

  const handleReminder = async (hour, minute) => {
    setReminderError('');
    try {
      const label = await setDailyReminder(hour, minute);
      setReminderLabel(label);
    } catch (err) {
      setReminderError(err?.message || 'Could not set reminder.');
    }
  };

  const disableReminder = () => {
    cancelDailyReminder();
    setReminderLabel(getDailyReminderLabel());
    setReminderError('');
  };

  return {
    disableReminder,
    handleReminder,
    handleSocialSave,
  };
}
