const PRIVATE_INVITE_STATUSES = [
  ['approved', 'APPROVE'],
  ['waiting', 'WAIT'],
  ['not_ready', 'NOT READY'],
  ['declined', 'DECLINE'],
];

export default function CreatorPrivateInviteLaunchReviewSection({
  creatorPrivateInviteLaunchReviewNotes,
  creatorPrivateInviteLaunchReviewQueue = [],
  handleCreatorPrivateInviteLaunchReview,
  reviewingCreatorPrivateInviteLaunchId,
  setCreatorPrivateInviteLaunchReviewNotes,
}) {
  return (
    <div style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 14 }}>
      <div style={{ color: '#FBBF24', fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}>PRIVATE CREATOR INVITE LAUNCH REVIEW QUEUE</div>
      <p style={{ margin: '8px 0 12px', color: '#aaa', fontSize: 12, lineHeight: 1.45 }}>
        Admin-only queue for creatorPrivateInviteLaunches. Review app-first private challenge invite readiness; do not auto-message, count link opens, track recipients, collect payments, create purchases, write entitlements, or imply paid hosting is live.
      </p>
      {creatorPrivateInviteLaunchReviewQueue.length === 0 ? (
        <p style={{ margin: 0, color: '#777', fontSize: 11, fontWeight: 800 }}>No open private creator invite launches.</p>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {creatorPrivateInviteLaunchReviewQueue.map(launch => (
            <div key={launch.id} style={{ borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{launch.displayName || launch.email || launch.uid}</span>
                <span style={{ color: '#FBBF24', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{launch.privateChallengeCount || 0} PRIVATE</span>
              </div>
              <div style={{ color: '#aaa', fontSize: 11, lineHeight: 1.35, marginTop: 6 }}>
                Invite: {launch.inviteChallengeName || 'No private challenge yet'} · code {launch.inviteReady ? 'ready' : 'missing'}
              </div>
              <div style={{ color: '#777', fontSize: 10, lineHeight: 1.35, marginTop: 4 }}>
                Members: {launch.inviteChallengeMemberCount || 0} · reach: {launch.memberReach || 0} · status: {launch.status || 'open'}
              </div>
              <textarea
                value={creatorPrivateInviteLaunchReviewNotes[launch.id] || ''}
                onChange={event => setCreatorPrivateInviteLaunchReviewNotes(notes => ({ ...notes, [launch.id]: event.target.value }))}
                placeholder="Manual private invite review note: app invite only, no auto-message, no link-open tracking..."
                style={{ width: '100%', minHeight: 54, marginTop: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(0,0,0,0.22)', color: '#fff', padding: 8, fontSize: 11 }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6, marginTop: 8 }}>
                {PRIVATE_INVITE_STATUSES.map(([status, label]) => (
                  <button
                    key={status}
                    onClick={() => handleCreatorPrivateInviteLaunchReview(launch, status)}
                    disabled={reviewingCreatorPrivateInviteLaunchId === launch.id}
                    style={{ border: 0, borderRadius: 8, padding: '8px 6px', background: status === 'approved' ? '#FBBF24' : 'rgba(255,255,255,0.08)', color: status === 'approved' ? '#1f1300' : '#fff', fontSize: 9, fontWeight: 900, cursor: 'pointer' }}
                  >
                    {reviewingCreatorPrivateInviteLaunchId === launch.id ? '...' : label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
