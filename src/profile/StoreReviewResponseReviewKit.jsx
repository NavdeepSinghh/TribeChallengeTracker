export default function StoreReviewResponseReviewKit({
  approvedStoreReviewResponseReviews = [],
  isSubmittingStoreReviewResponseReview,
  onStoreReviewResponseReviewDecision = () => {},
  onStoreReviewResponseReviewSubmit = () => {},
  reviewingStoreReviewResponseReviewId,
  setStoreReviewResponseReviewNotes = () => {},
  storeReviewResponseReviewMessage,
  storeReviewResponseReviewNotes = {},
  storeReviewResponseReviewQueue = [],
}) {
  return (
    <div style={{ border: '1px solid rgba(249,115,22,0.20)', borderRadius: 12, padding: 12, background: 'rgba(249,115,22,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 8 }}>
        <div>
          <div style={{ color: '#FDBA74', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}>STORE REVIEW RESPONSE REVIEW RECORD</div>
          <div style={{ color: '#ddd', fontSize: 12, marginTop: 4 }}>
            Save response readiness into storeReviewResponseReviews with manualReviewOnly true, submitsStoreReview false, bypassesMarketplacePolicy false, exposesPrivateUserData false, includesSecrets false, unlocksPaidAccess false, writesEntitlements false, createsPurchases false, processesRefunds false, claimsReviewApproval false, isPaidAccessLive false, hasTrackingPixels false, and scrapesMessages false.
          </div>
        </div>
        <button
          type="button"
          disabled={isSubmittingStoreReviewResponseReview}
          onClick={onStoreReviewResponseReviewSubmit}
          style={{ border: '1px solid rgba(249,115,22,0.5)', background: 'rgba(249,115,22,0.14)', color: '#FED7AA', borderRadius: 8, padding: '8px 10px', fontSize: 10, fontWeight: 900, fontFamily: 'monospace', cursor: isSubmittingStoreReviewResponseReview ? 'wait' : 'pointer' }}
        >
          {isSubmittingStoreReviewResponseReview ? 'SAVING...' : 'SAVE REVIEW RESPONSE REVIEW'}
        </button>
      </div>
      {storeReviewResponseReviewMessage && (
        <div style={{ color: '#FDE68A', fontSize: 11, marginBottom: 8 }}>{storeReviewResponseReviewMessage}</div>
      )}
      <div style={{ display: 'grid', gap: 8 }}>
        <div style={{ color: '#9CA3AF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>STORE REVIEW RESPONSE REVIEW QUEUE</div>
        {storeReviewResponseReviewQueue.length === 0 ? (
          <div style={{ color: '#777', fontSize: 11 }}>No store review response records are waiting.</div>
        ) : storeReviewResponseReviewQueue.slice(0, 4).map(review => (
          <StoreReviewResponseReviewRow
            key={review.id}
            onReview={status => onStoreReviewResponseReviewDecision(review, status)}
            review={review}
            reviewing={reviewingStoreReviewResponseReviewId === review.id}
            setStoreReviewResponseReviewNotes={setStoreReviewResponseReviewNotes}
            value={storeReviewResponseReviewNotes[review.id] || ''}
          />
        ))}
        <div style={{ color: '#9CA3AF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace', marginTop: 4 }}>APPROVED STORE REVIEW RESPONSE REVIEWS</div>
        <div style={{ color: '#777', fontSize: 11 }}>
          {approvedStoreReviewResponseReviews.length} approved manual records. Approved records still do not submit store review, expose private data, include secrets, unlock paid access, write entitlements, create purchases, process refunds, claim review approval, mark paid access live, add tracking pixels, scrape messages, or bypass marketplace policy.
        </div>
      </div>
    </div>
  );
}

function StoreReviewResponseReviewRow({
  onReview,
  review,
  reviewing,
  setStoreReviewResponseReviewNotes,
  value,
}) {
  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.18)' }}>
      <div style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>
        {review.displayName || review.email || review.uid || 'Admin'} · {review.reviewScoreLabel || 'SEED'} {Number(review.reviewScore || 0)}
      </div>
      <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 4 }}>
        Evidence {review.storeEvidenceCount || 0} · Needs review {review.needsReviewEvidenceCount || 0} · Failed {review.failedStoreEvidenceCount || 0} · Support {review.openSupportCount || 0} · Recovery {review.entitlementRecoveryCount || 0} · Products {review.productCount || 0}
      </div>
      <textarea
        value={value}
        onChange={e => setStoreReviewResponseReviewNotes(prev => ({ ...prev, [review.id]: e.target.value }))}
        placeholder="Manual reviewer response readiness note"
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
            style={{ border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.05)', color: '#FED7AA', borderRadius: 8, padding: '6px 8px', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}
          >
            {reviewing ? '...' : label}
          </button>
        ))}
      </div>
    </div>
  );
}
