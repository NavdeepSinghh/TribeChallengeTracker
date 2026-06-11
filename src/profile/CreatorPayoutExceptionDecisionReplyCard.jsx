function buildCreatorPayoutExceptionDecisionReplyCopy({
  openCount,
  approvedCount,
}) {
  return [
    'Rise With The Tribe Creator Payout Exception Review Decision Reply Kit:',
    '',
    `Open payout exception reviews: ${openCount}`,
    `Approved payout exception reviews: ${approvedCount}`,
    '',
    'Manual decision replies:',
    'APPROVED FOR MANUAL PAYOUT READINESS REVIEW: This creator payout exception review is approved as a manual readiness record. It does not resolve payout disputes, process refunds, collect tax or bank details, access payout providers, create payouts, move money, create purchases, write entitlements, give tax advice, or bypass marketplace policy.',
    '',
    'WAITING ON PAYOUT READINESS: This review needs more first-party readiness evidence before follow-up. Keep support, entitlement recovery, store evidence, launch-gate, and paid-launch decision notes in review without requesting payout, tax, bank, provider, purchase, or entitlement details.',
    '',
    'NOT READY FOR PAYOUT HANDOFF: This review is not ready for payout exception handoff. Keep creator hosting in review mode until support, marketplace, tax, provider, entitlement, and launch-gate readiness are stronger.',
    '',
    'DECLINED FOR PAYOUT HANDOFF: We are not moving this payout exception review forward right now because the aggregate evidence or guardrail readiness is not strong enough. Keep the creator in manual review and avoid payout, refund, tax, bank, provider, purchase, entitlement, or paid-hosting-live claims.',
    '',
    'This is a manual Creator Payout Exception Review Decision Reply Kit only. Do not resolve payout disputes, process refunds, collect tax details, collect tax forms, collect government IDs, collect bank details, collect payout details, verify identities, create payout accounts, access payout providers, store provider credentials, store tax forms, create contracts, collect signatures, start revenue-share, create payouts, move money, process payments, create purchases, write entitlements, give tax advice, bypass marketplace policy, promise earnings, imply paid creator hosting is live, expose private member logs, scrape/store messages, add tracking pixels, auto-message users, or pressure creators.',
  ].join('\n');
}

export default function CreatorPayoutExceptionDecisionReplyCard({
  approvedCreatorPayoutExceptionReviews = [],
  creatorPayoutExceptionReviewQueue = [],
}) {
  const copy = buildCreatorPayoutExceptionDecisionReplyCopy({
    approvedCount: approvedCreatorPayoutExceptionReviews.length,
    openCount: creatorPayoutExceptionReviewQueue.length,
  });

  return (
    <div style={{
      borderRadius: 12, padding: 12, marginBottom: 10,
      background: 'rgba(167,139,250,0.075)',
      border: '1px solid rgba(167,139,250,0.18)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <p style={{ margin: 0, color: '#A78BFA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>CREATOR PAYOUT EXCEPTION REVIEW DECISION REPLY KIT</p>
          <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>
            Manual admin replies for payout exception review outcomes
          </p>
        </div>
        <span style={{ color: '#A78BFA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
          COPY ONLY
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {[
          ['OPEN', creatorPayoutExceptionReviewQueue.length],
          ['APPROVED', approvedCreatorPayoutExceptionReviews.length],
        ].map(([label, value]) => (
          <div key={label} style={{ borderRadius: 10, padding: 8, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ margin: 0, color: '#A78BFA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
            <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{value}</p>
          </div>
        ))}
      </div>
      <p style={{ margin: '9px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
        Copy approved, waiting, not-ready, and declined replies without disputes, refunds, tax/bank collection, payout provider access, payouts, purchases, entitlements, tax advice, marketplace bypass, tracking, auto-messaging, or pressure.
      </p>
      <button
        onClick={() => navigator.clipboard?.writeText(copy)}
        style={{
          marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
          border: '1px solid rgba(167,139,250,0.24)', background: 'rgba(167,139,250,0.10)',
          color: '#A78BFA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
        }}
      >
        COPY PAYOUT EXCEPTION DECISION REPLIES
      </button>
    </div>
  );
}
