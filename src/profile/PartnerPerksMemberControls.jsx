import { GOLD } from './profileConstants';
import PartnerPerkClaimStatus from './PartnerPerkClaimStatus';
import PartnerPerkInterestList from './PartnerPerkInterestList';

export default function PartnerPerksMemberControls({
  claimingPartnerPerkId,
  isSavingPartnerPerks,
  onPartnerPerkClaim,
  onPartnerPerkToggle,
  partnerPerkClaimMessage,
  partnerPerkClaims,
  partnerPerkMessage,
  partnerPerkStats,
  selectedPartnerPerkIds,
}) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Partner perks</p>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
            Future aligned offers for active tribe members
          </p>
        </div>
        <span style={{ color: GOLD, fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
          {selectedPartnerPerkIds.length ? `${selectedPartnerPerkIds.length} SAVED` : 'COMING SOON'}
        </span>
      </div>
      <PartnerPerkInterestList
        selectedPartnerPerkIds={selectedPartnerPerkIds}
        partnerPerkStats={partnerPerkStats}
        isSavingPartnerPerks={isSavingPartnerPerks}
        onPartnerPerkToggle={onPartnerPerkToggle}
        claimingPartnerPerkId={claimingPartnerPerkId}
        onPartnerPerkClaim={onPartnerPerkClaim}
      />
      {partnerPerkMessage && <p style={{ margin: '8px 0 0', color: GOLD, fontSize: 10, fontWeight: 900 }}>{partnerPerkMessage}</p>}
      {partnerPerkClaimMessage && (
        <p style={{ margin: '8px 0 0', color: partnerPerkClaimMessage.includes('sent') ? '#2DD4BF' : '#ffb199', fontSize: 10, lineHeight: 1.4, fontFamily: 'monospace' }}>
          {partnerPerkClaimMessage}
        </p>
      )}
      <PartnerPerkClaimStatus partnerPerkClaims={partnerPerkClaims} />
    </>
  );
}
