export default function AuthBrandHeader() {
  return (
    <div style={{ textAlign: 'center', marginBottom: 28 }}>
      <div style={{ fontSize: 42, marginBottom: 10, lineHeight: 1 }}>⚡</div>
      <h1 style={{
        margin: '0 0 6px', fontSize: 'clamp(18px, 7vw, 30px)', fontWeight: 900,
        fontFamily: "'Syne', sans-serif", lineHeight: 1.15,
        background: 'linear-gradient(90deg, #FF6B35, #FFD700)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        RISE WITH<br />THE TRIBE
      </h1>
      <p style={{ margin: 0, color: '#555', fontSize: 11, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace' }}>
        BUILD HABITS · TOGETHER
      </p>
    </div>
  );
}
