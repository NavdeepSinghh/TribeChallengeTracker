export default function ProfileRankProgressCard({ badgeXP, rank, rankedPct }) {
  if (!rank.next) return null;

  return (
    <div style={{
      borderRadius: 16, padding: '14px 16px', marginBottom: 20,
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: '#888', fontFamily: 'monospace' }}>
          -> {rank.next.icon} {rank.next.label}
        </span>
        <span style={{ fontSize: 11, color: rank.color, fontFamily: 'monospace', fontWeight: 700 }}>
          {badgeXP} / {rank.next.min} XP
        </span>
      </div>
      <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 5 }}>
        <div style={{
          height: '100%', borderRadius: 5,
          background: `linear-gradient(90deg, ${rank.color}, ${rank.next.color})`,
          width: `${rankedPct}%`, transition: 'width .8s ease',
        }} />
      </div>
    </div>
  );
}
