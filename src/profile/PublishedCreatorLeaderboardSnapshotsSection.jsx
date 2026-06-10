export default function PublishedCreatorLeaderboardSnapshotsSection({
  publishedCreatorLeaderboardSnapshots = [],
}) {
  return (
    <div style={{ padding: 16, borderRadius: 12, background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.16)', marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ color: '#34D399', fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}>PUBLISHED CREATOR LEADERBOARD SNAPSHOTS</div>
        <span style={{ color: '#34D399', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{publishedCreatorLeaderboardSnapshots.length} LIVE</span>
      </div>
      <p style={{ margin: '8px 0 12px', color: '#aaa', fontSize: 12, lineHeight: 1.45 }}>
        Public aggregate creator leaderboard records approved from creatorLeaderboardSnapshots. These stay identity-safe and do not expose member logs, payouts, purchases, entitlements, revenue-share, tracking, or paid-hosting claims.
      </p>
      {publishedCreatorLeaderboardSnapshots.length === 0 ? (
        <p style={{ margin: 0, color: '#777', fontSize: 11, fontWeight: 800 }}>No published creator leaderboard snapshots yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          {publishedCreatorLeaderboardSnapshots.slice(0, 5).map(snapshot => (
            <div key={snapshot.id} style={{ borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{snapshot.displayName || snapshot.creatorSpecialty || snapshot.uid}</div>
              <div style={{ color: '#aaa', fontSize: 11, lineHeight: 1.35, marginTop: 4 }}>
                {snapshot.topChallengeName || 'Hosted challenge'} · {snapshot.topChallengeMemberCount || 0} members · {snapshot.topChallengeAggregatePoints || 0} pts
              </div>
              <div style={{ color: '#777', fontSize: 10, lineHeight: 1.35, marginTop: 4 }}>
                Reach: {snapshot.memberReach || 0} · aggregate points: {snapshot.aggregatePoints || 0}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
