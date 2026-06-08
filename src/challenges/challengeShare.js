export { makeChallengeLaunchCardBlob } from './challengeLaunchCard';
import { makeChallengeLaunchCardBlob } from './challengeLaunchCard';

export const buildChallengeShareLink = ({ inviteCode, origin = window.location.origin, refUid }) =>
  `${origin}?join=${inviteCode}&ref=${refUid}`;

export const campaignShareText = (challenge, shareLink) =>
  `Join my ${challenge.name} challenge on Rise With The Tribe.\n${challenge.campaignCta || 'Tag @risewiththetribe and bring your accountability partner.'}\n${challenge.campaignHashtag ? `${challenge.campaignHashtag} ` : ''}${shareLink}`;

export const launchCardFileName = (challenge) =>
  `${challenge.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-launch-card.png`;

export const shareChallengeLaunchCard = async ({ challenge, shareLink, text = campaignShareText(challenge, shareLink) }) => {
  const blob = await makeChallengeLaunchCardBlob({ challenge, shareLink });
  const file = new File([blob], launchCardFileName(challenge), { type: 'image/png' });
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ title: `${challenge.name} challenge`, text, files: [file] });
    return 'launch-card-shared';
  }
  if (navigator.share) {
    await navigator.share({ title: `${challenge.name} challenge`, text });
    return 'invite-shared';
  }
  await navigator.clipboard.writeText(text);
  return 'campaign-copy-copied';
};
