export default function ChallengeDetailHero({ challenge }) {
  return (
    <div style={{
      borderRadius: 22, padding: '28px 24px', marginBottom: 20,
      background: `linear-gradient(135deg, ${challenge.color}22, ${challenge.color}08)`,
      border: `1px solid ${challenge.color}44`,
    }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>{challenge.emoji}</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: challenge.color, background: `${challenge.color}18`, border: `1px solid ${challenge.color}44`, borderRadius: 6, padding: '3px 8px' }}>
          {challenge.difficulty.toUpperCase()}
        </span>
        <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: '#888', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '3px 8px' }}>
          {challenge.duration} DAYS
        </span>
        <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: '#888', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '3px 8px' }}>
          👥 {challenge.memberCount} MEMBER{challenge.memberCount !== 1 ? 'S' : ''}
        </span>
      </div>
      <h2 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>
        {challenge.name}
      </h2>
      <p style={{ margin: 0, fontSize: 13, color: '#888' }}>{challenge.tagline}</p>
      <p style={{ margin: '10px 0 0', fontSize: 11, color: '#555', fontFamily: 'monospace' }}>
        {challenge.startDate} → {challenge.endDate}
      </p>
    </div>
  );
}
