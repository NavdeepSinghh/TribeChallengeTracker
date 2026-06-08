export default function CreatorHostingDecisionReplyCard({
  creatorAnalytics,
  creatorHostingApplicationReviewQueue,
  creatorHostingDecisionReplyCopy,
}) {
  return (
    <div style={{
      borderRadius: 12, padding: 12, marginBottom: 10,
      background: 'rgba(251,113,133,0.075)',
      border: '1px solid rgba(251,113,133,0.18)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <p style={{ margin: 0, color: '#FB7185', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>CREATOR HOSTING DECISION REPLY KIT</p>
          <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>
            Manual admin replies for hosted-review outcomes
          </p>
        </div>
        <span style={{ color: '#FB7185', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
          COPY ONLY
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[
          ['OPEN', creatorHostingApplicationReviewQueue.length],
          ['REACH', creatorAnalytics.members],
          ['READY', creatorAnalytics.revenueReady],
        ].map(([label, value]) => (
          <div key={label} style={{ borderRadius: 10, padding: 8, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ margin: 0, color: '#FB7185', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
            <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{value}</p>
          </div>
        ))}
      </div>
      <p style={{ margin: '9px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
        Copy approved, waiting, not-ready, and declined replies without creating contracts, payouts, purchases, entitlements, revenue-share, or paid-access claims.
      </p>
      <button
        onClick={() => navigator.clipboard?.writeText(creatorHostingDecisionReplyCopy)}
        style={{
          marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
          border: '1px solid rgba(251,113,133,0.24)', background: 'rgba(251,113,133,0.10)',
          color: '#FB7185', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
        }}
      >
        COPY CREATOR DECISION REPLIES
      </button>
    </div>
  );
}
