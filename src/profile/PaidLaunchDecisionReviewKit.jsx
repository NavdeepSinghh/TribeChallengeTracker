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
  const paidLaunchDecisionReviewDecisionReplyCopy = `Rise With The Tribe Paid Launch Decision Review Decision Reply Kit:

APPROVED FOR FINAL LAUNCH REVIEW:
The paid launch decision review record is approved for final human launch review. Confirm product IDs, backend receipt validation, sandbox/license-test evidence, restore flow, support/refund handoff, entitlement QA, policy links, and reviewer notes before any paid-access promotion.

WAITING ON LAUNCH EVIDENCE:
Keep this paid launch decision record open. Add stronger product setup proof, sandbox/license-test evidence, backend validation notes, entitlement QA, support/refund coverage, policy links, or reviewer-prep context before launch review.

NOT READY FOR PAID LAUNCH:
Do not use this record as launch approval. A blocker remains in product setup, receipt validation, store evidence, restore behavior, entitlement QA, support policy, privacy/data safety, or marketplace review readiness.

DECLINED FOR PAID LAUNCH:
This record is not acceptable for final paid launch review right now. Rebuild the launch decision packet around verified store evidence, support readiness, entitlement QA, policy compliance, and marketplace-safe wording.

This is a manual Paid Launch Decision Review Decision Reply Kit only. Do not flip paid access live, write entitlements, create purchases, process payments, process refunds, cancel subscriptions, collect payment details, submit store review, claim launch readiness, claim sandbox proof, mark paid access live, add tracking pixels, scrape messages, bypass App Store or Google Play policy, auto-message users, or pressure members.`;

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
        <div style={{ border: '1px solid rgba(251,191,36,0.2)', borderRadius: 10, padding: 10, background: 'rgba(251,191,36,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: '#FBBF24', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PAID LAUNCH DECISION REVIEW DECISION REPLY KIT</div>
              <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 4 }}>Manual launch review decision replies. Copy-only: no paid-live flip, entitlement writes, purchases, payments, refunds, cancellations, payment-detail collection, store submission, launch-readiness claims, sandbox-proof claims, tracking, scraping, or marketplace bypass.</div>
            </div>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(paidLaunchDecisionReviewDecisionReplyCopy)}
              style={{ border: '1px solid rgba(251,191,36,0.45)', background: 'rgba(251,191,36,0.12)', color: '#FDE68A', borderRadius: 8, padding: '7px 9px', fontSize: 9, fontWeight: 900, fontFamily: 'monospace', cursor: 'pointer' }}
            >
              COPY PAID LAUNCH REVIEW DECISION REPLIES
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6, marginTop: 10 }}>
            <MiniMetric label="OPEN" value={paidLaunchDecisionReviewQueue.length} />
            <MiniMetric label="APPROVED" value={approvedPaidLaunchDecisionReviews.length} />
            <MiniMetric label="READY" value={paidLaunchDecisionReviewQueue.reduce((sum, review) => sum + Number(review.readyCheckCount || 0), 0)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 8, background: 'rgba(0,0,0,0.18)' }}>
      <div style={{ color: '#9CA3AF', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</div>
      <div style={{ color: '#FDE68A', fontSize: 14, fontWeight: 900, marginTop: 2 }}>{value}</div>
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
