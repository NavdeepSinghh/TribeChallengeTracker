export default function PaidLaunchDecisionReplyKit({
  paidLaunchDecisionReplyCopy,
  paidLaunchDecisionStatus,
}) {
  return (
    <div style={{
      borderRadius: 12, padding: 12,
      background: 'rgba(248,113,113,0.075)',
      border: '1px solid rgba(248,113,113,0.18)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, color: '#FCA5A5', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}>PAID LAUNCH DECISION REPLY KIT</p>
          <p style={{ margin: '4px 0 0', color: '#aaa', fontSize: 10, fontWeight: 800 }}>
            Manual launch gate decision replies
          </p>
        </div>
        <span style={{ color: '#FCA5A5', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
          {paidLaunchDecisionStatus}
        </span>
      </div>
      <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
        Copy approved, hold, blocked, and closed paid-launch replies without creating purchases, writing entitlements, processing refunds, or claiming paid access is live.
      </p>
      <button
        type="button"
        onClick={() => navigator.clipboard?.writeText(paidLaunchDecisionReplyCopy)}
        style={{
          marginTop: 10, width: '100%', border: 0, borderRadius: 12, padding: '10px',
          background: 'rgba(248,113,113,0.12)', color: '#FCA5A5',
          fontSize: 10, fontWeight: 900, fontFamily: 'monospace', letterSpacing: 1,
        }}
      >
        COPY PAID LAUNCH REPLIES
      </button>
    </div>
  );
}
