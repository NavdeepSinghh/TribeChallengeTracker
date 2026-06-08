import { REFERRAL_REWARD_REVIEW_STATUS_OPTIONS } from './referralRewardReviewStatusOptions';

export default function ReferralRewardReviewQueueItem({
  onReferralRewardClaimReview,
  referralRewardReviewNotes,
  req,
  reviewingReferralRewardClaimId,
  setReferralRewardReviewNotes,
}) {
  const isReviewing = reviewingReferralRewardClaimId === req.id;

  return (
    <div style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{req.displayName || req.email || req.uid}</span>
        <span style={{ color: '#34D399', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{req.tierLabel || req.tierTarget}</span>
      </div>
      <div style={{ color: '#777', fontSize: 10, fontWeight: 700, marginTop: 4 }}>{req.referralJoins || 0} joins · {req.source || 'unknown'}</div>
      <div style={{ color: '#aaa', fontSize: 11, lineHeight: 1.35, marginTop: 6 }}>{req.reward}</div>
      <textarea
        value={referralRewardReviewNotes[req.id] || ''}
        onChange={event => setReferralRewardReviewNotes(notes => ({ ...notes, [req.id]: event.target.value.slice(0, 500) }))}
        placeholder="Manual referral reward review note: meaningful joins, duplicate checks, recognition plan, no Pro or payout grant..."
        rows={2}
        style={{
          width: '100%', marginTop: 8, border: '1px solid rgba(52,211,153,0.18)',
          borderRadius: 10, background: 'rgba(0,0,0,0.20)', color: '#fff', padding: 8,
          fontSize: 11, lineHeight: 1.35, resize: 'vertical', boxSizing: 'border-box',
        }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6, marginTop: 8 }}>
        {REFERRAL_REWARD_REVIEW_STATUS_OPTIONS.map(([status, label]) => (
          <button
            key={status}
            onClick={() => onReferralRewardClaimReview(req.id, status)}
            disabled={isReviewing}
            style={{
              border: 0, borderRadius: 8, padding: '7px 6px',
              background: 'rgba(52,211,153,0.14)', color: '#34D399',
              fontSize: 9, fontWeight: 900, fontFamily: 'monospace',
              cursor: isReviewing ? 'wait' : 'pointer',
            }}
          >
            {isReviewing ? 'SAVING' : label}
          </button>
        ))}
      </div>
    </div>
  );
}
