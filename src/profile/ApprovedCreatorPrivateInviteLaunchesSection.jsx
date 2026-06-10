export default function ApprovedCreatorPrivateInviteLaunchesSection({
  approvedCreatorPrivateInviteLaunches = [],
}) {
  return (
    <div style={{ padding: 16, borderRadius: 12, background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.16)', marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ color: '#FBBF24', fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}>APPROVED PRIVATE CREATOR INVITE LAUNCHES</div>
        <span style={{ color: '#FBBF24', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{approvedCreatorPrivateInviteLaunches.length} APPROVED</span>
      </div>
      <p style={{ margin: '8px 0 12px', color: '#aaa', fontSize: 12, lineHeight: 1.45 }}>
        Review-only private invite launches. Approval keeps invite sharing manual and app-first without auto-messaging, link-open tracking, payments, purchases, entitlements, revenue-share, or paid-hosting claims.
      </p>
      {approvedCreatorPrivateInviteLaunches.length === 0 ? (
        <p style={{ margin: 0, color: '#777', fontSize: 11, fontWeight: 800 }}>No approved private invite launches yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          {approvedCreatorPrivateInviteLaunches.slice(0, 5).map(launch => (
            <div key={launch.id} style={{ borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{launch.displayName || launch.creatorSpecialty || launch.uid}</div>
              <div style={{ color: '#aaa', fontSize: 11, lineHeight: 1.35, marginTop: 4 }}>
                {launch.inviteChallengeName || 'Private challenge'} · {launch.inviteChallengeMemberCount || 0} members · invite {launch.inviteReady ? 'ready' : 'missing'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
