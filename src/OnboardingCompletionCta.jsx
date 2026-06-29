const ACCENT = '#FF6B35';

export default function OnboardingCompletionCta({ answers, onComplete }) {
  return (
    <button onClick={() => onComplete(answers)} style={{
      width: '100%',
      padding: '18px',
      borderRadius: 999,
      border: 'none',
      background: ACCENT,
      color: '#fff',
      fontSize: 18,
      fontWeight: 900,
      cursor: 'pointer',
      fontFamily: "'Space Grotesk', sans-serif",
      letterSpacing: 0,
      boxShadow: '0 12px 30px rgba(255,107,53,0.28)',
    }}>
      Start logging
    </button>
  );
}
