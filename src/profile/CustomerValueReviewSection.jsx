export default function CustomerValueReviewSection({
  approvedCustomerValueReviews = [],
  customerValueReviewMessage,
  customerValueReviewNotes = {},
  customerValueReviewQueue = [],
  isAdmin,
  isSubmittingCustomerValueReview,
  onCustomerValueReviewDecision,
  onCustomerValueReviewSubmit,
  reviewingCustomerValueReviewId,
  setCustomerValueReviewNotes,
}) {
  if (!isAdmin) return null;

  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: 'rgba(45,212,191,0.05)',
      border: '1px solid rgba(45,212,191,0.16)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>CUSTOMER VALUE REVIEW RECORD</p>
          <p style={{ margin: '4px 0 0', color: '#2DD4BF', fontSize: 10, fontFamily: 'monospace' }}>
            Manual proof before charging
          </p>
        </div>
        <span style={{ color: '#2DD4BF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>REVIEW ONLY</span>
      </div>
      <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
        Save first-party free-loop value evidence into customerValueReviews with manualReviewOnly true, chargesUsers false, unlocksPaidAccess false, writesEntitlements false, createsDiscounts false, isPaidAccessLive false, and promotesPaidFeatures false.
      </p>
      <button
        onClick={onCustomerValueReviewSubmit}
        disabled={isSubmittingCustomerValueReview}
        style={{
          marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
          border: '1px solid rgba(45,212,191,0.22)', background: 'rgba(45,212,191,0.10)',
          color: '#2DD4BF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
        }}
      >
        {isSubmittingCustomerValueReview ? 'SAVING...' : 'SAVE CUSTOMER VALUE REVIEW'}
      </button>
      {customerValueReviewMessage && (
        <p style={{ margin: '8px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.4, fontFamily: 'monospace' }}>
          {customerValueReviewMessage}
        </p>
      )}
      <p style={{ margin: '12px 0 0', color: '#fff', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>CUSTOMER VALUE REVIEW QUEUE</p>
      {customerValueReviewQueue.length === 0 ? (
        <p style={{ margin: '7px 0 0', color: '#777', fontSize: 10 }}>No customer value review records waiting.</p>
      ) : customerValueReviewQueue.slice(0, 4).map(review => (
        <div key={review.id} style={{ marginTop: 8, padding: 9, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ margin: 0, color: '#fff', fontSize: 11, fontWeight: 900 }}>Value score · {review.reviewScore || 0}/100</p>
          <p style={{ margin: '4px 0 0', color: '#999', fontSize: 10 }}>
            {review.displayName || review.email || review.uid} · days {review.activeDays || 0} · points {review.totalPoints || 0} · badges {review.earnedBadgeCount || 0}
          </p>
          <input
            value={customerValueReviewNotes[review.id] || ''}
            onChange={event => setCustomerValueReviewNotes?.(notes => ({
              ...(notes || {}),
              [review.id]: event.target.value,
            }))}
            placeholder="Manual review note"
            style={{ marginTop: 8, width: '100%', boxSizing: 'border-box', borderRadius: 8, padding: 8, background: '#111', color: '#fff', border: '1px solid #333', fontSize: 10 }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 8 }}>
            {[
              ['approved', 'APPROVE'],
              ['waiting', 'WAIT'],
              ['not_ready', 'NOT READY'],
              ['declined', 'DECLINE'],
            ].map(([status, label]) => (
              <button
                key={status}
                onClick={() => onCustomerValueReviewDecision?.(review, status)}
                disabled={reviewingCustomerValueReviewId === review.id}
                style={{ borderRadius: 8, padding: 7, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 9, fontWeight: 900 }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ))}
      <p style={{ margin: '10px 0 0', color: '#fff', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>APPROVED CUSTOMER VALUE REVIEWS</p>
      <p style={{ margin: '6px 0 0', color: '#777', fontSize: 10 }}>
        {approvedCustomerValueReviews.length} approved manual records. Approved records still do not charge users, unlock paid access, create discounts, write entitlements, or promote paid features as live.
      </p>
    </div>
  );
}
