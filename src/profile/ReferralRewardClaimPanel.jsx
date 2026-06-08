export default function ReferralRewardClaimPanel({
  isClaimingReferralReward,
  onReferralRewardClaim,
  referralRewardClaimMessage,
  unlockedReferralRewardTier,
}) {
  return (
    <div style={{
      marginTop: 12, padding: 12, borderRadius: 12,
      background: 'rgba(52,211,153,0.055)', border: '1px solid rgba(52,211,153,0.16)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}>REFERRAL REWARD CLAIM</p>
          <p style={{ margin: '5px 0 0', color: '#9AE6B4', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
            {unlockedReferralRewardTier ? `${unlockedReferralRewardTier.label} ready` : '1 JOIN TO UNLOCK'}
          </p>
        </div>
        <span style={{ color: '#34D399', fontSize: 18, fontWeight: 900 }}>✓</span>
      </div>
      <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
        Request review for your highest unlocked referral tier. This is request-only and does not grant Pro, entitlements, discounts, purchases, payouts, or affiliate rewards.
      </p>
      <button
        type="button"
        onClick={onReferralRewardClaim}
        disabled={isClaimingReferralReward || !unlockedReferralRewardTier}
        style={{
          marginTop: 10, width: '100%', border: 0, borderRadius: 12, padding: '11px 10px',
          background: unlockedReferralRewardTier ? '#34D399' : 'rgba(255,255,255,0.08)',
          color: unlockedReferralRewardTier ? '#111' : '#666',
          fontSize: 10, fontWeight: 900, fontFamily: 'monospace', letterSpacing: 1,
        }}
      >
        {isClaimingReferralReward ? 'SENDING REFERRAL REWARD CLAIM...' : 'CLAIM REFERRAL REWARD'}
      </button>
      {referralRewardClaimMessage && (
        <div style={{ marginTop: 9, color: referralRewardClaimMessage.includes('sent') ? '#34D399' : '#ffb199', fontSize: 10, fontWeight: 800, lineHeight: 1.35 }}>
          {referralRewardClaimMessage}
        </div>
      )}
    </div>
  );
}
