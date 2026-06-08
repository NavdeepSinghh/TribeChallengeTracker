import { PARTNER_PERKS, getPartnerPerkProgress } from '../partnerPerks';
import PartnerPerkInterestOption from './PartnerPerkInterestOption';

export default function PartnerPerkInterestList({
  selectedPartnerPerkIds,
  partnerPerkStats,
  isSavingPartnerPerks,
  onPartnerPerkToggle,
  claimingPartnerPerkId,
  onPartnerPerkClaim,
}) {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {PARTNER_PERKS.map(perk => {
        const selected = selectedPartnerPerkIds.includes(perk.id);
        const progress = getPartnerPerkProgress(perk, partnerPerkStats);
        return (
          <PartnerPerkInterestOption
            key={perk.id}
            claimingPartnerPerkId={claimingPartnerPerkId}
            isSavingPartnerPerks={isSavingPartnerPerks}
            onPartnerPerkClaim={onPartnerPerkClaim}
            onPartnerPerkToggle={onPartnerPerkToggle}
            perk={perk}
            progress={progress}
            selected={selected}
          />
        );
      })}
    </div>
  );
}
