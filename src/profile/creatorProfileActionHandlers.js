import { saveCreatorProfile } from '../userService';

export function buildCreatorProfileActionHandlers({
  creatorBio,
  creatorCtaUrl,
  creatorEnabled,
  creatorRevenueShareInterest,
  creatorSpecialty,
  proActive,
  profile,
  setCreatorMessage,
  setIsSavingCreator,
  setProfile,
  user,
  onProfileUpdated,
}) {
  const handleCreatorSave = async () => {
    if (!proActive) {
      setCreatorMessage('Creator / Coach Mode unlocks with Tribe Pro.');
      return;
    }
    setIsSavingCreator(true);
    setCreatorMessage('');
    try {
      const creatorProfile = await saveCreatorProfile(user.uid, {
        enabled: creatorEnabled,
        specialty: creatorSpecialty,
        bio: creatorBio,
        ctaUrl: creatorCtaUrl,
        revenueShareInterest: creatorRevenueShareInterest,
      });
      setProfile(p => ({ ...(p || {}), creatorProfile }));
      onProfileUpdated?.({ ...(profile || {}), creatorProfile });
      setCreatorMessage(creatorProfile.enabled ? 'Creator profile saved.' : 'Creator profile disabled.');
    } catch (err) {
      setCreatorMessage(err?.message || 'Could not save creator profile.');
    } finally {
      setIsSavingCreator(false);
    }
  };

  return { handleCreatorSave };
}
