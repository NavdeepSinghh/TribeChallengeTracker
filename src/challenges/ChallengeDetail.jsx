import { card } from './challengeTheme';
import ChallengeDetailHero from './ChallengeDetailHero';
import ChallengeDetailPromoCards from './ChallengeDetailPromoCards';
import ChallengeDetailSharePanel from './ChallengeDetailSharePanel';
import ChallengeDetailTasks from './ChallengeDetailTasks';
import useChallengeDetailActions from './useChallengeDetailActions';

export default function ChallengeDetail({ challenge, onBack, onJoined, pendingReferralUid = '' }) {
  const {
    copied,
    disclaimerOpen,
    handleCopy,
    handleJoin,
    handleLaunchCardShare,
    joined,
    launchCardMessage,
    loading,
    setDisclaimerOpen,
    shareLink,
  } = useChallengeDetailActions({ challenge, onJoined, pendingReferralUid });

  return (
    <div style={{ paddingBottom: 40 }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 13, fontFamily: 'monospace', fontWeight: 700, padding: '0 0 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
        ← BACK
      </button>

      <ChallengeDetailHero challenge={challenge} />
      <ChallengeDetailTasks challenge={challenge} />
      <ChallengeDetailPromoCards challenge={challenge} />
      <ChallengeDetailSharePanel
        challenge={challenge}
        copied={copied}
        disclaimerOpen={disclaimerOpen}
        launchCardMessage={launchCardMessage}
        onCopy={handleCopy}
        onLaunchCardShare={handleLaunchCardShare}
        onToggleDisclaimer={() => setDisclaimerOpen(o => !o)}
        shareLink={shareLink}
      />

      {joined === null ? null : joined ? (
        <div style={{ ...card, textAlign: 'center', border: '1px solid rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.06)' }}>
          <span style={{ fontSize: 22 }}>✅</span>
          <p style={{ margin: '8px 0 0', fontSize: 14, fontWeight: 700, color: '#34D399' }}>You're in this challenge!</p>
        </div>
      ) : (
        <button onClick={handleJoin} disabled={loading} style={{
          width: '100%', padding: '16px', borderRadius: 14, border: 'none',
          background: `linear-gradient(135deg, ${challenge.color}, ${challenge.color}aa)`,
          color: '#000', fontSize: 15, fontWeight: 800, cursor: 'pointer',
          fontFamily: "'Syne', sans-serif", letterSpacing: 0.5,
          boxShadow: `0 4px 20px ${challenge.color}55`, opacity: loading ? 0.7 : 1,
        }}>
          {loading ? '…' : `${challenge.emoji} Join Challenge`}
        </button>
      )}
    </div>
  );
}
