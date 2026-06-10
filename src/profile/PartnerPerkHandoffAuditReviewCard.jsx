export default function PartnerPerkHandoffAuditReviewCard({
  approvedPartnerPerkHandoffAuditReviews = [],
  isSubmittingPartnerPerkHandoffAuditReview,
  onDecision = () => {},
  onSubmit = () => {},
  partnerPerkHandoffAuditReviewMessage,
  partnerPerkHandoffAuditReviewNotes = {},
  partnerPerkHandoffAuditReviewQueue = [],
  reviewingPartnerPerkHandoffAuditReviewId,
  setPartnerPerkHandoffAuditReviewNotes = () => {},
}) {
  return (
    <div style={{ border: '1px solid rgba(134,239,172,0.2)', borderRadius: 12, padding: 11, background: 'rgba(134,239,172,0.07)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <div>
          <div style={{ color: '#86EFAC', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PARTNER PERK HANDOFF AUDIT REVIEW RECORD</div>
          <div style={{ color: '#aaa', fontSize: 11, marginTop: 4 }}>
            Save aggregate partnerPerkHandoffAuditReviews evidence with manualReviewOnly true, createsCoupons false, createsPartnerLinks false, createsPayouts false, createsDiscounts false, createsPurchases false, writesEntitlements false, createsAffiliateRewards false, hasTrackingPixels false, usesAdTargeting false, exportsThirdPartyData false, makesPaidAccessClaims false, collectsPayment false, processesRefunds false, promisesFulfillment false, autoMessagesUsers false, scrapesMessages false, and pressuresMembers false.
          </div>
        </div>
        <button
          type="button"
          disabled={isSubmittingPartnerPerkHandoffAuditReview}
          onClick={onSubmit}
          style={{ border: '1px solid rgba(134,239,172,0.42)', background: 'rgba(134,239,172,0.12)', color: '#BBF7D0', borderRadius: 8, padding: '8px 10px', fontSize: 10, fontWeight: 900, fontFamily: 'monospace', cursor: isSubmittingPartnerPerkHandoffAuditReview ? 'wait' : 'pointer' }}
        >
          {isSubmittingPartnerPerkHandoffAuditReview ? 'SAVING...' : 'SAVE AUDIT REVIEW'}
        </button>
      </div>
      {partnerPerkHandoffAuditReviewMessage && (
        <div style={{ color: '#FDE68A', fontSize: 11, marginTop: 8 }}>{partnerPerkHandoffAuditReviewMessage}</div>
      )}
      <div style={{ color: '#9CA3AF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace', marginTop: 10 }}>PARTNER PERK HANDOFF AUDIT REVIEW QUEUE</div>
      {partnerPerkHandoffAuditReviewQueue.length === 0 ? (
        <div style={{ color: '#777', fontSize: 11, marginTop: 6 }}>No partner perk handoff audit reviews are waiting.</div>
      ) : partnerPerkHandoffAuditReviewQueue.slice(0, 4).map(review => (
        <div key={review.id} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.16)', marginTop: 8 }}>
          <div style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>
            {review.displayName || review.email || review.uid || 'Admin'} · {review.reviewScoreLabel || 'SEED'} {Number(review.reviewScore || 0)}
          </div>
          <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 4 }}>
            Open claims {review.openClaimCount || 0} · Top demand {review.topPerkId || 'gear'} {review.topPerkDemand || 0} · Reach {review.campaignReach || 0}
          </div>
          <textarea
            value={partnerPerkHandoffAuditReviewNotes[review.id] || ''}
            onChange={e => setPartnerPerkHandoffAuditReviewNotes(prev => ({ ...prev, [review.id]: e.target.value }))}
            placeholder="Manual audit note: aggregate support outcome, no-promise note, unresolved support risk"
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
                disabled={reviewingPartnerPerkHandoffAuditReviewId === review.id}
                onClick={() => onDecision(review, status)}
                style={{ border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.05)', color: '#BBF7D0', borderRadius: 8, padding: '6px 8px', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}
              >
                {reviewingPartnerPerkHandoffAuditReviewId === review.id ? '...' : label}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div style={{ color: '#777', fontSize: 11, marginTop: 8 }}>
        {approvedPartnerPerkHandoffAuditReviews.length} approved manual records. Approved records still do not create coupons, links, payouts, discounts, purchases, entitlements, tracking, refunds, fulfillment promises, auto-messages, scraped messages, or pressure.
      </div>
    </div>
  );
}
