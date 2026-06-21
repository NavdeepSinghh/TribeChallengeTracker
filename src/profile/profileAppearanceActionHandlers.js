import { saveDisplayName, saveProfileAppearance } from '../userService';
import { normalizeDisplayName } from '../displayNameUtils';
import { resizeImageToBase64 } from './profileMedia';

export function buildProfileAppearanceActionHandlers({
  avatarColor,
  avatarEmoji,
  displayNameDraft,
  profile,
  setAppearanceError,
  setDisplayNameDraft,
  setDisplayNameMessage,
  setIsSavingAppearance,
  setIsSavingDisplayName,
  setProfile,
  user,
  onProfileUpdated,
}) {
  const handleDisplayNameSave = async () => {
    const normalized = normalizeDisplayName(displayNameDraft);
    if (!normalized) {
      setDisplayNameMessage('Please enter the name you want other challenge members to see.');
      return;
    }

    setIsSavingDisplayName(true);
    setDisplayNameMessage('');
    try {
      const savedName = await saveDisplayName(user.uid, { displayName: normalized });
      setDisplayNameDraft(savedName);
      const nextProfile = { ...(profile || {}), displayName: savedName };
      setProfile(p => ({ ...(p || {}), displayName: savedName }));
      onProfileUpdated?.(nextProfile);
      setDisplayNameMessage('Display name saved for challenges.');
    } catch (err) {
      setDisplayNameMessage(err?.message || 'Could not save display name.');
    } finally {
      setIsSavingDisplayName(false);
    }
  };

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
    handleDisplayNameSave,
    handlePhotoUpload,
    persistAppearance,
  };
}
