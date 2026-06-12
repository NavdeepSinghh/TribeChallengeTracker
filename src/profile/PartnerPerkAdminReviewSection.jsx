import PartnerPerkClaimReviewQueue from './PartnerPerkClaimReviewQueue';
import PartnerPerkCopyKits from './PartnerPerkCopyKits';
import PartnerPerkHandoffAuditReviewCard from './PartnerPerkHandoffAuditReviewCard';

export default function PartnerPerkAdminReviewSection({
  approvedPartnerPerkHandoffAuditReviews,
  isSubmittingPartnerPerkHandoffAuditReview,
  onPartnerPerkHandoffAuditReviewDecision,
  onPartnerPerkHandoffAuditReviewSubmit,
  partnerPerkClaimReviewQueue,
  partnerPerkHandoffAuditReviewMessage,
  partnerPerkHandoffAuditReviewNotes,
  partnerPerkHandoffAuditReviewQueue,
  partnerPerkReviewNotes,
  reviewingPartnerPerkHandoffAuditReviewId,
  setPartnerPerkReviewNotes,
  setPartnerPerkHandoffAuditReviewNotes,
  reviewingPartnerPerkClaimId,
  onPartnerPerkClaimReview,
  partnerPerkDecisionReplyCopy,
  partnerPerkFulfillmentReadinessCopy,
  partnerPerkFulfillmentHandoffCopy,
  partnerPerkHandoffAuditCopy,
  partnerPerkHandoffAuditDecisionReplyCopy,
  partnerPerkSupportEscalationCopy,
  partnerSupportReadinessScriptCopy,
}) {
  const hasClaims = partnerPerkClaimReviewQueue.length > 0;

  return (
    <>
      <PartnerPerkClaimReviewQueue
        hasClaims={hasClaims}
        onPartnerPerkClaimReview={onPartnerPerkClaimReview}
        partnerPerkClaimReviewQueue={partnerPerkClaimReviewQueue}
        partnerPerkReviewNotes={partnerPerkReviewNotes}
        reviewingPartnerPerkClaimId={reviewingPartnerPerkClaimId}
        setPartnerPerkReviewNotes={setPartnerPerkReviewNotes}
      />
      <PartnerPerkCopyKits
        hasClaims={hasClaims}
        partnerPerkClaimReviewQueue={partnerPerkClaimReviewQueue}
        partnerPerkDecisionReplyCopy={partnerPerkDecisionReplyCopy}
        partnerPerkFulfillmentHandoffCopy={partnerPerkFulfillmentHandoffCopy}
        partnerPerkFulfillmentReadinessCopy={partnerPerkFulfillmentReadinessCopy}
        partnerPerkHandoffAuditCopy={partnerPerkHandoffAuditCopy}
        partnerPerkHandoffAuditDecisionReplyCopy={partnerPerkHandoffAuditDecisionReplyCopy}
        partnerPerkSupportEscalationCopy={partnerPerkSupportEscalationCopy}
        partnerSupportReadinessScriptCopy={partnerSupportReadinessScriptCopy}
      />
      <PartnerPerkHandoffAuditReviewCard
        approvedPartnerPerkHandoffAuditReviews={approvedPartnerPerkHandoffAuditReviews}
        isSubmittingPartnerPerkHandoffAuditReview={isSubmittingPartnerPerkHandoffAuditReview}
        onDecision={onPartnerPerkHandoffAuditReviewDecision}
        onSubmit={onPartnerPerkHandoffAuditReviewSubmit}
        partnerPerkHandoffAuditReviewMessage={partnerPerkHandoffAuditReviewMessage}
        partnerPerkHandoffAuditReviewNotes={partnerPerkHandoffAuditReviewNotes}
        partnerPerkHandoffAuditReviewQueue={partnerPerkHandoffAuditReviewQueue}
        reviewingPartnerPerkHandoffAuditReviewId={reviewingPartnerPerkHandoffAuditReviewId}
        setPartnerPerkHandoffAuditReviewNotes={setPartnerPerkHandoffAuditReviewNotes}
      />
    </>
  );
}
