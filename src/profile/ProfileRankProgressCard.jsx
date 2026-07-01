export default function ProfileRankProgressCard({ badgeXP, onOpenBadges, rank, rankedPct }) {
  return (
    <button
      type="button"
      onClick={onOpenBadges}
      style={{
      width: '100%',
      textAlign: 'left',
      borderRadius: 16, padding: '14px 16px', marginBottom: 20,
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
      cursor: onOpenBadges ? 'pointer' : 'default',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 10, color: '#555', fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace' }}>
          BADGE STATUS
        </span>
        {onOpenBadges && (
          <span style={{ fontSize: 10, color: rank.color, fontWeight: 800, fontFamily: 'monospace' }}>
            VIEW ALL -&gt;
          </span>
        )}
      </div>
      {rank.next ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: '#888', fontFamily: 'monospace' }}>
              -&gt; {rank.next.icon} {rank.next.label}
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
        </>
      ) : (
        <div style={{ padding: '8px 10px', borderRadius: 10, background: `${rank.color}18`, color: rank.color, fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 900 }}>
          {rank.icon} Maximum Badge Status Achieved
        </div>
      )}
    </button>
  );
}
