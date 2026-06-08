import { REFERRAL_TIERS } from './profileConstants';
import { ReferralMetric } from './ReferralRewardCards';

export default function ReferralRewardProgressPanel({
  referralJoins,
  referralState,
}) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Referral rewards</p>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
            {referralJoins} attributed challenge join{referralJoins === 1 ? '' : 's'}
          </p>
        </div>
        <span style={{ color: referralState.achieved?.color || '#34D399', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}>
          {referralState.achieved?.label?.toUpperCase() || 'STARTER'}
        </span>
      </div>
      <div style={{ marginTop: 12, height: 7, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{
          width: `${referralState.pct}%`, height: '100%',
          background: referralState.next?.color || referralState.achieved?.color || '#34D399',
          borderRadius: 999,
        }} />
      </div>
      <p style={{ margin: '10px 0 0', color: '#bbb', fontSize: 11, lineHeight: 1.35 }}>
        {referralState.next
          ? `Next: ${referralState.next.label} at ${referralState.next.target} joins · ${referralState.next.reward}`
          : 'All current referral tiers unlocked. Keep building the tribe.'}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
        {[
          ['TIERS EARNED', `${referralState.earnedCount}/${REFERRAL_TIERS.length}`],
          ['TO NEXT', referralState.next ? `${referralState.remainingToNext}` : '0'],
          ['LADDER', `${Math.round(referralState.ladderPct)}%`],
        ].map(([label, value]) => (
          <ReferralMetric key={label} label={label} value={value} centered />
        ))}
      </div>
      <p style={{ margin: '10px 0 0', color: '#777', fontSize: 10, lineHeight: 1.45, fontFamily: 'monospace' }}>
        Best next action: share a challenge launch card after creating or opening a challenge.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
        {REFERRAL_TIERS.map(tier => {
          const done = referralJoins >= tier.target;
          return (
            <div key={tier.target} style={{
              borderRadius: 12, padding: 10,
              border: `1px solid ${done ? tier.color + '66' : 'rgba(255,255,255,0.06)'}`,
              background: done ? `${tier.color}12` : 'rgba(0,0,0,0.18)',
            }}>
              <p style={{ margin: 0, color: done ? tier.color : '#777', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                {tier.target} JOIN{tier.target === 1 ? '' : 'S'}
              </p>
              <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 11, fontWeight: 900 }}>{tier.label}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
