export default function OnboardingCompletionHero({ firstName }) {
  return (
    <>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, margin: '0 0 8px', fontFamily: 'monospace' }}>
        PROFILE COMPLETE
      </p>
      <h2 style={{
        margin: '0 0 8px', fontSize: 28, fontWeight: 900,
        fontFamily: "'Syne', sans-serif", textAlign: 'center', color: '#fff',
      }}>
        You're tribe-ready{firstName ? `, ${firstName}` : ''}!
      </h2>
      <p style={{ color: '#555', fontSize: 13, textAlign: 'center', margin: '0 0 32px' }}>
        Your 30-day challenge is personalised and waiting.
      </p>
    </>
  );
}
