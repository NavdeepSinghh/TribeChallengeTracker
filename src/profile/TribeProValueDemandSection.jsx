import ProTrialInterestSection from './ProTrialInterestSection';
import ProValueSnapshotCard from './ProValueSnapshotCard';
import TribeProHeaderCard from './TribeProHeaderCard';

export default function TribeProValueDemandSection({
  communityHighlightRoundupItems,
  copyText,
  isAdmin,
  isSavingProTrialInterest,
  monthlyRecap,
  onProTrialReasonToggle,
  proActive,
  proTrialDemandTotal,
  proTrialMessage,
  proTrialObjectionReplyCopy,
  proTrialPitchCopy,
  proTrialSummary,
  proValueNextAction,
  selectedProTrialReasonIds,
  storyPostingChecklistCopy,
  topProTrialReason,
  totalChallengePoints,
  valueProofStoryCopy,
  weeklyReport,
}) {
  return (
    <>
      <TribeProHeaderCard proActive={proActive} />
      <ProValueSnapshotCard
        proActive={proActive}
        weeklyReport={weeklyReport}
        monthlyRecap={monthlyRecap}
        totalChallengePoints={totalChallengePoints}
        proValueNextAction={proValueNextAction}
        valueProofStoryCopy={valueProofStoryCopy}
        storyPostingChecklistCopy={storyPostingChecklistCopy}
        communityHighlightRoundupItems={communityHighlightRoundupItems}
        copyText={copyText}
      />
      <ProTrialInterestSection
        selectedProTrialReasonIds={selectedProTrialReasonIds}
        onProTrialReasonToggle={onProTrialReasonToggle}
        isSavingProTrialInterest={isSavingProTrialInterest}
        proTrialMessage={proTrialMessage}
        isAdmin={isAdmin}
        proTrialSummary={proTrialSummary}
        topProTrialReason={topProTrialReason}
        proTrialPitchCopy={proTrialPitchCopy}
        proTrialDemandTotal={proTrialDemandTotal}
        proTrialObjectionReplyCopy={proTrialObjectionReplyCopy}
      />
    </>
  );
}
