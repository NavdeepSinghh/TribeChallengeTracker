import { CREATOR_HOSTING_REVIEW_STATUS_OPTIONS } from './creatorHostingReviewStatusOptions';

export default function CreatorHostingReviewQueueItem({
  creatorHostingApplicationReviewNotes,
  handleCreatorHostingApplicationReview,
  req,
  reviewingCreatorHostingApplicationId,
  setCreatorHostingApplicationReviewNotes,
}) {
  const isReviewing = reviewingCreatorHostingApplicationId === req.id;

  return (
    <div style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{req.displayName || req.email || req.uid}</span>
        <span style={{ color: '#F472B6', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{req.revenueShareInterest ? 'BETA' : 'REVIEW'}</span>
      </div>
      <div style={{ color: '#777', fontSize: 10, fontWeight: 700, marginTop: 4 }}>
        {req.hostedCount || 0} hosted · {req.memberReach || 0} reach · {req.revenueReadyCount || 0} ready · {req.source || 'unknown'}
      </div>
      <div style={{ color: '#aaa', fontSize: 11, lineHeight: 1.35, marginTop: 6 }}>{req.specialty || req.bio || 'Creator profile pending detail'}</div>
      <textarea
        value={creatorHostingApplicationReviewNotes[req.id] || ''}
        onChange={event => setCreatorHostingApplicationReviewNotes(notes => ({ ...notes, [req.id]: event.target.value.slice(0, 500) }))}
        placeholder="Manual creator review note: creator focus, moderation, payout policy, terms, support readiness..."
        style={{
          marginTop: 8, width: '100%', minHeight: 54, borderRadius: 10, padding: 8,
          border: '1px solid rgba(244,114,182,0.18)', background: 'rgba(0,0,0,0.24)',
          color: '#fff', fontSize: 10, lineHeight: 1.35, resize: 'vertical',
        }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6, marginTop: 7 }}>
        {CREATOR_HOSTING_REVIEW_STATUS_OPTIONS.map(([status, label]) => (
          <button
            key={status}
            onClick={() => handleCreatorHostingApplicationReview(req.id, status)}
            disabled={isReviewing}
            style={{
              borderRadius: 9, padding: '7px 6px',
              border: '1px solid rgba(244,114,182,0.20)', background: 'rgba(244,114,182,0.10)',
              color: '#F472B6', fontSize: 8, fontWeight: 900, fontFamily: 'monospace',
            }}
          >
            {isReviewing ? 'SAVING' : label}
          </button>
        ))}
      </div>
    </div>
  );
}
