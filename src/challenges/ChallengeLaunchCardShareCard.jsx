import { GOLD, card } from './challengeTheme';

export default function ChallengeLaunchCardShareCard({
  challenge,
  launchCardMessage,
  onLaunchCardShare,
}) {
  return (
    <div style={{ ...card, marginBottom: 16, border: `1px solid ${challenge.color}33` }}>
      <p style={{ margin: '0 0 6px', fontSize: 10, color: challenge.color, fontFamily: 'monospace', fontWeight: 800, letterSpacing: 1 }}>
        LAUNCH CARD
      </p>
      <p style={{ margin: '0 0 12px', fontSize: 12, color: '#888', lineHeight: 1.45 }}>
        Share a story-ready challenge card with the invite code, campaign CTA, and referral link.
      </p>
      <button onClick={onLaunchCardShare} style={{
        width: '100%', border: 'none', borderRadius: 12,
        background: `linear-gradient(135deg, ${challenge.color}, ${GOLD})`,
        color: '#111', padding: '12px', fontSize: 12, fontWeight: 900,
        cursor: 'pointer', fontFamily: "'Syne', sans-serif",
      }}>
        Share Launch Card
      </button>
      {launchCardMessage && (
        <p style={{ margin: '8px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
          {launchCardMessage}
        </p>
      )}
    </div>
  );
}
