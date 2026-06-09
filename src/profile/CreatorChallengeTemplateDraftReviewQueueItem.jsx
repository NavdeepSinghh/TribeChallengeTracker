import { CREATOR_HOSTING_REVIEW_STATUS_OPTIONS } from './creatorHostingReviewStatusOptions';

export default function CreatorChallengeTemplateDraftReviewQueueItem({
  creatorTemplateDraftReviewNotes,
  draft,
  handleCreatorTemplateDraftReview,
  reviewingCreatorTemplateDraftId,
  setCreatorTemplateDraftReviewNotes,
}) {
  const isReviewing = reviewingCreatorTemplateDraftId === draft.id;

  return (
    <div style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{draft.candidateChallengeName || draft.specialty || draft.displayName || draft.uid}</span>
        <span style={{ color: '#10B981', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{draft.source || 'unknown'}</span>
      </div>
      <div style={{ color: '#777', fontSize: 10, fontWeight: 700, marginTop: 4 }}>
        {draft.hostedCount || 0} hosted · {draft.activeHostedCount || 0} active · {draft.memberReach || 0} reach · {draft.revenueReadyCount || 0} ready
      </div>
      <div style={{ color: '#aaa', fontSize: 11, lineHeight: 1.35, marginTop: 6 }}>{draft.specialty || draft.bio || 'Creator template draft pending detail'}</div>
      <textarea
        value={creatorTemplateDraftReviewNotes[draft.id] || ''}
        onChange={event => setCreatorTemplateDraftReviewNotes(notes => ({ ...notes, [draft.id]: event.target.value.slice(0, 500) }))}
        placeholder="Manual template review note: reusable format, rules, prompts, safety, moderation, support boundaries..."
        style={{
          marginTop: 8, width: '100%', minHeight: 54, borderRadius: 10, padding: 8,
          border: '1px solid rgba(16,185,129,0.18)', background: 'rgba(0,0,0,0.24)',
          color: '#fff', fontSize: 10, lineHeight: 1.35, resize: 'vertical',
        }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6, marginTop: 7 }}>
        {CREATOR_HOSTING_REVIEW_STATUS_OPTIONS.map(([status, label]) => (
          <button
            key={status}
            onClick={() => handleCreatorTemplateDraftReview(draft.id, status)}
            disabled={isReviewing}
            style={{
              borderRadius: 9, padding: '7px 6px',
              border: '1px solid rgba(16,185,129,0.20)', background: 'rgba(16,185,129,0.10)',
              color: '#10B981', fontSize: 8, fontWeight: 900, fontFamily: 'monospace',
            }}
          >
            {isReviewing ? 'SAVING' : label}
          </button>
        ))}
      </div>
    </div>
  );
}
