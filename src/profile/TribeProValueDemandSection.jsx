import ProTrialInterestSection from './ProTrialInterestSection';
import ProValueSnapshotCard from './ProValueSnapshotCard';
import TribeProHeaderCard from './TribeProHeaderCard';

export default function TribeProValueDemandSection({
  communityHighlightRoundupItems,
  challengePackLaunchCopy,
  challengePackLaunchQaCopy,
  challengePackObjectionReplyCopy,
  challengePackSupportTriageCopy,
  copyText,
  approvedProTrialReviews,
  isAdmin,
  isSavingProTrialInterest,
  isSubmittingProTrialReview,
  monthlyRecap,
  onProTrialReasonToggle,
  proActive,
  proTrialDemandTotal,
  proTrialMessage,
  proTrialObjectionReplyCopy,
  proTrialPitchCopy,
  proTrialLaunchQaCopy,
  proTrialSupportEscalationCopy,
  proTrialReviewMessage,
  proTrialReviewNotes,
  proTrialReviewQueue,
  proTrialSummary,
  proValueNextAction,
  selectedProTrialReasonIds,
  setProTrialReviewNotes,
  storyPostingChecklistCopy,
  onProTrialReviewDecision,
  onProTrialReviewSubmit,
  reviewingProTrialReviewId,
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
        challengePackLaunchCopy={challengePackLaunchCopy}
        challengePackLaunchQaCopy={challengePackLaunchQaCopy}
        challengePackObjectionReplyCopy={challengePackObjectionReplyCopy}
        challengePackSupportTriageCopy={challengePackSupportTriageCopy}
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
        proTrialLaunchQaCopy={proTrialLaunchQaCopy}
        proTrialSupportEscalationCopy={proTrialSupportEscalationCopy}
        proTrialReviewMessage={proTrialReviewMessage}
        proTrialReviewNotes={proTrialReviewNotes}
        proTrialReviewQueue={proTrialReviewQueue}
        approvedProTrialReviews={approvedProTrialReviews}
        onProTrialReviewDecision={onProTrialReviewDecision}
        onProTrialReviewSubmit={onProTrialReviewSubmit}
        isSubmittingProTrialReview={isSubmittingProTrialReview}
        reviewingProTrialReviewId={reviewingProTrialReviewId}
        setProTrialReviewNotes={setProTrialReviewNotes}
      />
    </>
  );
}
