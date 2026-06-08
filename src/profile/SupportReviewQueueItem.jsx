import { SUPPORT_REVIEW_STATUS_OPTIONS } from './supportReviewStatusOptions';

export default function SupportReviewQueueItem({
  onSupportRequestReview,
  req,
  reviewingSupportRequestId,
  setSupportReviewNotes,
  supportReviewNotes,
}) {
  const isReviewing = reviewingSupportRequestId === req.id;

  return (
    <div style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{req.displayName || req.email || req.uid}</span>
        <span style={{ color: '#60A5FA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{req.category || 'general'}</span>
      </div>
      <div style={{ color: '#777', fontSize: 10, fontWeight: 700, marginTop: 4 }}>{req.email || 'No email'} · {req.source || 'unknown'}</div>
      <div style={{ color: '#aaa', fontSize: 11, lineHeight: 1.35, marginTop: 6 }}>{req.message}</div>
      <textarea
        value={supportReviewNotes[req.id] || ''}
        onChange={event => setSupportReviewNotes(notes => ({ ...notes, [req.id]: event.target.value.slice(0, 500) }))}
        placeholder="Manual support review note: follow-up owner, identity check, store/support handoff, no refund or entitlement action..."
        rows={2}
        style={{
          width: '100%', marginTop: 8, border: '1px solid rgba(96,165,250,0.18)',
          borderRadius: 10, background: 'rgba(0,0,0,0.20)', color: '#fff', padding: 8,
          fontSize: 11, lineHeight: 1.35, resize: 'vertical', boxSizing: 'border-box',
        }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6, marginTop: 8 }}>
        {SUPPORT_REVIEW_STATUS_OPTIONS.map(([status, label]) => (
          <button
            key={status}
            onClick={() => onSupportRequestReview(req.id, status)}
            disabled={isReviewing}
            style={{
              border: 0, borderRadius: 8, padding: '7px 6px',
              background: 'rgba(96,165,250,0.14)', color: '#60A5FA',
              fontSize: 9, fontWeight: 900, fontFamily: 'monospace',
              cursor: isReviewing ? 'wait' : 'pointer',
            }}
          >
            {isReviewing ? 'SAVING' : label}
          </button>
        ))}
      </div>
    </div>
  );
}
