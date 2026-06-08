import { GOLD, card } from './challengeTheme';

export default function ChallengeCard({ challenge, isOwner, onClick, alreadyJoined }) {
  const daysLeft = Math.max(0, Math.ceil(
    (new Date(challenge.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  ));
  return (
    <button onClick={onClick} style={{
      ...card, width: '100%', textAlign: 'left', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10,
      border: `1px solid ${challenge.color}33`,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14, flexShrink: 0,
        background: `${challenge.color}22`,
        border: `1.5px solid ${challenge.color}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
      }}>
        {challenge.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {challenge.name}
          </span>
          {isOwner && (
            <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: GOLD, background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 6, padding: '2px 6px', flexShrink: 0 }}>
              ADMIN
            </span>
          )}
          {alreadyJoined && !isOwner && (
            <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: '#34D399', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 6, padding: '2px 6px', flexShrink: 0 }}>
              ✓ JOINED
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <span style={{ fontSize: 11, color: '#555', fontFamily: 'monospace' }}>
            {challenge.duration} days · {challenge.memberCount} member{challenge.memberCount !== 1 ? 's' : ''}
          </span>
          <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: challenge.isPublic ? '#34D399' : '#888', background: challenge.isPublic ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${challenge.isPublic ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 5, padding: '1px 5px' }}>
            {challenge.isPublic ? '🌐 PUBLIC' : '🔒 PRIVATE'}
          </span>
          {challenge.campaignLabel && (
            <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: challenge.color, background: `${challenge.color}12`, border: `1px solid ${challenge.color}33`, borderRadius: 5, padding: '1px 5px' }}>
              📣 {challenge.campaignLabel.toUpperCase()}
            </span>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: challenge.color }}>{daysLeft}</div>
        <div style={{ fontSize: 9, color: '#555', fontFamily: 'monospace', fontWeight: 700 }}>DAYS LEFT</div>
      </div>
    </button>
  );
}
