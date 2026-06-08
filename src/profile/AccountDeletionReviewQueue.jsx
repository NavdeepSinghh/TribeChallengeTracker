import AccountDeletionReviewQueueItem from './AccountDeletionReviewQueueItem';

export default function AccountDeletionReviewQueue({
  accountDeletionReviewNotes,
  accountDeletionReviewQueue,
  onAccountDeletionReview,
  reviewingAccountDeletionRequestId,
  setAccountDeletionReviewNotes,
}) {
  return (
    <>
      <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>ACCOUNT DELETION REVIEW QUEUE</p>
      <div style={{
        background: 'rgba(248,113,113,0.04)', border: '1px solid rgba(248,113,113,0.12)',
        borderRadius: 16, padding: 14, marginBottom: 20,
      }}>
        <p style={{ margin: '0 0 10px', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
          Admin-only support queue for requested accountDeletionRequests. Review identity, subscriptions, refunds, and data-retention obligations before any backend deletion work.
        </p>
        {accountDeletionReviewQueue.length === 0 ? (
          <div style={{ color: '#666', fontSize: 11, fontWeight: 800 }}>No pending account deletion requests.</div>
        ) : accountDeletionReviewQueue.slice(0, 5).map(req => (
          <AccountDeletionReviewQueueItem
            key={req.id}
            accountDeletionReviewNotes={accountDeletionReviewNotes}
            onAccountDeletionReview={onAccountDeletionReview}
            req={req}
            reviewingAccountDeletionRequestId={reviewingAccountDeletionRequestId}
            setAccountDeletionReviewNotes={setAccountDeletionReviewNotes}
          />
        ))}
      </div>
    </>
  );
}
