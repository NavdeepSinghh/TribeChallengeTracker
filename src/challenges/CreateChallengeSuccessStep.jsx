import { ACCENT, GOLD } from './challengeTheme';
import CreateChallengeCampaignCopyCard from './CreateChallengeCampaignCopyCard';
import CreateChallengeInviteLinkCard from './CreateChallengeInviteLinkCard';
import CreateChallengeShareActions from './CreateChallengeShareActions';

export default function CreateChallengeSuccessStep({
  copied,
  created,
  createdCampaignShareText,
  onBack,
  onCopy,
  onLaunchCardShare,
  shareLink,
}) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
      <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 8px' }}>CHALLENGE CREATED</p>
      <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>
        {created.name} is live!
      </h2>
      <p style={{ color: '#555', fontSize: 13, margin: '0 0 32px' }}>
        Share the link below to invite your tribe
      </p>

      <CreateChallengeInviteLinkCard copied={copied} onCopy={onCopy} shareLink={shareLink} />
      <CreateChallengeCampaignCopyCard
        created={created}
        createdCampaignShareText={createdCampaignShareText}
      />
      <CreateChallengeShareActions
        created={created}
        createdCampaignShareText={createdCampaignShareText}
        onLaunchCardShare={onLaunchCardShare}
        shareLink={shareLink}
      />

      <button onClick={onBack} style={{
        marginTop: 20, width: '100%', padding: '14px', borderRadius: 14, border: 'none',
        background: `linear-gradient(135deg, ${ACCENT}, ${GOLD})`,
        color: '#000', fontSize: 14, fontWeight: 800, cursor: 'pointer',
        fontFamily: "'Syne', sans-serif",
      }}>
        View My Challenges
      </button>
    </div>
  );
}
