import OnboardingBackButton from './OnboardingBackButton';

const ACCENT = '#FF6B35';
const GOLD = '#FFD700';

export default function OnboardingProgress({ canGoBack = false, onBack, questions, step }) {
  return (
    <div style={{ padding: '54px 24px 0' }}>
      {canGoBack && (
        <div style={{ display: 'flex', marginBottom: 18 }}>
          <OnboardingBackButton onBack={onBack} />
        </div>
      )}
      <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 999,
            background: i <= step
              ? `linear-gradient(90deg, ${ACCENT}, ${GOLD})`
              : '#ece9e3',
            transition: 'background .4s',
          }} />
        ))}
      </div>
      <p style={{ color: '#706d66', fontSize: 11, fontWeight: 800, letterSpacing: 1, margin: 0 }}>
        {step + 1} / {questions.length}
      </p>
    </div>
  );
}
