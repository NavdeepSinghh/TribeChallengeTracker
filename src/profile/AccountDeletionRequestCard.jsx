export default function AccountDeletionRequestCard({
  accountDeletionRequested,
  deletionRequestMessage,
  isRequestingDeletion,
  onAccountDeletionRequest,
}) {
  return (
    <>
      <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>ACCOUNT DELETION REQUEST</p>
      <div style={{
        background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.16)',
        borderRadius: 16, padding: 14, marginBottom: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
          <p style={{ margin: 0, color: '#fff', fontSize: 14, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>
            {accountDeletionRequested ? 'Request recorded' : 'Request account/data deletion review'}
          </p>
          <span style={{
            flexShrink: 0, borderRadius: 999, padding: '4px 8px',
            background: accountDeletionRequested ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.06)',
            color: accountDeletionRequested ? '#34D399' : '#aaa',
            fontSize: 8, fontWeight: 900, fontFamily: 'monospace', letterSpacing: 1,
          }}>
            {accountDeletionRequested ? 'REQUESTED' : 'NOT REQUESTED'}
          </span>
        </div>
        <p style={{ margin: '0 0 12px', color: '#aaa', fontSize: 10, lineHeight: 1.5, fontWeight: 800 }}>
          This records a support-reviewed accountDeletionRequests entry and does not immediately delete your account, cancel purchases, or bypass marketplace refund policy.
        </p>
        <button
          type="button"
          onClick={onAccountDeletionRequest}
          disabled={accountDeletionRequested || isRequestingDeletion}
          style={{
            width: '100%', border: 0, borderRadius: 12, padding: '12px 10px',
            background: accountDeletionRequested ? 'rgba(255,255,255,0.06)' : '#F87171',
            color: accountDeletionRequested ? '#777' : '#111',
            fontSize: 10, fontWeight: 900, fontFamily: 'monospace', letterSpacing: 1,
            cursor: accountDeletionRequested ? 'default' : 'pointer',
          }}
        >
          {accountDeletionRequested ? 'REQUEST RECORDED' : (isRequestingDeletion ? 'RECORDING REQUEST...' : 'REQUEST ACCOUNT DELETION')}
        </button>
        {deletionRequestMessage && (
          <div style={{ marginTop: 10, color: deletionRequestMessage.includes('recorded') ? '#34D399' : '#ffb199', fontSize: 11, fontWeight: 800 }}>
            {deletionRequestMessage}
          </div>
        )}
      </div>
    </>
  );
}
