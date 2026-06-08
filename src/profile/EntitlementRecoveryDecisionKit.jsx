export default function EntitlementRecoveryDecisionKit({
  entitlementRecoveryDecisionReplyCopy,
  entitlementRecoveryReviewQueue = [],
  entitlementRecoveryReviewNotes = {},
  setEntitlementRecoveryReviewNotes = () => {},
  onEntitlementRecoveryReview = () => {},
  reviewingEntitlementRecoveryRequestId,
}) {
  return (
    <div style={{
      borderRadius: 12, padding: 12,
      background: 'rgba(56,189,248,0.075)',
      border: '1px solid rgba(56,189,248,0.18)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, color: '#7DD3FC', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}>ENTITLEMENT RECOVERY DECISION REPLY KIT</p>
          <p style={{ margin: '4px 0 0', color: '#aaa', fontSize: 10, fontWeight: 800 }}>
            Manual missing-purchase support replies
          </p>
        </div>
        <span style={{ color: entitlementRecoveryReviewQueue.length ? '#7DD3FC' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
          {entitlementRecoveryReviewQueue.length} OPEN
        </span>
      </div>
      <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
        Copy approved, waiting, blocked, and closed replies without writing entitlements, processing refunds, cancelling subscriptions, creating purchases, or bypassing marketplace policy.
      </p>
      <button
        type="button"
        onClick={() => navigator.clipboard?.writeText(entitlementRecoveryDecisionReplyCopy)}
        style={{
          marginTop: 10, width: '100%', border: 0, borderRadius: 12, padding: '10px',
          background: 'rgba(56,189,248,0.12)', color: '#7DD3FC',
          fontSize: 10, fontWeight: 900, fontFamily: 'monospace', letterSpacing: 1,
        }}
      >
        COPY ENTITLEMENT RECOVERY REPLIES
      </button>
      {entitlementRecoveryReviewQueue.slice(0, 3).map(request => (
        <div key={request.id || request.uid} style={{ marginTop: 10, borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.16)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ margin: 0, color: '#E0F2FE', fontSize: 10, fontWeight: 900 }}>
            {request.email || request.uid || request.id || 'Entitlement review'}
          </p>
          <textarea
            value={entitlementRecoveryReviewNotes[request.id || request.uid] || ''}
            onChange={e => setEntitlementRecoveryReviewNotes(prev => ({ ...prev, [request.id || request.uid]: e.target.value }))}
            placeholder="Manual entitlement recovery review note"
            style={{ width: '100%', boxSizing: 'border-box', marginTop: 8, minHeight: 54, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#fff', padding: 8, fontSize: 10 }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            {['resolved', 'needs_more_info'].map(status => (
              <button
                key={status}
                type="button"
                disabled={reviewingEntitlementRecoveryRequestId === (request.id || request.uid)}
                onClick={() => onEntitlementRecoveryReview(request.id || request.uid, status)}
                style={{ border: 0, borderRadius: 10, padding: '8px', background: status === 'resolved' ? 'rgba(52,211,153,0.12)' : 'rgba(251,191,36,0.12)', color: status === 'resolved' ? '#34D399' : '#FBBF24', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}
              >
                {status === 'resolved' ? 'RESOLVED' : 'MORE INFO'}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
