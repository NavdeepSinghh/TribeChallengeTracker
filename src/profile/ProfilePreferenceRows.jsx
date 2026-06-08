export default function ProfilePreferenceRows({ prefRows }) {
  if (prefRows.length === 0) return null;

  return (
    <>
      <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>PREFERENCES</p>
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16, padding: '0 16px 4px', marginBottom: 24,
      }}>
        {prefRows.map((row, i) => (
          <div key={row.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 0',
            borderBottom: i < prefRows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}>
            <span style={{ fontSize: 9, color: '#444', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>{row.label}</span>
            <span style={{ fontSize: 12, color: '#ccc', fontWeight: 700 }}>{row.value}</span>
          </div>
        ))}
      </div>
    </>
  );
}
