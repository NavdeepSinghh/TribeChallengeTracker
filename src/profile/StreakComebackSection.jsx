import ComebackChallengeInviteCard from './ComebackChallengeInviteCard';
import StreakRecoveryCard from './StreakRecoveryCard';
import StreakRescuePromptCard from './StreakRescuePromptCard';

export default function StreakComebackSection({
  proActive,
  yesterdayRecovered,
  isSavingRecovery,
  onStreakRecovery,
  recoveryMessage,
  currentStreak,
  goalStreak,
  streakRescuePromptCopy,
  comebackChallengeInviteCopy,
  weeklyCampaignPrompt,
  copyText,
}) {
  return (
    <>
      <StreakRecoveryCard
        isSavingRecovery={isSavingRecovery}
        onStreakRecovery={onStreakRecovery}
        proActive={proActive}
        recoveryMessage={recoveryMessage}
        yesterdayRecovered={yesterdayRecovered}
      />
      <StreakRescuePromptCard
        copyText={copyText}
        currentStreak={currentStreak}
        goalStreak={goalStreak}
        streakRescuePromptCopy={streakRescuePromptCopy}
      />
      <ComebackChallengeInviteCard
        comebackChallengeInviteCopy={comebackChallengeInviteCopy}
        copyText={copyText}
        weeklyCampaignPrompt={weeklyCampaignPrompt}
      />
    </>
  );
}
