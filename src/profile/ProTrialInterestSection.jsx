import ProTrialAdminSummary from './ProTrialAdminSummary';
import ProTrialReasonSelector from './ProTrialReasonSelector';

export default function ProTrialInterestSection({
  selectedProTrialReasonIds,
  onProTrialReasonToggle,
  isSavingProTrialInterest,
  proTrialMessage,
  isAdmin,
  proTrialSummary,
  topProTrialReason,
  proTrialPitchCopy,
  proTrialDemandTotal,
  proTrialObjectionReplyCopy,
  proTrialLaunchQaCopy,
  proTrialSupportEscalationCopy,
  proTrialReviewMessage,
  proTrialReviewNotes,
  proTrialReviewQueue,
  approvedProTrialReviews,
  onProTrialReviewDecision,
  onProTrialReviewSubmit,
  isSubmittingProTrialReview,
  reviewingProTrialReviewId,
  setProTrialReviewNotes,
}) {
  return (
    <div style={{
      marginTop: 12, borderRadius: 12, padding: 12,
      background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.18)',
    }}>
      <ProTrialReasonSelector
        isSavingProTrialInterest={isSavingProTrialInterest}
        onProTrialReasonToggle={onProTrialReasonToggle}
        proTrialMessage={proTrialMessage}
        selectedProTrialReasonIds={selectedProTrialReasonIds}
      />
      {isAdmin && (
        <ProTrialAdminSummary
          proTrialDemandTotal={proTrialDemandTotal}
          proTrialObjectionReplyCopy={proTrialObjectionReplyCopy}
          proTrialLaunchQaCopy={proTrialLaunchQaCopy}
          proTrialSupportEscalationCopy={proTrialSupportEscalationCopy}
          proTrialPitchCopy={proTrialPitchCopy}
          proTrialSummary={proTrialSummary}
          proTrialReviewMessage={proTrialReviewMessage}
          proTrialReviewNotes={proTrialReviewNotes}
          proTrialReviewQueue={proTrialReviewQueue}
          approvedProTrialReviews={approvedProTrialReviews}
          onProTrialReviewDecision={onProTrialReviewDecision}
          onProTrialReviewSubmit={onProTrialReviewSubmit}
          isSubmittingProTrialReview={isSubmittingProTrialReview}
          reviewingProTrialReviewId={reviewingProTrialReviewId}
          setProTrialReviewNotes={setProTrialReviewNotes}
          topProTrialReason={topProTrialReason}
        />
      )}
    </div>
  );
}
