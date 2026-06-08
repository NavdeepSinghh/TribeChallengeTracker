export default function AccountDeletionDecisionReplyKit({
  accountDeletionDecisionReplyCopy,
  accountDeletionReviewQueue,
  copyText,
  profile,
}) {
  return (
    <div style={{
      background: 'rgba(248,113,113,0.055)', border: '1px solid rgba(248,113,113,0.16)',
      borderRadius: 14, padding: 12, marginBottom: 20,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, color: '#FCA5A5', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}>ACCOUNT DELETION DECISION REPLY KIT</p>
          <p style={{ margin: '5px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>Manual support-reviewed deletion replies</p>
        </div>
        <span style={{ color: accountDeletionReviewQueue.length ? '#FCA5A5' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>COPY ONLY</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 10 }}>
        {[
          ['OPEN', accountDeletionReviewQueue.length],
          ['STATUS', profile?.accountDeletionRequest?.status || 'NONE'],
          ['MODE', 'MANUAL'],
        ].map(([label, value]) => (
          <div key={label} style={{ borderRadius: 10, padding: 8, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ margin: 0, color: '#FCA5A5', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
            <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>{value}</p>
          </div>
        ))}
      </div>
      <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
        Copy verified, contacted, blocked, and closed replies without deleting accounts, erasing data, cancelling purchases, processing refunds, or bypassing marketplace policy.
      </p>
      <button
        type="button"
        onClick={() => copyText(accountDeletionDecisionReplyCopy, 'Account deletion decision replies copied')}
        style={{
          marginTop: 10, width: '100%', border: 0, borderRadius: 12, padding: '10px',
          background: 'rgba(248,113,113,0.12)', color: '#FCA5A5',
          fontSize: 10, fontWeight: 900, fontFamily: 'monospace', letterSpacing: 1,
        }}
      >
        COPY ACCOUNT DELETION DECISION REPLIES
      </button>
    </div>
  );
}
