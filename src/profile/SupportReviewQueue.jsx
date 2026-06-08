import SupportReviewQueueItem from './SupportReviewQueueItem';

export default function SupportReviewQueue({
  onSupportRequestReview,
  reviewingSupportRequestId,
  setSupportReviewNotes,
  supportReviewNotes,
  supportReviewQueue,
}) {
  return (
    <>
      <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>SUPPORT REVIEW QUEUE</p>
      <div style={{
        background: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.12)',
        borderRadius: 16, padding: 14, marginBottom: 20,
      }}>
        <p style={{ margin: '0 0 10px', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
          Admin-only queue for open supportRequests. Use this for follow-up only; do not resolve refunds, subscriptions, or entitlements from profile UI.
        </p>
        {supportReviewQueue.length === 0 ? (
          <div style={{ color: '#666', fontSize: 11, fontWeight: 800 }}>No open support requests.</div>
        ) : supportReviewQueue.slice(0, 5).map(req => (
          <SupportReviewQueueItem
            key={req.id}
            onSupportRequestReview={onSupportRequestReview}
            req={req}
            reviewingSupportRequestId={reviewingSupportRequestId}
            setSupportReviewNotes={setSupportReviewNotes}
            supportReviewNotes={supportReviewNotes}
          />
        ))}
      </div>
    </>
  );
}
