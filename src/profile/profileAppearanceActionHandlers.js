import { saveProfileAppearance } from '../userService';
import { resizeImageToBase64 } from './profileMedia';

export function buildProfileAppearanceActionHandlers({
  avatarColor,
  avatarEmoji,
  profile,
  setAppearanceError,
  setIsSavingAppearance,
  setProfile,
  user,
  onProfileUpdated,
}) {
  const persistAppearance = async ({ profileImageData = profile?.profileImageData, avatarEmoji: emoji = avatarEmoji, avatarColor: color = avatarColor }) => {
    setIsSavingAppearance(true);
    setAppearanceError('');
    try {
      await saveProfileAppearance(user.uid, { profileImageData, avatarEmoji: emoji, avatarColor: color });
      const nextProfile = {
        ...(profile || {}),
        profileImageData: profileImageData || null,
        avatarEmoji: emoji,
        avatarColor: color,
      };
      setProfile(p => ({
        ...(p || {}),
        profileImageData: profileImageData || null,
        avatarEmoji: emoji,
        avatarColor: color,
      }));
      onProfileUpdated?.(nextProfile);
    } catch (err) {
      setAppearanceError(err?.message || 'Could not save profile appearance.');
    } finally {
      setIsSavingAppearance(false);
    }
  };

  const handlePhotoUpload = async e => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setIsSavingAppearance(true);
    setAppearanceError('');
    try {
      const profileImageData = await resizeImageToBase64(file);
      if (profileImageData.length > 900000) {
        throw new Error('Photo is too large. Try a smaller image.');
      }
      await saveProfileAppearance(user.uid, {
        profileImageData,
        avatarEmoji,
        avatarColor,
      });
      setProfile(p => ({ ...(p || {}), profileImageData, avatarEmoji, avatarColor }));
      onProfileUpdated?.({ ...(profile || {}), profileImageData, avatarEmoji, avatarColor });
    } catch (err) {
      setAppearanceError(err?.message || 'Could not upload that photo.');
    } finally {
      setIsSavingAppearance(false);
    }
  };

  return {
    handlePhotoUpload,
    persistAppearance,
  };
}
