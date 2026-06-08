import { card } from './challengeTheme';

export default function ChallengeDisclaimerCard({
  challenge,
  disclaimerOpen,
  onToggleDisclaimer,
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <button onClick={onToggleDisclaimer} style={{
        width: '100%', ...card, cursor: 'pointer', border: '1px solid rgba(255,165,0,0.2)',
        background: 'rgba(255,165,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#FFA500', fontFamily: 'monospace' }}>DISCLAIMER & HEALTH NOTICE</span>
        </div>
        <span style={{ color: '#555', fontSize: 16, transform: disclaimerOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▾</span>
      </button>
      {disclaimerOpen && (
        <div style={{ ...card, marginTop: 4, border: '1px solid rgba(255,165,0,0.15)', background: 'rgba(255,165,0,0.04)', borderRadius: '0 0 14px 14px' }}>
          <p style={{ margin: 0, fontSize: 12, color: '#888', lineHeight: 1.7, fontFamily: 'monospace' }}>
            {challenge.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
}
