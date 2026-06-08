import ReferralRewardMetric from './ReferralRewardMetric';

export default function ReferralRewardDecisionReplyKit({
  copyText,
  referralJoins,
  referralRewardDecisionReplyCopy,
  referralRewardReviewQueue,
  unlockedReferralRewardTier,
}) {
  return (
    <div style={{
      borderRadius: 14, padding: 12, marginBottom: 20,
      background: 'rgba(20,184,166,0.055)', border: '1px solid rgba(20,184,166,0.16)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, color: '#14B8A6', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}>REFERRAL REWARD DECISION REPLY KIT</p>
          <p style={{ margin: '5px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>Manual referral-claim decision replies</p>
        </div>
        <span style={{ color: referralRewardReviewQueue.length ? '#14B8A6' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
          COPY ONLY
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 10 }}>
        {[
          ['OPEN', referralRewardReviewQueue.length],
          ['JOINS', referralJoins],
          ['TIER', unlockedReferralRewardTier?.label || 'NEXT'],
        ].map(([label, value]) => (
          <ReferralRewardMetric key={label} label={label} value={value} />
        ))}
      </div>
      <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
        Copy approved, waiting, not-ready, and declined referral reward replies without granting Pro, entitlements, discounts, payouts, purchases, affiliate rewards, or fulfillment promises.
      </p>
      <button
        type="button"
        onClick={() => copyText(referralRewardDecisionReplyCopy, 'Referral reward decision replies copied')}
        style={{
          marginTop: 10, width: '100%', border: 0, borderRadius: 12, padding: '10px',
          background: 'rgba(20,184,166,0.12)', color: '#14B8A6',
          fontSize: 10, fontWeight: 900, fontFamily: 'monospace', letterSpacing: 1,
        }}
      >
        COPY REFERRAL REWARD DECISION REPLIES
      </button>
    </div>
  );
}
