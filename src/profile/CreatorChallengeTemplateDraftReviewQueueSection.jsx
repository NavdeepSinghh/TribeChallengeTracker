import CreatorChallengeTemplateDraftReviewQueueItem from './CreatorChallengeTemplateDraftReviewQueueItem';

export default function CreatorChallengeTemplateDraftReviewQueueSection({
  creatorTemplateDraftReviewNotes,
  creatorTemplateDraftReviewQueue,
  handleCreatorTemplateDraftReview,
  reviewingCreatorTemplateDraftId,
  setCreatorTemplateDraftReviewNotes,
}) {
  return (
    <div style={{ borderRadius: 14, padding: 14, marginBottom: 12, background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.18)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <p style={{ margin: 0, color: '#10B981', fontSize: 12, fontWeight: 900 }}>CREATOR TEMPLATE DRAFT REVIEW QUEUE</p>
        <span style={{ color: '#10B981', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>{creatorTemplateDraftReviewQueue.length} OPEN</span>
      </div>
      <p style={{ margin: '7px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.4 }}>
        Admin-only queue for open creatorChallengeTemplateDrafts. Publish only reviewed free creator templates into creatorChallengeTemplates; do not create contracts, payouts, purchases, entitlements, revenue-share, tracking, or paid-access claims from profile UI.
      </p>
      {creatorTemplateDraftReviewQueue.length === 0 ? (
        <p style={{ margin: '10px 0 0', color: '#777', fontSize: 11, fontWeight: 800 }}>No open creator template drafts.</p>
      ) : (
        creatorTemplateDraftReviewQueue.slice(0, 5).map(draft => (
          <CreatorChallengeTemplateDraftReviewQueueItem
            key={draft.id}
            creatorTemplateDraftReviewNotes={creatorTemplateDraftReviewNotes}
            draft={draft}
            handleCreatorTemplateDraftReview={handleCreatorTemplateDraftReview}
            reviewingCreatorTemplateDraftId={reviewingCreatorTemplateDraftId}
            setCreatorTemplateDraftReviewNotes={setCreatorTemplateDraftReviewNotes}
          />
        ))
      )}
    </div>
  );
}
