const ACCENT = '#FF6B35';
const GOLD = '#FFD700';

export default function OnboardingContinueButton({ hasAnswer, onContinue }) {
  return (
    <button
      onClick={onContinue}
      disabled={!hasAnswer}
      style={{
        width: '100%', padding: '15px', borderRadius: 14, border: 'none',
        background: hasAnswer
          ? `linear-gradient(135deg, ${ACCENT}, ${GOLD})`
          : 'rgba(255,255,255,0.06)',
        color: hasAnswer ? '#000' : '#444',
        fontSize: 15, fontWeight: 800,
        cursor: hasAnswer ? 'pointer' : 'default',
        fontFamily: "'Syne', sans-serif", letterSpacing: 0.5,
        marginTop: 22,
        boxShadow: hasAnswer ? `0 4px 20px rgba(255,107,53,0.35)` : 'none',
        transition: 'all .3s ease',
      }}
    >
      Continue →
    </button>
  );
}
