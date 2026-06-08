import ChallengeDisclaimerCard from './ChallengeDisclaimerCard';
import ChallengeInviteLinkCard from './ChallengeInviteLinkCard';
import ChallengeLaunchCardShareCard from './ChallengeLaunchCardShareCard';

export default function ChallengeDetailSharePanel({
  challenge,
  copied,
  disclaimerOpen,
  launchCardMessage,
  onCopy,
  onLaunchCardShare,
  onToggleDisclaimer,
  shareLink,
}) {
  return (
    <>
      <ChallengeLaunchCardShareCard
        challenge={challenge}
        launchCardMessage={launchCardMessage}
        onLaunchCardShare={onLaunchCardShare}
      />
      <ChallengeDisclaimerCard
        challenge={challenge}
        disclaimerOpen={disclaimerOpen}
        onToggleDisclaimer={onToggleDisclaimer}
      />
      <ChallengeInviteLinkCard
        copied={copied}
        onCopy={onCopy}
        shareLink={shareLink}
      />
    </>
  );
}
