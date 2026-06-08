import { ACCENT, GOLD } from './challengeTheme';

export default function ChallengesListHeader({ setView }) {
  return (
    <>
      <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, margin: '0 0 6px', fontFamily: 'monospace' }}>YOUR TRIBE</p>
      <h2 style={{ margin: '0 0 24px', fontSize: 26, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>
        Challenges 🎯
      </h2>

      <button onClick={() => setView('create')} style={{
        width: '100%', padding: '16px', borderRadius: 18, border: 'none',
        background: `linear-gradient(135deg, ${ACCENT} 0%, ${GOLD} 100%)`,
        color: '#000', fontSize: 15, fontWeight: 800, cursor: 'pointer',
        fontFamily: "'Syne', sans-serif", letterSpacing: 0.5,
        boxShadow: `0 4px 24px rgba(255,107,53,0.35)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        marginBottom: 24,
      }}>
        <span style={{ fontSize: 20 }}>＋</span> Start a Challenge
      </button>
    </>
  );
}
