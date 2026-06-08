const ACCENT = '#FF6B35';
const GOLD = '#FFD700';

export default function OnboardingCompletionCta({ answers, onComplete }) {
  return (
    <button onClick={() => onComplete(answers)} style={{
      width: '100%', padding: '16px', borderRadius: 14, border: 'none',
      background: `linear-gradient(135deg, ${ACCENT} 0%, ${GOLD} 100%)`,
      color: '#000', fontSize: 16, fontWeight: 800, cursor: 'pointer',
      fontFamily: "'Syne', sans-serif", letterSpacing: 0.5,
      boxShadow: '0 4px 30px rgba(255,107,53,0.4)',
    }}>
      Enter the Tribe 🏃
    </button>
  );
}
