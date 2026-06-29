const ACCENT = '#FF6B35';

export default function OnboardingContinueButton({ hasAnswer, onContinue }) {
  return (
    <button
      onClick={onContinue}
      disabled={!hasAnswer}
      style={{
        width: '100%',
        padding: '18px',
        borderRadius: 999,
        border: 'none',
        background: hasAnswer ? ACCENT : '#ffbe9f',
        color: '#fff',
        fontSize: 18,
        fontWeight: 900,
        cursor: hasAnswer ? 'pointer' : 'default',
        fontFamily: "'Space Grotesk', sans-serif",
        letterSpacing: 0,
        boxShadow: hasAnswer ? `0 12px 30px rgba(255,107,53,0.26)` : 'none',
        transition: 'all .3s ease',
      }}
    >
      Continue
    </button>
  );
}
