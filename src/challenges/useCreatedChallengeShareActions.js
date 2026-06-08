import { useState } from 'react';
import { campaignShareText, shareChallengeLaunchCard } from './challengeShare';

export default function useCreatedChallengeShareActions({
  created,
  shareLink,
}) {
  const [copied, setCopied] = useState(false);
  const createdCampaignShareText = created ? campaignShareText(created, shareLink) : '';

  const flashCopied = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink).catch(() => {});
    flashCopied();
  };

  const handleCreatedLaunchCardShare = async () => {
    if (!created) return;
    const text = campaignShareText(created, shareLink);
    try {
      const outcome = await shareChallengeLaunchCard({ challenge: created, shareLink, text });
      if (outcome === 'campaign-copy-copied') flashCopied();
    } catch (error) {
      console.error('[Challenge launch card]', error);
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  return {
    copied,
    createdCampaignShareText,
    handleCopy,
    handleCreatedLaunchCardShare,
  };
}
