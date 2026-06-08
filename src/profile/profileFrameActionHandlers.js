import { saveProfileCosmetics } from '../userService';

export function buildProfileFrameActionHandlers({
  profile,
  proActive,
  selectedFrameId,
  setCosmeticsMessage,
  setIsSavingCosmetics,
  setProfile,
  user,
  onProfileUpdated,
}) {
  const handleFrameSave = async () => {
    if (!proActive) {
      setCosmeticsMessage('Premium profile frames unlock with Tribe Pro.');
      return;
    }
    setIsSavingCosmetics(true);
    setCosmeticsMessage('');
    try {
      const cosmetics = await saveProfileCosmetics(user.uid, { profileFrameId: selectedFrameId });
      setProfile(p => ({ ...(p || {}), cosmetics }));
      onProfileUpdated?.({ ...(profile || {}), cosmetics });
      setCosmeticsMessage('Profile frame saved.');
    } catch (err) {
      setCosmeticsMessage(err?.message || 'Could not save profile frame.');
    } finally {
      setIsSavingCosmetics(false);
    }
  };

  return { handleFrameSave };
}
