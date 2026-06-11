export default function SupportRefundReadinessReviewKit({
  approvedSupportRefundReadinessReviews = [],
  isSubmittingSupportRefundReadinessReview,
  onSupportRefundReadinessReviewDecision = () => {},
  onSupportRefundReadinessReviewSubmit = () => {},
  reviewingSupportRefundReadinessReviewId,
  setSupportRefundReadinessReviewNotes = () => {},
  supportRefundReadinessReviewMessage,
  supportRefundReadinessReviewNotes = {},
  supportRefundReadinessReviewQueue = [],
}) {
  const supportRefundReadinessReviewDecisionReplyCopy = `Rise With The Tribe Support Refund Readiness Review Decision Reply Kit:

APPROVED FOR SUPPORT READINESS:
Support/refund readiness evidence is approved for manual launch-gate review. Confirm marketplace refund routing, restore guidance, entitlement recovery handoff, support escalation owner, and store-test evidence before paid access is promoted.

WAITING ON SUPPORT EVIDENCE:
Keep this review open. Support coverage, entitlement recovery proof, restore flow notes, marketplace refund guidance, or failed/needs-review store evidence needs stronger first-party documentation before launch decisions.

NOT READY FOR SUPPORT HANDOFF:
Do not use this as launch support proof yet. The record still needs clearer support ownership, recovery steps, store-test evidence, policy-safe refund routing, or customer-facing handoff copy.

DECLINED FOR LAUNCH SUPPORT:
This record is not acceptable launch support evidence right now. Rebuild the support/refund readiness packet before using it in paid launch, store review, or customer support preparation.

This is a manual Support Refund Readiness Review Decision Reply Kit only. Do not process refunds, cancel subscriptions, write entitlements, create purchases, collect payment details, bypass App Store or Google Play policy, promote paid access as live, promise outcomes, imply medical results, auto-message users, scrape/store DMs, add tracking pixels, or pressure members.`;

  return (
    <div style={{ border: '1px solid rgba(45,212,191,0.18)', borderRadius: 12, padding: 12, background: 'rgba(45,212,191,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 8 }}>
        <div>
          <div style={{ color: '#2DD4BF', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}>SUPPORT REFUND READINESS REVIEW RECORD</div>
          <div style={{ color: '#ddd', fontSize: 12, marginTop: 4 }}>
            Save manual evidence into supportRefundReadinessReviews with manualReviewOnly true, processesRefunds false, cancelsSubscriptions false, writesEntitlements false, createsPurchases false, bypassesMarketplacePolicy false, collectsPaymentDetails false, and isPaidAccessLive false.
          </div>
        </div>
        <button
          type="button"
          disabled={isSubmittingSupportRefundReadinessReview}
          onClick={onSupportRefundReadinessReviewSubmit}
          style={{ border: '1px solid rgba(45,212,191,0.5)', background: 'rgba(45,212,191,0.12)', color: '#CCFBF1', borderRadius: 8, padding: '8px 10px', fontSize: 10, fontWeight: 900, fontFamily: 'monospace', cursor: isSubmittingSupportRefundReadinessReview ? 'wait' : 'pointer' }}
        >
          {isSubmittingSupportRefundReadinessReview ? 'SAVING...' : 'SAVE SUPPORT READINESS REVIEW'}
        </button>
      </div>
      {supportRefundReadinessReviewMessage && (
        <div style={{ color: '#FDE68A', fontSize: 11, marginBottom: 8 }}>{supportRefundReadinessReviewMessage}</div>
      )}
      <div style={{ display: 'grid', gap: 8 }}>
        <div style={{ color: '#9CA3AF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>SUPPORT REFUND READINESS REVIEW QUEUE</div>
        {supportRefundReadinessReviewQueue.length === 0 ? (
          <div style={{ color: '#777', fontSize: 11 }}>No support readiness review records are waiting.</div>
        ) : supportRefundReadinessReviewQueue.slice(0, 4).map(review => (
          <SupportRefundReadinessReviewRow
            key={review.id}
            onReview={status => onSupportRefundReadinessReviewDecision(review, status)}
            review={review}
            reviewing={reviewingSupportRefundReadinessReviewId === review.id}
            setSupportRefundReadinessReviewNotes={setSupportRefundReadinessReviewNotes}
            value={supportRefundReadinessReviewNotes[review.id] || ''}
          />
        ))}
        <div style={{ color: '#9CA3AF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace', marginTop: 4 }}>APPROVED SUPPORT REFUND READINESS REVIEWS</div>
        <div style={{ color: '#777', fontSize: 11 }}>
          {approvedSupportRefundReadinessReviews.length} approved manual records. Approved records still do not process refunds, cancel subscriptions, write entitlements, create purchases, collect payment details, bypass marketplace policy, or mark paid access live.
        </div>
        <div style={{ border: '1px solid rgba(251,191,36,0.2)', borderRadius: 10, padding: 10, background: 'rgba(251,191,36,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: '#FBBF24', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>SUPPORT REFUND READINESS REVIEW DECISION REPLY KIT</div>
              <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 4 }}>Manual support readiness decision replies. Copy-only: no refunds, cancellations, entitlement writes, purchases, payment-detail collection, marketplace bypass, or paid-live promotion.</div>
            </div>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(supportRefundReadinessReviewDecisionReplyCopy)}
              style={{ border: '1px solid rgba(251,191,36,0.45)', background: 'rgba(251,191,36,0.12)', color: '#FDE68A', borderRadius: 8, padding: '7px 9px', fontSize: 9, fontWeight: 900, fontFamily: 'monospace', cursor: 'pointer' }}
            >
              COPY SUPPORT READINESS DECISION REPLIES
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6, marginTop: 10 }}>
            <MiniMetric label="OPEN" value={supportRefundReadinessReviewQueue.length} />
            <MiniMetric label="APPROVED" value={approvedSupportRefundReadinessReviews.length} />
            <MiniMetric label="EVIDENCE" value={supportRefundReadinessReviewQueue.reduce((sum, review) => sum + Number(review.storeEvidenceCount || 0), 0)} />
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

function SupportRefundReadinessReviewRow({
  onReview,
  review,
  reviewing,
  setSupportRefundReadinessReviewNotes,
  value,
}) {
  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.18)' }}>
      <div style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>
        {review.displayName || review.email || review.uid || 'Member'} · {review.reviewScoreLabel || 'SEED'} {Number(review.reviewScore || 0)}
      </div>
      <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 4 }}>
        Support {review.openSupportCount || 0} · Recovery {review.entitlementRecoveryCount || 0} · Store evidence {review.storeEvidenceCount || 0} · Needs review {review.needsReviewEvidenceCount || 0} · Failed {review.failedStoreEvidenceCount || 0}
      </div>
      <textarea
        value={value}
        onChange={e => setSupportRefundReadinessReviewNotes(prev => ({ ...prev, [review.id]: e.target.value }))}
        placeholder="Manual support/refund readiness note"
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
            style={{ border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.05)', color: '#CCFBF1', borderRadius: 8, padding: '6px 8px', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}
          >
            {reviewing ? '...' : label}
          </button>
        ))}
      </div>
    </div>
  );
}
