export default function AuthBrandHeader() {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <div style={{
          width: 46,
          height: 46,
          borderRadius: 16,
          display: 'grid',
          placeItems: 'center',
          background: 'linear-gradient(135deg, rgba(255,107,53,0.24), rgba(255,215,0,0.16))',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: 24,
          lineHeight: 1,
        }}>
          ⚡
        </div>
        <div>
          <p style={{ margin: '0 0 4px', color: '#888', fontSize: 11, fontWeight: 800, letterSpacing: 2, fontFamily: 'monospace' }}>
            TRIBELOG
          </p>
          <p style={{ margin: 0, color: '#555', fontSize: 12, fontWeight: 700 }}>
            Accountability that starts with one log.
          </p>
        </div>
      </div>
      <h1 style={{
        margin: '0 0 12px',
        fontSize: 'clamp(34px, 8vw, 64px)',
        fontWeight: 900,
        fontFamily: "'Syne', sans-serif",
        lineHeight: 0.98,
        color: '#fff',
      }}>
        Rise with<br />the tribe.
      </h1>
      <p style={{ margin: 0, color: '#b8b8b8', fontSize: 16, lineHeight: 1.55, maxWidth: 520 }}>
        Join challenges, log workouts, protect your streak, and see the people building consistency with you.
      </p>
    </div>
  );
}
