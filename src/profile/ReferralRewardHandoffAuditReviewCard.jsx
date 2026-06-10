export default function ReferralRewardHandoffAuditReviewCard({
  approvedReferralRewardHandoffAuditReviews = [],
  isSubmittingReferralRewardHandoffAuditReview,
  onDecision = () => {},
  onSubmit = () => {},
  referralRewardHandoffAuditReviewMessage,
  referralRewardHandoffAuditReviewNotes = {},
  referralRewardHandoffAuditReviewQueue = [],
  reviewingReferralRewardHandoffAuditReviewId,
  setReferralRewardHandoffAuditReviewNotes = () => {},
}) {
  return (
    <div style={{ border: '1px solid rgba(45,212,191,0.22)', borderRadius: 12, padding: 11, background: 'rgba(45,212,191,0.07)', marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <div>
          <div style={{ color: '#5EEAD4', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>REFERRAL REWARD HANDOFF AUDIT REVIEW RECORD</div>
          <div style={{ color: '#aaa', fontSize: 11, marginTop: 4 }}>
            Save aggregate referralRewardHandoffAuditReviews evidence with manualReviewOnly true, grantsPro false, writesEntitlements false, createsPayouts false, createsPurchases false, createsDiscounts false, createsAffiliateRewards false, writesReferralState false, countsLinkOpens false, claimsFulfillment false, hasTrackingPixels false, autoMessagesUsers false, scrapesMessages false, storesReplies false, and pressuresMembers false.
          </div>
        </div>
        <button
          type="button"
          disabled={isSubmittingReferralRewardHandoffAuditReview}
          onClick={onSubmit}
          style={{ border: '1px solid rgba(45,212,191,0.42)', background: 'rgba(45,212,191,0.12)', color: '#99F6E4', borderRadius: 8, padding: '8px 10px', fontSize: 10, fontWeight: 900, fontFamily: 'monospace', cursor: isSubmittingReferralRewardHandoffAuditReview ? 'wait' : 'pointer' }}
        >
          {isSubmittingReferralRewardHandoffAuditReview ? 'SAVING...' : 'SAVE REFERRAL AUDIT'}
        </button>
      </div>
      {referralRewardHandoffAuditReviewMessage && (
        <div style={{ color: '#FDE68A', fontSize: 11, marginTop: 8 }}>{referralRewardHandoffAuditReviewMessage}</div>
      )}
      <div style={{ color: '#9CA3AF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace', marginTop: 10 }}>REFERRAL REWARD HANDOFF AUDIT REVIEW QUEUE</div>
      {referralRewardHandoffAuditReviewQueue.length === 0 ? (
        <div style={{ color: '#777', fontSize: 11, marginTop: 6 }}>No referral reward handoff audit reviews are waiting.</div>
      ) : referralRewardHandoffAuditReviewQueue.slice(0, 4).map(review => (
        <div key={review.id} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.16)', marginTop: 8 }}>
          <div style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>
            {review.displayName || review.email || review.uid || 'Admin'} · {review.reviewScoreLabel || 'SEED'} {Number(review.reviewScore || 0)}
          </div>
          <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 4 }}>
            Open claims {review.openClaimCount || 0} · Highest tier {review.highestTierTarget || 0} · Referral joins {review.referralJoins || 0}
          </div>
          <textarea
            value={referralRewardHandoffAuditReviewNotes[review.id] || ''}
            onChange={e => setReferralRewardHandoffAuditReviewNotes(prev => ({ ...prev, [review.id]: e.target.value }))}
            placeholder="Manual audit note: recognition handoff, claim status, unresolved support risk"
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
                disabled={reviewingReferralRewardHandoffAuditReviewId === review.id}
                onClick={() => onDecision(review, status)}
                style={{ border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.05)', color: '#99F6E4', borderRadius: 8, padding: '6px 8px', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}
              >
                {reviewingReferralRewardHandoffAuditReviewId === review.id ? '...' : label}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div style={{ color: '#777', fontSize: 11, marginTop: 8 }}>
        {approvedReferralRewardHandoffAuditReviews.length} approved manual records. Approved records still do not grant Pro, write entitlements, create payouts, purchases, discounts, affiliate rewards, referral state, tracking, auto-messages, scraped replies, fulfillment claims, or pressure.
      </div>
    </div>
  );
}
