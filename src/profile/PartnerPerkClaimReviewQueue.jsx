import PartnerPerkClaimReviewQueueItem from './PartnerPerkClaimReviewQueueItem';

export default function PartnerPerkClaimReviewQueue({
  hasClaims,
  onPartnerPerkClaimReview,
  partnerPerkClaimReviewQueue,
  partnerPerkReviewNotes,
  reviewingPartnerPerkClaimId,
  setPartnerPerkReviewNotes,
}) {
  return (
    <div style={{
      marginTop: 10, borderRadius: 12, padding: 11,
      background: 'rgba(96,165,250,0.075)', border: '1px solid rgba(96,165,250,0.18)',
    }}>
      <p style={{ margin: 0, color: '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PARTNER PERK CLAIM REVIEW QUEUE</p>
      <p style={{ margin: '8px 0 10px', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
        Admin-only queue for open partnerPerkClaims. Review eligibility, partner fit, disclosure, support ownership, and fulfillment readiness manually; do not create coupons, partner links, payouts, discounts, purchases, entitlements, or paid-access claims from profile UI.
      </p>
      {!hasClaims ? (
        <div style={{ color: '#666', fontSize: 11, fontWeight: 800 }}>No open partner perk claims.</div>
      ) : partnerPerkClaimReviewQueue.slice(0, 5).map(req => (
        <PartnerPerkClaimReviewQueueItem
          key={req.id}
          onPartnerPerkClaimReview={onPartnerPerkClaimReview}
          partnerPerkReviewNotes={partnerPerkReviewNotes}
          req={req}
          reviewingPartnerPerkClaimId={reviewingPartnerPerkClaimId}
          setPartnerPerkReviewNotes={setPartnerPerkReviewNotes}
        />
      ))}
    </div>
  );
}
