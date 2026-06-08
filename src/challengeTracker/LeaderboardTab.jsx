import { useEffect, useState } from 'react';
import { getChallengeLeaderboard } from '../trackingService';
import MemberAvatar from './MemberAvatar';
import { GOLD } from './challengeTrackerTheme';

export default function LeaderboardTab({ challenge, currentUid }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChallengeLeaderboard(challenge.id).then(m => { setMembers(m); setLoading(false); });
  }, [challenge.id]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#555' }}>Loading…</div>;

  return (
    <div style={{ padding: '20px 20px 100px' }}>
      <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 1, fontFamily: 'monospace', margin: '0 0 16px' }}>
        {challenge.name.toUpperCase()} · {members.length} MEMBERS
      </p>

      {members.map((m, i) => {
        const isMe = m.uid === currentUid;
        const rank = i + 1;
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
        return (
          <div key={m.uid} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 16px', borderRadius: 16, marginBottom: 8,
            background: isMe
              ? 'linear-gradient(135deg, rgba(255,107,53,0.12), rgba(255,215,0,0.06))'
              : 'rgba(255,255,255,0.03)',
            border: `1.5px solid ${isMe ? 'rgba(255,107,53,0.35)' : 'rgba(255,255,255,0.06)'}`,
          }}>
            <div style={{ fontSize: 20, width: 30, textAlign: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
              {medal}
            </div>
            <MemberAvatar member={m} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: isMe ? GOLD : '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {isMe ? 'You' : (m.displayName || 'Member')}
                </span>
                {(m.currentStreak || 0) >= 3 && (
                  <span style={{ fontSize: 11 }} title={`${m.currentStreak} day streak`}>🔥</span>
                )}
              </div>
              <div style={{ fontSize: 10, color: '#555', fontFamily: 'monospace' }}>
                {m.daysCompleted || 0} days · {m.currentStreak || 0} streak
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: rank === 1 ? GOLD : '#fff' }}>
                {m.totalPoints || 0}
              </div>
              <div style={{ fontSize: 9, color: '#555', fontFamily: 'monospace', fontWeight: 700 }}>PTS</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
