export default function PaidLaunchDecisionReviewKit({
  approvedPaidLaunchDecisionReviews = [],
  isSubmittingPaidLaunchDecisionReview,
  onPaidLaunchDecisionReviewDecision = () => {},
  onPaidLaunchDecisionReviewSubmit = () => {},
  paidLaunchDecisionReviewMessage,
  paidLaunchDecisionReviewNotes = {},
  paidLaunchDecisionReviewQueue = [],
  reviewingPaidLaunchDecisionReviewId,
  setPaidLaunchDecisionReviewNotes = () => {},
}) {
  return (
    <div style={{ border: '1px solid rgba(248,113,113,0.22)', borderRadius: 12, padding: 12, background: 'rgba(248,113,113,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 8 }}>
        <div>
          <div style={{ color: '#FCA5A5', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}>PAID LAUNCH DECISION REVIEW RECORD</div>
          <div style={{ color: '#ddd', fontSize: 12, marginTop: 4 }}>
            Save final paid-launch gate evidence into paidLaunchDecisionReviews with manualReviewOnly true, flipsPaidAccessLive false, writesEntitlements false, createsPurchases false, processesPayments false, processesRefunds false, cancelsSubscriptions false, collectsPaymentDetails false, submitsStoreReview false, bypassesMarketplacePolicy false, claimsLaunchReadiness false, claimsSandboxProof false, isPaidAccessLive false, hasTrackingPixels false, and scrapesMessages false.
          </div>
        </div>
        <button
          type="button"
          disabled={isSubmittingPaidLaunchDecisionReview}
          onClick={onPaidLaunchDecisionReviewSubmit}
          style={{ border: '1px solid rgba(248,113,113,0.5)', background: 'rgba(248,113,113,0.14)', color: '#FECACA', borderRadius: 8, padding: '8px 10px', fontSize: 10, fontWeight: 900, fontFamily: 'monospace', cursor: isSubmittingPaidLaunchDecisionReview ? 'wait' : 'pointer' }}
        >
          {isSubmittingPaidLaunchDecisionReview ? 'SAVING...' : 'SAVE PAID LAUNCH REVIEW'}
        </button>
      </div>
      {paidLaunchDecisionReviewMessage && (
        <div style={{ color: '#FDE68A', fontSize: 11, marginBottom: 8 }}>{paidLaunchDecisionReviewMessage}</div>
      )}
      <div style={{ display: 'grid', gap: 8 }}>
        <div style={{ color: '#9CA3AF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PAID LAUNCH DECISION REVIEW QUEUE</div>
        {paidLaunchDecisionReviewQueue.length === 0 ? (
          <div style={{ color: '#777', fontSize: 11 }}>No paid launch decision reviews are waiting.</div>
        ) : paidLaunchDecisionReviewQueue.slice(0, 4).map(review => (
          <PaidLaunchDecisionReviewRow
            key={review.id}
            onReview={status => onPaidLaunchDecisionReviewDecision(review, status)}
            review={review}
            reviewing={reviewingPaidLaunchDecisionReviewId === review.id}
            setPaidLaunchDecisionReviewNotes={setPaidLaunchDecisionReviewNotes}
            value={paidLaunchDecisionReviewNotes[review.id] || ''}
          />
        ))}
        <div style={{ color: '#9CA3AF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace', marginTop: 4 }}>APPROVED PAID LAUNCH DECISION REVIEWS</div>
        <div style={{ color: '#777', fontSize: 11 }}>
          {approvedPaidLaunchDecisionReviews.length} approved manual records. Approved records still do not flip paid access live, write entitlements, create purchases, process payments, process refunds, submit store review, claim launch readiness, add tracking pixels, scrape messages, or bypass marketplace policy.
        </div>
      </div>
    </div>
  );
}

function PaidLaunchDecisionReviewRow({
  onReview,
  review,
  reviewing,
  setPaidLaunchDecisionReviewNotes,
  value,
}) {
  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.18)' }}>
      <div style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>
        {review.displayName || review.email || review.uid || 'Admin'} · {review.reviewScoreLabel || 'BLOCKED'} {Number(review.reviewScore || 0)}
      </div>
      <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 4 }}>
        Ready {review.readyCheckCount || 0}/{review.totalCheckCount || 6} · Evidence {review.storeEvidenceCount || 0} · Passed {review.passedStoreEvidenceCount || 0} · Failed {review.failedStoreEvidenceCount || 0} · Support {review.openSupportCount || 0} · Recovery {review.entitlementRecoveryCount || 0}
      </div>
      <textarea
        value={value}
        onChange={e => setPaidLaunchDecisionReviewNotes(prev => ({ ...prev, [review.id]: e.target.value }))}
        placeholder="Manual paid launch decision note"
        style={{ width: '100%', minHeight: 52, marginTop: 8, borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', padding: 8, resize: 'vertical' }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
        {[
          ['approved', 'APPROVE'],
          ['waiting', 'WAITING'],
          ['not_ready', 'NOT READY'],
          ['declined', 'DECLINE'],
        ].map(([status, label]) => (
          <button
            key={status}
            type="button"
            disabled={reviewing}
            onClick={() => onReview(status)}
            style={{ border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.05)', color: '#FECACA', borderRadius: 8, padding: '6px 8px', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}
          >
            {reviewing ? '...' : label}
          </button>
        ))}
      </div>
    </div>
  );
}
