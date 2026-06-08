export default function ProfileStatsGrid({ statsGrid }) {
  return (
    <>
      <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>STATS</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        {statsGrid.map(s => (
          <div key={s.label} onClick={s.onClick} style={{
            background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '14px 16px',
            border: `1px solid ${s.onClick ? s.color + '44' : 'rgba(255,255,255,0.06)'}`,
            cursor: s.onClick ? 'pointer' : 'default',
            position: 'relative', transition: 'border-color .2s',
          }}>
            {s.onClick && (
              <span style={{ position: 'absolute', top: 10, right: 12, fontSize: 11, color: s.color, opacity: 0.7, fontFamily: 'monospace' }}>-></span>
            )}
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: s.color }}>
              {s.value ?? 0}
            </div>
            <div style={{ fontSize: 9, color: '#555', fontWeight: 700, letterSpacing: 1, fontFamily: 'monospace', marginTop: 2 }}>
              {s.label}
            </div>
            {s.onClick && (
              <div style={{ fontSize: 8, color: s.color, fontFamily: 'monospace', marginTop: 4, opacity: 0.6 }}>
                TAP FOR BREAKDOWN
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
