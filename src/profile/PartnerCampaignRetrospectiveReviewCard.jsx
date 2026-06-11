export default function PartnerCampaignRetrospectiveReviewCard({
  approvedPartnerCampaignRetrospectiveReviews = [],
  isSubmittingPartnerCampaignRetrospectiveReview,
  onDecision = () => {},
  onSubmit = () => {},
  partnerCampaignRetrospectiveReviewMessage,
  partnerCampaignRetrospectiveReviewNotes = {},
  partnerCampaignRetrospectiveReviewQueue = [],
  reviewingPartnerCampaignRetrospectiveReviewId,
  setPartnerCampaignRetrospectiveReviewNotes = () => {},
}) {
  return (
    <div style={{ border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: 11, background: 'rgba(34,197,94,0.07)', marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <div>
          <div style={{ color: '#86EFAC', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PARTNER CAMPAIGN RETROSPECTIVE REVIEW RECORD</div>
          <div style={{ color: '#aaa', fontSize: 11, marginTop: 4 }}>
            Save aggregate partnerCampaignRetrospectiveReviews evidence with manualReviewOnly true, aggregateOnly true, createsPartnerLinks false, hasTrackingPixels false, usesAdTargeting false, createsAffiliatePayouts false, createsCommissions false, createsCoupons false, createsDiscounts false, createsPurchases false, writesEntitlements false, startsRevenueShare false, makesPaidAccessClaims false, exportsThirdPartyData false, collectsPayment false, promisesFulfillment false, autoMessagesUsers false, scrapesMessages false, and pressuresPartnersOrMembers false.
          </div>
        </div>
        <button
          type="button"
          disabled={isSubmittingPartnerCampaignRetrospectiveReview}
          onClick={onSubmit}
          style={{ border: '1px solid rgba(34,197,94,0.42)', background: 'rgba(34,197,94,0.12)', color: '#BBF7D0', borderRadius: 8, padding: '8px 10px', fontSize: 10, fontWeight: 900, fontFamily: 'monospace', cursor: isSubmittingPartnerCampaignRetrospectiveReview ? 'wait' : 'pointer' }}
        >
          {isSubmittingPartnerCampaignRetrospectiveReview ? 'SAVING...' : 'SAVE RETROSPECTIVE REVIEW'}
        </button>
      </div>
      {partnerCampaignRetrospectiveReviewMessage && (
        <div style={{ color: '#FDE68A', fontSize: 11, marginTop: 8 }}>{partnerCampaignRetrospectiveReviewMessage}</div>
      )}
      <div style={{ color: '#9CA3AF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace', marginTop: 10 }}>PARTNER CAMPAIGN RETROSPECTIVE REVIEW QUEUE</div>
      {partnerCampaignRetrospectiveReviewQueue.length === 0 ? (
        <div style={{ color: '#777', fontSize: 11, marginTop: 6 }}>No partner campaign retrospective reviews are waiting.</div>
      ) : partnerCampaignRetrospectiveReviewQueue.slice(0, 4).map(review => (
        <div key={review.id} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.16)', marginTop: 8 }}>
          <div style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>
            {review.retrospectiveScoreLabel || 'PAUSE'} {Number(review.retrospectiveScore || 0)} · {review.topPerkId || 'gear'}
          </div>
          <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 4 }}>
            Reach {review.campaignReach || 0} · Referrals {review.referralJoins || 0} · Applications {review.openPartnerApplicationCount || 0} · Claims {review.openPerkClaimCount || 0}
          </div>
          <textarea
            value={partnerCampaignRetrospectiveReviewNotes[review.id] || ''}
            onChange={e => setPartnerCampaignRetrospectiveReviewNotes(prev => ({ ...prev, [review.id]: e.target.value }))}
            placeholder="Manual retrospective note: repeat, pause, partner fit, support notes, aggregate app movement"
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
                disabled={reviewingPartnerCampaignRetrospectiveReviewId === review.id}
                onClick={() => onDecision(review, status)}
                style={{ border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.05)', color: '#BBF7D0', borderRadius: 8, padding: '6px 8px', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}
              >
                {reviewingPartnerCampaignRetrospectiveReviewId === review.id ? '...' : label}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div style={{ color: '#777', fontSize: 11, marginTop: 8 }}>
        {approvedPartnerCampaignRetrospectiveReviews.length} approved manual records. Approved records still do not create links, tracking, payouts, coupons, purchases, entitlements, revenue-share, exports, fulfillment promises, auto-messages, scraped messages, or pressure.
      </div>
    </div>
  );
}
