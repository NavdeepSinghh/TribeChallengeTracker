export default function ChallengePointsList({ challengePoints, totalChallengePoints }) {
  return (
    <>
      {challengePoints
        .slice()
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .map((c, i, arr) => (
          <div key={c.challengeId} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 0',
            borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}>
            <div style={{
              width: 46, height: 46, borderRadius: 14, flexShrink: 0,
              background: `${c.color}22`, border: `1.5px solid ${c.color}55`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, boxShadow: `0 0 10px ${c.color}22`,
            }}>
              {c.emoji}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.name}
              </div>
              <div style={{ fontSize: 10, color: '#555', fontFamily: 'monospace', marginTop: 3 }}>
                {c.daysCompleted} day{c.daysCompleted !== 1 ? 's' : ''} logged
                {c.currentStreak > 0 ? ` - ${c.currentStreak} streak` : ''}
              </div>
            </div>

            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: c.color }}>
                {c.totalPoints}
              </div>
              <div style={{ fontSize: 9, color: '#555', fontFamily: 'monospace', fontWeight: 700 }}>PTS</div>
            </div>
          </div>
        ))}

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 16, padding: '12px 16px', borderRadius: 14,
        background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)',
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#888', fontFamily: 'monospace', letterSpacing: 0.5 }}>
          TOTAL ACROSS ALL CHALLENGES
        </span>
        <span style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#34D399' }}>
          {totalChallengePoints}
        </span>
      </div>
    </>
  );
}
