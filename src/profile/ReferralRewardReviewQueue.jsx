import ReferralRewardReviewQueueItem from './ReferralRewardReviewQueueItem';

export default function ReferralRewardReviewQueue({
  onReferralRewardClaimReview,
  referralRewardReviewNotes,
  referralRewardReviewQueue,
  reviewingReferralRewardClaimId,
  setReferralRewardReviewNotes,
}) {
  return (
    <div style={{
      borderRadius: 16, padding: 14, marginBottom: 20,
      background: 'rgba(52,211,153,0.045)', border: '1px solid rgba(52,211,153,0.14)',
    }}>
      <p style={{ margin: 0, color: '#fff', fontSize: 12, fontWeight: 900, fontFamily: 'monospace' }}>REFERRAL REWARD REVIEW QUEUE</p>
      <p style={{ margin: '8px 0 10px', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
        Admin-only queue for open referralRewardClaims. Verify meaningful challenge joins before fulfillment; do not grant Pro, entitlements, discounts, payouts, purchases, or affiliate rewards from this profile UI.
      </p>
      {referralRewardReviewQueue.length === 0 ? (
        <div style={{ color: '#666', fontSize: 11, fontWeight: 800 }}>No open referral reward claims.</div>
      ) : referralRewardReviewQueue.slice(0, 5).map(req => (
        <ReferralRewardReviewQueueItem
          key={req.id}
          onReferralRewardClaimReview={onReferralRewardClaimReview}
          referralRewardReviewNotes={referralRewardReviewNotes}
          req={req}
          reviewingReferralRewardClaimId={reviewingReferralRewardClaimId}
          setReferralRewardReviewNotes={setReferralRewardReviewNotes}
        />
      ))}
    </div>
  );
}
