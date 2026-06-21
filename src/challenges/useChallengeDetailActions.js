import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { isMember, joinChallenge } from '../challengeService';
import { getUserProfile, saveDisplayName } from '../userService';
import { isPlaceholderDisplayName, normalizeDisplayName } from '../displayNameUtils';
import { buildChallengeShareLink, campaignShareText, shareChallengeLaunchCard } from './challengeShare';

export default function useChallengeDetailActions({ challenge, onJoined, pendingReferralUid }) {
  const { user } = useAuth();
  const [joined, setJoined] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [launchCardMessage, setLaunchCardMessage] = useState('');
  const shareLink = buildChallengeShareLink({ inviteCode: challenge.inviteCode, refUid: user.uid });

  useEffect(() => {
    isMember(user.uid, challenge.id).then(setJoined);
  }, [challenge.id, user.uid]);

  const handleJoin = async () => {
    const confirmed = window.confirm(`Join ${challenge.name}? You can leave later from the challenge screen.`);
    if (!confirmed) return;

    setLoading(true);
    try {
      const profile = await getUserProfile(user.uid);
      if (isPlaceholderDisplayName(profile?.displayName || user.displayName)) {
        const enteredName = window.prompt('Enter the display name other members will see on challenge leaderboards:');
        const displayName = normalizeDisplayName(enteredName);
        if (!displayName) return;
        await saveDisplayName(user.uid, { displayName });
      }
      const referralUid = pendingReferralUid || sessionStorage.getItem('pendingReferralUid') || '';
      await joinChallenge(user.uid, challenge.id, referralUid);
      sessionStorage.removeItem('pendingReferralUid');
      setJoined(true);
      onJoined?.();
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchCardShare = async () => {
    const text = campaignShareText(challenge, shareLink);
    setLaunchCardMessage('Preparing launch card...');
    try {
      const outcome = await shareChallengeLaunchCard({ challenge, shareLink, text });
      if (outcome === 'launch-card-shared') {
        setLaunchCardMessage('Launch card shared.');
        return;
      }
      if (outcome === 'invite-shared') {
        setLaunchCardMessage('Invite shared.');
        return;
      }
      setLaunchCardMessage('Campaign copy copied.');
    } catch (error) {
      console.error('[Challenge launch card]', error);
      setLaunchCardMessage('Could not share card. Invite copy copied instead.');
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  return {
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
  };
}
