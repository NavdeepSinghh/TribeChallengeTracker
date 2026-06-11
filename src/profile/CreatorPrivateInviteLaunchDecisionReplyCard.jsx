function buildCreatorPrivateInviteLaunchDecisionReplyCopy({
  openCount,
  approvedCount,
}) {
  return [
    'Rise With The Tribe Private Creator Invite Launch Decision Reply Kit:',
    '',
    `Open private invite launches: ${openCount}`,
    `Approved private invite launches: ${approvedCount}`,
    '',
    'Manual decision replies:',
    'APPROVED FOR MANUAL PRIVATE INVITE READINESS: This private creator invite launch is approved for manual app-first follow-up. Keep invite sharing human-reviewed and route members into the private challenge flow without auto-messaging, link-open tracking, payment, purchase, entitlement, revenue-share, or paid-hosting-live claims.',
    '',
    'WAITING ON PRIVATE INVITE READINESS: This private invite launch needs more first-party readiness evidence before follow-up. Confirm the private challenge, invite code, creator context, member safety, support routing, and app-first copy before any manual invite is used.',
    '',
    'NOT READY FOR PRIVATE INVITE HANDOFF: This launch is not ready for invite handoff. Keep the creator in review mode until the challenge, invite path, support boundaries, consent language, privacy guardrails, and no-pressure copy are stronger.',
    '',
    'DECLINED FOR PRIVATE INVITE HANDOFF: We are not moving this private invite launch forward right now because readiness, safety, privacy, or support evidence is not strong enough. Keep the creator in free hosted challenge mode and avoid paid-hosting, revenue-share, entitlement, purchase, or pressure claims.',
    '',
    'This is a manual Private Creator Invite Launch Decision Reply Kit only. Do not auto-message users, scrape/store DMs, store inbound replies, count link opens, track recipients, export private member activity, create contracts, collect payments, create purchases, write entitlements, grant paid access, start revenue-share, create payouts, promise earnings, imply paid creator hosting is live, add tracking pixels, promise outcomes, imply medical results, or pressure creators or invitees.',
  ].join('\n');
}

export default function CreatorPrivateInviteLaunchDecisionReplyCard({
  approvedCreatorPrivateInviteLaunches = [],
  creatorPrivateInviteLaunchReviewQueue = [],
}) {
  const copy = buildCreatorPrivateInviteLaunchDecisionReplyCopy({
    approvedCount: approvedCreatorPrivateInviteLaunches.length,
    openCount: creatorPrivateInviteLaunchReviewQueue.length,
  });

  return (
    <div style={{
      borderRadius: 12, padding: 12, marginBottom: 10,
      background: 'rgba(251,191,36,0.075)',
      border: '1px solid rgba(251,191,36,0.18)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <p style={{ margin: 0, color: '#FBBF24', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PRIVATE CREATOR INVITE LAUNCH DECISION REPLY KIT</p>
          <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>
            Manual admin replies for private invite launch outcomes
          </p>
        </div>
        <span style={{ color: '#FBBF24', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
          COPY ONLY
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {[
          ['OPEN', creatorPrivateInviteLaunchReviewQueue.length],
          ['APPROVED', approvedCreatorPrivateInviteLaunches.length],
        ].map(([label, value]) => (
          <div key={label} style={{ borderRadius: 10, padding: 8, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ margin: 0, color: '#FBBF24', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
            <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{value}</p>
          </div>
        ))}
      </div>
      <p style={{ margin: '9px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
        Copy approved, waiting, not-ready, and declined replies without auto-messaging, link tracking, recipient tracking, payments, purchases, entitlements, paid access, revenue-share, or pressure.
      </p>
      <button
        onClick={() => navigator.clipboard?.writeText(copy)}
        style={{
          marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
          border: '1px solid rgba(251,191,36,0.24)', background: 'rgba(251,191,36,0.10)',
          color: '#FBBF24', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
        }}
      >
        COPY PRIVATE INVITE DECISION REPLIES
      </button>
    </div>
  );
}
