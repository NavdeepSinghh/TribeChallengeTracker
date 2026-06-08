import { savePartnerPerkInterest } from '../userService';

export function buildPartnerPerkInterestActionHandlers({
  profile,
  selectedPartnerPerkIds,
  setIsSavingPartnerPerks,
  setPartnerPerkMessage,
  setProfile,
  setSelectedPartnerPerkIds,
  user,
  onProfileUpdated,
}) {
  const handlePartnerPerkToggle = async perkId => {
    const nextSelectedIds = selectedPartnerPerkIds.includes(perkId)
      ? selectedPartnerPerkIds.filter(id => id !== perkId)
      : [...selectedPartnerPerkIds, perkId];
    setSelectedPartnerPerkIds(nextSelectedIds);
    setIsSavingPartnerPerks(true);
    setPartnerPerkMessage('');
    try {
      const partnerPerkInterest = await savePartnerPerkInterest(user.uid, nextSelectedIds);
      setSelectedPartnerPerkIds(partnerPerkInterest.selectedIds || []);
      setProfile(p => ({ ...(p || {}), partnerPerkInterest }));
      onProfileUpdated?.({ ...(profile || {}), partnerPerkInterest });
      setPartnerPerkMessage(partnerPerkInterest.selectedIds?.length ? 'Perk interest saved.' : 'Perk interest cleared.');
    } catch (err) {
      setPartnerPerkMessage(err?.message || 'Could not save perk interest.');
    } finally {
      setIsSavingPartnerPerks(false);
    }
  };

  return { handlePartnerPerkToggle };
}
