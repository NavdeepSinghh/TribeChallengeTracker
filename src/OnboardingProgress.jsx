const ACCENT = '#FF6B35';
const GOLD = '#FFD700';

export default function OnboardingProgress({ questions, step }) {
  return (
    <div style={{ padding: '56px 24px 0' }}>
      <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 3,
            background: i <= step
              ? `linear-gradient(90deg, ${ACCENT}, ${GOLD})`
              : 'rgba(255,255,255,0.07)',
            transition: 'background .4s',
          }} />
        ))}
      </div>
      <p style={{ color: '#444', fontSize: 10, fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1, margin: 0 }}>
        {step + 1} / {questions.length}
      </p>
    </div>
  );
}
