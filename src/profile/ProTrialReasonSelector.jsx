import { PRO_TRIAL_REASONS } from './profileConstants';

export default function ProTrialReasonSelector({
  isSavingProTrialInterest,
  onProTrialReasonToggle,
  proTrialMessage,
  selectedProTrialReasonIds,
}) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', marginBottom: 8 }}>
        <p style={{ margin: 0, color: '#A78BFA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PRO TRIAL INTEREST</p>
        <p style={{ margin: 0, color: selectedProTrialReasonIds.length ? '#34D399' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
          {selectedProTrialReasonIds.length ? `${selectedProTrialReasonIds.length} SAVED` : 'TAP TO SAVE'}
        </p>
      </div>
      <p style={{ margin: '0 0 8px', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
        Tell us what would make a Pro trial worth trying. This is a first-party demand signal only.
      </p>
      <div style={{ display: 'grid', gap: 7 }}>
        {PRO_TRIAL_REASONS.map(reason => {
          const selected = selectedProTrialReasonIds.includes(reason.id);
          return (
            <button key={reason.id} onClick={() => onProTrialReasonToggle(reason.id)} disabled={isSavingProTrialInterest} style={{
              textAlign: 'left', borderRadius: 10, padding: 10,
              border: `1px solid ${selected ? 'rgba(167,139,250,0.65)' : 'rgba(255,255,255,0.07)'}`,
              background: selected ? 'rgba(167,139,250,0.14)' : 'rgba(0,0,0,0.18)',
              cursor: isSavingProTrialInterest ? 'wait' : 'pointer',
            }}>
              <p style={{ margin: 0, color: selected ? '#A78BFA' : '#fff', fontSize: 11, fontWeight: 900 }}>{reason.label}</p>
              <p style={{ margin: '3px 0 0', color: '#777', fontSize: 9, lineHeight: 1.35 }}>{reason.detail}</p>
            </button>
          );
        })}
      </div>
      {proTrialMessage && (
        <p style={{ margin: '8px 0 0', color: proTrialMessage.includes('Could not') ? '#ffb199' : '#A78BFA', fontSize: 10, fontFamily: 'monospace' }}>
          {proTrialMessage}
        </p>
      )}
    </>
  );
}
