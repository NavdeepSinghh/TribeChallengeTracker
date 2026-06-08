import CreatorHostingReviewQueueItem from './CreatorHostingReviewQueueItem';

export default function CreatorHostingReviewQueueSection({
  creatorHostingApplicationReviewNotes,
  creatorHostingApplicationReviewQueue,
  handleCreatorHostingApplicationReview,
  reviewingCreatorHostingApplicationId,
  setCreatorHostingApplicationReviewNotes,
}) {
  return (
    <div style={{
      borderRadius: 12, padding: 12, marginBottom: 10,
      background: 'rgba(244,114,182,0.075)',
      border: '1px solid rgba(244,114,182,0.18)',
    }}>
      <p style={{ margin: 0, color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>CREATOR HOSTING APPLICATION REVIEW QUEUE</p>
      <p style={{ margin: '8px 0 10px', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
        Admin-only queue for open creatorHostingApplications. Review hosted reach, creator focus, payout policy, terms, and support readiness; do not create contracts, payouts, purchases, entitlements, revenue-share, or paid-access claims from profile UI.
      </p>
      {creatorHostingApplicationReviewQueue.length === 0 ? (
        <div style={{ color: '#666', fontSize: 11, fontWeight: 800 }}>No open creator hosting applications.</div>
      ) : creatorHostingApplicationReviewQueue.slice(0, 5).map(req => (
        <CreatorHostingReviewQueueItem
          key={req.id}
          creatorHostingApplicationReviewNotes={creatorHostingApplicationReviewNotes}
          handleCreatorHostingApplicationReview={handleCreatorHostingApplicationReview}
          req={req}
          reviewingCreatorHostingApplicationId={reviewingCreatorHostingApplicationId}
          setCreatorHostingApplicationReviewNotes={setCreatorHostingApplicationReviewNotes}
        />
      ))}
    </div>
  );
}
