const SNAPSHOT_STATUSES = [
  ['published', 'PUBLISH'],
  ['waiting', 'WAIT'],
  ['not_ready', 'NOT READY'],
  ['declined', 'DECLINE'],
];

export default function CreatorLeaderboardSnapshotReviewSection({
  creatorLeaderboardSnapshotReviewNotes,
  creatorLeaderboardSnapshotReviewQueue = [],
  handleCreatorLeaderboardSnapshotReview,
  reviewingCreatorLeaderboardSnapshotId,
  setCreatorLeaderboardSnapshotReviewNotes,
}) {
  return (
    <div style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 14 }}>
      <div style={{ color: '#34D399', fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}>CREATOR LEADERBOARD SNAPSHOT REVIEW QUEUE</div>
      <p style={{ margin: '8px 0 12px', color: '#aaa', fontSize: 12, lineHeight: 1.45 }}>
        Admin-only queue for aggregate creatorLeaderboardSnapshots. Publish only first-party aggregate hosted-challenge movement; do not expose member identities, per-user logs, contracts, payouts, purchases, entitlements, revenue-share, tracking, or paid-hosting claims.
      </p>
      {creatorLeaderboardSnapshotReviewQueue.length === 0 ? (
        <p style={{ margin: 0, color: '#777', fontSize: 11, fontWeight: 800 }}>No open creator leaderboard snapshots.</p>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {creatorLeaderboardSnapshotReviewQueue.map(snapshot => (
            <div key={snapshot.id} style={{ borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{snapshot.displayName || snapshot.email || snapshot.uid}</span>
                <span style={{ color: '#34D399', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{snapshot.hostedChallengeCount || 0} HOSTED</span>
              </div>
              <div style={{ color: '#aaa', fontSize: 11, lineHeight: 1.35, marginTop: 6 }}>
                Top: {snapshot.topChallengeName || 'No hosted challenge yet'} · {snapshot.topChallengeMemberCount || 0} members · {snapshot.topChallengeAggregatePoints || 0} pts
              </div>
              <div style={{ color: '#777', fontSize: 10, lineHeight: 1.35, marginTop: 4 }}>
                Reach: {snapshot.memberReach || 0} · aggregate points: {snapshot.aggregatePoints || 0} · status: {snapshot.status || 'open'}
              </div>
              <textarea
                value={creatorLeaderboardSnapshotReviewNotes[snapshot.id] || ''}
                onChange={event => setCreatorLeaderboardSnapshotReviewNotes(notes => ({ ...notes, [snapshot.id]: event.target.value }))}
                placeholder="Manual snapshot review note: aggregate-only, support-safe ranking, no member identities or paid-hosting claims..."
                style={{ width: '100%', minHeight: 54, marginTop: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(0,0,0,0.22)', color: '#fff', padding: 8, fontSize: 11 }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6, marginTop: 8 }}>
                {SNAPSHOT_STATUSES.map(([status, label]) => (
                  <button
                    key={status}
                    onClick={() => handleCreatorLeaderboardSnapshotReview(snapshot, status)}
                    disabled={reviewingCreatorLeaderboardSnapshotId === snapshot.id}
                    style={{ border: 0, borderRadius: 8, padding: '8px 6px', background: status === 'published' ? '#34D399' : 'rgba(255,255,255,0.08)', color: status === 'published' ? '#04130d' : '#fff', fontSize: 9, fontWeight: 900, cursor: 'pointer' }}
                  >
                    {reviewingCreatorLeaderboardSnapshotId === snapshot.id ? '...' : label}
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
