const PAYOUT_EXCEPTION_STATUSES = [
  ['approved', 'APPROVE'],
  ['waiting', 'WAIT'],
  ['not_ready', 'NOT READY'],
  ['declined', 'DECLINE'],
];

export default function CreatorPayoutExceptionReviewSection({
  creatorPayoutExceptionReviewNotes,
  creatorPayoutExceptionReviewQueue = [],
  handleCreatorPayoutExceptionReview,
  reviewingCreatorPayoutExceptionReviewId,
  setCreatorPayoutExceptionReviewNotes,
}) {
  return (
    <div style={{ padding: 16, borderRadius: 12, background: 'rgba(251,113,133,0.06)', border: '1px solid rgba(251,113,133,0.16)', marginBottom: 14 }}>
      <div style={{ color: '#FB7185', fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}>CREATOR PAYOUT EXCEPTION REVIEW QUEUE</div>
      <p style={{ margin: '8px 0 12px', color: '#aaa', fontSize: 12, lineHeight: 1.45 }}>
        Admin-only queue for creatorPayoutExceptionReviews. Review aggregate exception evidence; approval does not resolve payout disputes, process refunds, collect tax forms, collect government IDs, collect bank details, access payout providers, create payout accounts, create payouts, move money, write entitlements, give tax advice, bypass marketplace policy, or imply paid creator hosting is live.
      </p>
      {creatorPayoutExceptionReviewQueue.length === 0 ? (
        <p style={{ margin: 0, color: '#777', fontSize: 11, fontWeight: 800 }}>No open creator payout exception reviews.</p>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {creatorPayoutExceptionReviewQueue.map(review => (
            <div key={review.id} style={{ borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{review.displayName || review.email || review.uid}</span>
                <span style={{ color: review.exceptionScore >= 70 ? '#34D399' : '#FBBF24', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{review.exceptionScoreLabel || 'HOLD'} {review.exceptionScore || 0}</span>
              </div>
              <div style={{ color: '#aaa', fontSize: 11, lineHeight: 1.35, marginTop: 6 }}>
                App: {review.hostingApplicationStatus || 'missing'} · launch gates: {review.approvedLaunchGateCount || 0} approved / {review.openLaunchGateCount || 0} open · store evidence: {review.storeEvidenceCount || 0}
              </div>
              <div style={{ color: '#777', fontSize: 10, lineHeight: 1.35, marginTop: 4 }}>
                Support: {review.supportCount || 0} · entitlement recovery: {review.entitlementRecoveryCount || 0} · paid decisions: {review.paidLaunchDecisionCount || 0} · manualReviewOnly {review.manualReviewOnly === false ? 'false' : 'true'} · aggregateOnly {review.aggregateOnly === false ? 'false' : 'true'}
              </div>
              <textarea
                value={creatorPayoutExceptionReviewNotes[review.id] || ''}
                onChange={event => setCreatorPayoutExceptionReviewNotes(notes => ({ ...notes, [review.id]: event.target.value }))}
                placeholder="Manual payout exception note: support path, marketplace boundary, tax workflow gap, provider setup gap, no-money decision..."
                style={{ width: '100%', minHeight: 54, marginTop: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(0,0,0,0.22)', color: '#fff', padding: 8, fontSize: 11 }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6, marginTop: 8 }}>
                {PAYOUT_EXCEPTION_STATUSES.map(([status, label]) => (
                  <button
                    key={status}
                    onClick={() => handleCreatorPayoutExceptionReview(review, status)}
                    disabled={reviewingCreatorPayoutExceptionReviewId === review.id}
                    style={{ border: 0, borderRadius: 8, padding: '8px 6px', background: status === 'approved' ? '#FB7185' : 'rgba(255,255,255,0.08)', color: status === 'approved' ? '#23060b' : '#fff', fontSize: 9, fontWeight: 900, cursor: 'pointer' }}
                  >
                    {reviewingCreatorPayoutExceptionReviewId === review.id ? '...' : label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
