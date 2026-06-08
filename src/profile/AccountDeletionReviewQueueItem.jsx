import { ACCOUNT_DELETION_REVIEW_STATUS_OPTIONS } from './accountDeletionReviewQueueStatusOptions';

export default function AccountDeletionReviewQueueItem({
  accountDeletionReviewNotes,
  onAccountDeletionReview,
  req,
  reviewingAccountDeletionRequestId,
  setAccountDeletionReviewNotes,
}) {
  const isReviewing = reviewingAccountDeletionRequestId === req.id;

  return (
    <div style={{
      padding: '10px 0',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{req.displayName || req.email || req.uid}</span>
        <span style={{ color: '#F87171', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{req.source || 'unknown'}</span>
      </div>
      <div style={{ color: '#777', fontSize: 10, fontWeight: 700, marginTop: 4 }}>
        {req.email || 'No email'} · {req.uid || req.id}
      </div>
      <textarea
        value={accountDeletionReviewNotes[req.id] || ''}
        onChange={(event) => setAccountDeletionReviewNotes(notes => ({ ...notes, [req.id]: event.target.value }))}
        placeholder="Manual account deletion review note: identity verified, subscription/refund context, retention obligations, no automatic deletion..."
        rows={2}
        style={{
          width: '100%',
          marginTop: 8,
          padding: 8,
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(0,0,0,0.22)',
          color: '#ddd',
          fontSize: 10,
          fontWeight: 700,
          fontFamily: "'Space Grotesk', sans-serif",
          resize: 'vertical',
          boxSizing: 'border-box',
        }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6, marginTop: 8 }}>
        {ACCOUNT_DELETION_REVIEW_STATUS_OPTIONS.map(([status, label]) => (
          <button
            key={status}
            onClick={() => onAccountDeletionReview(req.id, status)}
            disabled={isReviewing}
            style={{
              border: '1px solid rgba(248,113,113,0.2)',
              background: 'rgba(248,113,113,0.08)',
              color: '#FCA5A5',
              borderRadius: 10,
              padding: '8px 4px',
              fontSize: 8,
              fontWeight: 900,
              cursor: isReviewing ? 'default' : 'pointer',
            }}
          >
            {isReviewing ? '...' : label}
          </button>
        ))}
      </div>
      <div style={{ color: '#777', fontSize: 9, fontWeight: 800, marginTop: 6 }}>
        Manual account deletion review only; this does not delete the account, erase data, cancel purchases, process refunds, or bypass marketplace policy.
      </div>
    </div>
  );
}
