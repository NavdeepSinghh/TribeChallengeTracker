function buildCreatorPaidHostingLaunchGateDecisionReplyCopy({
  openCount,
  approvedCount,
}) {
  return [
    'Rise With The Tribe Creator Paid Hosting Launch Gate Decision Reply Kit:',
    '',
    `Open launch gate evidence reviews: ${openCount}`,
    `Approved launch gate evidence reviews: ${approvedCount}`,
    '',
    'Manual decision replies:',
    'APPROVED FOR MANUAL PAID-HOSTING READINESS REVIEW: This launch gate evidence is approved as a manual readiness record. Paid hosting still stays off until agreements, identity, moderation, support, payout/tax, marketplace, store-test, purchase, and entitlement QA are approved outside profile UI.',
    '',
    'WAITING ON LAUNCH GATE READINESS: This review needs more first-party evidence before follow-up. Keep creator hosting in review mode while the creator profile, agreement prep, identity, moderation, support, payout/tax, marketplace, store-test evidence, and entitlement QA gaps are resolved.',
    '',
    'NOT READY FOR PAID-HOSTING HANDOFF: This launch gate is not ready for paid-hosting handoff. Keep the creator in free hosted challenge mode and avoid contract, signature, payout, tax, purchase, entitlement, paid-access, marketplace, or revenue-share claims.',
    '',
    'DECLINED FOR PAID-HOSTING HANDOFF: We are not moving this launch gate forward right now because the readiness evidence or guardrail coverage is not strong enough. Keep creator hosting in manual review and do not promote paid creator hosting as live.',
    '',
    'This is a manual Creator Paid Hosting Launch Gate Decision Reply Kit only. Do not approve paid hosting, create contracts, collect signatures, collect payout details, collect tax details, collect government IDs, verify identities, create payout accounts, access payout providers, start revenue-share, create payouts, move money, process payments, create purchases, write entitlements, grant paid access, bypass marketplace policy, submit store review, promise earnings, imply paid creator hosting is live, export private member activity, expose private member logs, scrape/store messages, add tracking pixels, auto-message users, promise outcomes, imply medical results, or pressure creators or members.',
  ].join('\n');
}

export default function CreatorPaidHostingLaunchGateDecisionReplyCard({
  approvedCreatorPaidHostingLaunchGateReviews = [],
  creatorPaidHostingLaunchGateReviewQueue = [],
}) {
  const copy = buildCreatorPaidHostingLaunchGateDecisionReplyCopy({
    approvedCount: approvedCreatorPaidHostingLaunchGateReviews.length,
    openCount: creatorPaidHostingLaunchGateReviewQueue.length,
  });

  return (
    <div style={{
      borderRadius: 12, padding: 12, marginBottom: 10,
      background: 'rgba(244,114,182,0.075)',
      border: '1px solid rgba(244,114,182,0.18)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <p style={{ margin: 0, color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>CREATOR PAID HOSTING LAUNCH GATE DECISION REPLY KIT</p>
          <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>
            Manual admin replies for paid-hosting launch gate outcomes
          </p>
        </div>
        <span style={{ color: '#F472B6', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
          COPY ONLY
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {[
          ['OPEN', creatorPaidHostingLaunchGateReviewQueue.length],
          ['APPROVED', approvedCreatorPaidHostingLaunchGateReviews.length],
        ].map(([label, value]) => (
          <div key={label} style={{ borderRadius: 10, padding: 8, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ margin: 0, color: '#F472B6', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
            <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{value}</p>
          </div>
        ))}
      </div>
      <p style={{ margin: '9px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
        Copy approved, waiting, not-ready, and declined replies without paid-hosting approval, contracts, signatures, payout/tax collection, purchases, entitlements, paid access, store review, tracking, auto-messaging, or pressure.
      </p>
      <button
        onClick={() => navigator.clipboard?.writeText(copy)}
        style={{
          marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
          border: '1px solid rgba(244,114,182,0.24)', background: 'rgba(244,114,182,0.10)',
          color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
        }}
      >
        COPY LAUNCH GATE DECISION REPLIES
      </button>
    </div>
  );
}
