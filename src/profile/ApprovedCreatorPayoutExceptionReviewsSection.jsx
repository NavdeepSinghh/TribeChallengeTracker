export default function ApprovedCreatorPayoutExceptionReviewsSection({
  approvedCreatorPayoutExceptionReviews = [],
}) {
  return (
    <div style={{ padding: 16, borderRadius: 12, background: 'rgba(251,113,133,0.06)', border: '1px solid rgba(251,113,133,0.16)', marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ color: '#FB7185', fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}>APPROVED CREATOR PAYOUT EXCEPTION REVIEWS</div>
        <span style={{ color: '#FB7185', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{approvedCreatorPayoutExceptionReviews.length} APPROVED</span>
      </div>
      <p style={{ margin: '8px 0 12px', color: '#aaa', fontSize: 12, lineHeight: 1.45 }}>
        Review-only payout exception evidence from creatorPayoutExceptionReviews. Approval confirms manual review only and does not resolve disputes, process refunds, collect tax forms, collect bank details, access payout providers, create payouts, move money, write entitlements, give tax advice, bypass marketplace policy, promise earnings, expose private member logs, scrape messages, or add tracking pixels.
      </p>
      {approvedCreatorPayoutExceptionReviews.length === 0 ? (
        <p style={{ margin: 0, color: '#777', fontSize: 11, fontWeight: 800 }}>No approved payout exception reviews yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          {approvedCreatorPayoutExceptionReviews.slice(0, 5).map(review => (
            <div key={review.id} style={{ borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{review.displayName || review.creatorSpecialty || review.uid}</div>
              <div style={{ color: '#aaa', fontSize: 11, lineHeight: 1.35, marginTop: 4 }}>
                {review.exceptionScoreLabel || 'HOLD'} {review.exceptionScore || 0} · support {review.supportCount || 0} · entitlement recovery {review.entitlementRecoveryCount || 0} · payout created {review.createsPayouts ? 'yes' : 'no'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
