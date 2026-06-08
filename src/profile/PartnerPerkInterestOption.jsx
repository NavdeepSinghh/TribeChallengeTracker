export default function PartnerPerkInterestOption({
  claimingPartnerPerkId,
  isSavingPartnerPerks,
  onPartnerPerkClaim,
  onPartnerPerkToggle,
  perk,
  progress,
  selected,
}) {
  return (
    <button key={perk.id} onClick={() => onPartnerPerkToggle(perk.id)} disabled={isSavingPartnerPerks} style={{
      borderRadius: 12, padding: 11,
      background: selected ? `${perk.color}18` : `${perk.color}10`,
      border: `1px solid ${selected ? perk.color : perk.color + '33'}`,
      textAlign: 'left',
      cursor: isSavingPartnerPerks ? 'default' : 'pointer',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
        <p style={{ margin: 0, color: perk.color, fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{perk.label.toUpperCase()}</p>
        <p style={{ margin: 0, color: selected ? perk.color : '#666', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{selected ? 'INTERESTED' : 'TAP TO SAVE'}</p>
      </div>
      <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>{perk.title}</p>
      <p style={{ margin: '4px 0 0', color: '#888', fontSize: 10, lineHeight: 1.4 }}>{perk.detail}</p>
      <div style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', marginBottom: 5 }}>
          <span style={{ color: progress.eligible ? perk.color : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
            {progress.eligible ? 'ELIGIBLE' : perk.requirement.toUpperCase()}
          </span>
          <span style={{ color: '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
            {progress.current}/{progress.target}
          </span>
        </div>
        <div style={{ height: 5, borderRadius: 99, overflow: 'hidden', background: 'rgba(255,255,255,0.08)' }}>
          <div style={{ width: `${progress.percent}%`, height: '100%', background: perk.color }} />
        </div>
      </div>
      {progress.eligible && (
        <div
          role="button"
          tabIndex={0}
          onClick={event => {
            event.stopPropagation();
            onPartnerPerkClaim(perk, progress);
          }}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              event.stopPropagation();
              onPartnerPerkClaim(perk, progress);
            }
          }}
          style={{
            marginTop: 9, borderRadius: 10, padding: '8px 10px',
            background: `${perk.color}14`, border: `1px solid ${perk.color}33`,
            color: perk.color, fontSize: 9, fontWeight: 900, fontFamily: 'monospace',
            textAlign: 'center',
          }}
        >
          {claimingPartnerPerkId === perk.id ? 'SENDING PERK REVIEW...' : 'REQUEST PERK REVIEW'}
        </div>
      )}
    </button>
  );
}
