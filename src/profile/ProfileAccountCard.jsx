export default function ProfileAccountCard({ user, onSignOut, theme }) {
  const palette = theme || {
    cardBg: 'rgba(255,255,255,0.03)',
    cardBorder: 'rgba(255,255,255,0.06)',
    divider: 'rgba(255,255,255,0.05)',
    muted: '#555',
    mutedStrong: '#888',
    textSoft: '#aaa',
  };
  const rows = [
    { label: 'EMAIL', value: user.email || '-' },
    { label: 'USER ID', value: (user.uid?.slice(0, 12) || '') + '...' },
  ];

  return (
    <>
      <p style={{ color: palette.mutedStrong, fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>ACCOUNT</p>
      <div style={{
        background: palette.cardBg, border: `1px solid ${palette.cardBorder}`,
        borderRadius: 16, padding: '0 16px 4px',
      }}>
        {rows.map((row, i) => (
          <div key={row.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 0',
            borderBottom: i === 0 ? `1px solid ${palette.divider}` : 'none',
          }}>
            <span style={{ fontSize: 9, color: palette.mutedStrong, fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>{row.label}</span>
            <span style={{ fontSize: 11, color: palette.textSoft, fontFamily: 'monospace' }}>{row.value}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onSignOut}
        style={{
          width: '100%', marginTop: 24, padding: '14px', borderRadius: 14,
          border: `1px solid ${palette.cardBorder}`,
          background: palette.cardBg, color: palette.mutedStrong,
          fontSize: 14, fontWeight: 700, cursor: 'pointer',
          fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 0.5,
          transition: 'all .2s',
        }}
      >
        Sign Out
      </button>
    </>
  );
}
