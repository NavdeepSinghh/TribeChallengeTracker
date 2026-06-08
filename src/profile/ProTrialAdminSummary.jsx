import { PRO_TRIAL_REASONS } from './profileConstants';

export default function ProTrialAdminSummary({
  proTrialDemandTotal,
  proTrialObjectionReplyCopy,
  proTrialPitchCopy,
  proTrialSummary,
  topProTrialReason,
}) {
  return (
    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <p style={{ margin: '0 0 8px', color: '#fff', fontSize: 11, fontWeight: 900 }}>Pro trial demand summary</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {PRO_TRIAL_REASONS.map(reason => (
          <div key={reason.id} style={{
            borderRadius: 10, padding: 8,
            background: 'rgba(0,0,0,0.18)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p style={{ margin: 0, color: '#A78BFA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{reason.label.toUpperCase()}</p>
            <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{proTrialSummary[reason.id] || 0}</p>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 10, borderRadius: 12, padding: 11,
        background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
          <p style={{ margin: 0, color: '#A78BFA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>TRIAL LAUNCH KIT</p>
          <p style={{ margin: 0, color: topProTrialReason?.demand ? '#34D399' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
            {topProTrialReason?.demand ? `${topProTrialReason.label.toUpperCase()} LEADS` : 'GATHERING'}
          </p>
        </div>
        <p style={{ margin: '7px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
          {proTrialPitchCopy}
        </p>
        <button
          onClick={() => navigator.clipboard?.writeText(proTrialPitchCopy)}
          style={{
            marginTop: 9, width: '100%', borderRadius: 12, padding: '9px 10px',
            border: '1px solid rgba(167,139,250,0.22)', background: 'rgba(167,139,250,0.10)',
            color: '#A78BFA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
          }}
        >
          COPY TRIAL LAUNCH COPY
        </button>
      </div>
      <div style={{
        marginTop: 10, borderRadius: 12, padding: 11,
        background: 'rgba(244,114,182,0.08)', border: '1px solid rgba(244,114,182,0.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
          <p style={{ margin: 0, color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PRO TRIAL OBJECTION REPLY KIT</p>
          <p style={{ margin: 0, color: proTrialDemandTotal ? '#34D399' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
            {proTrialDemandTotal ? `${proTrialDemandTotal} SIGNALS` : 'GATHERING'}
          </p>
        </div>
        <p style={{ margin: '7px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
          Copy manual replies for Pro questions without claiming live trials, prices, purchases, discounts, or entitlements.
        </p>
        <button
          onClick={() => navigator.clipboard?.writeText(proTrialObjectionReplyCopy)}
          style={{
            marginTop: 9, width: '100%', borderRadius: 12, padding: '9px 10px',
            border: '1px solid rgba(244,114,182,0.22)', background: 'rgba(244,114,182,0.10)',
            color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
          }}
        >
          COPY PRO TRIAL REPLIES
        </button>
      </div>
    </div>
  );
}
