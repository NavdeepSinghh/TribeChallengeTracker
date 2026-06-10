import EntitlementRecoveryDecisionKit from './EntitlementRecoveryDecisionKit';
import StoreTestEvidenceDecisionKit from './StoreTestEvidenceDecisionKit';
import SupportRefundReadinessReviewKit from './SupportRefundReadinessReviewKit';

export default function StoreRecoveryEvidenceDecisionKits({
  entitlementRecoveryDecisionReplyCopy,
  entitlementRecoveryReviewQueue = [],
  entitlementRecoveryReviewNotes = {},
  setEntitlementRecoveryReviewNotes = () => {},
  onEntitlementRecoveryReview = () => {},
  reviewingEntitlementRecoveryRequestId,
  onValidationReadinessCheck = () => {},
  isCheckingValidationReadiness,
  validationReadinessMessage,
  storeTestEvidenceCases = [],
  storeTestEvidenceDecisionReplyCopy,
  storeTestEvidenceLog = [],
  storeTestEvidenceMessage,
  storeTestEvidenceReviewNotes = {},
  setStoreTestEvidenceReviewNotes = () => {},
  onRecordStoreTestEvidence = () => {},
  onReviewStoreTestEvidence = () => {},
  recordingStoreTestEvidenceId,
  reviewingStoreTestEvidenceId,
  approvedSupportRefundReadinessReviews = [],
  isSubmittingSupportRefundReadinessReview,
  onSupportRefundReadinessReviewDecision = () => {},
  onSupportRefundReadinessReviewSubmit = () => {},
  reviewingSupportRefundReadinessReviewId,
  setSupportRefundReadinessReviewNotes = () => {},
  supportRefundReadinessReviewMessage,
  supportRefundReadinessReviewNotes = {},
  supportRefundReadinessReviewQueue = [],
}) {
  return (
    <>
      <EntitlementRecoveryDecisionKit
        entitlementRecoveryDecisionReplyCopy={entitlementRecoveryDecisionReplyCopy}
        entitlementRecoveryReviewNotes={entitlementRecoveryReviewNotes}
        entitlementRecoveryReviewQueue={entitlementRecoveryReviewQueue}
        onEntitlementRecoveryReview={onEntitlementRecoveryReview}
        reviewingEntitlementRecoveryRequestId={reviewingEntitlementRecoveryRequestId}
        setEntitlementRecoveryReviewNotes={setEntitlementRecoveryReviewNotes}
      />
      <SupportRefundReadinessReviewKit
        approvedSupportRefundReadinessReviews={approvedSupportRefundReadinessReviews}
        isSubmittingSupportRefundReadinessReview={isSubmittingSupportRefundReadinessReview}
        onSupportRefundReadinessReviewDecision={onSupportRefundReadinessReviewDecision}
        onSupportRefundReadinessReviewSubmit={onSupportRefundReadinessReviewSubmit}
        reviewingSupportRefundReadinessReviewId={reviewingSupportRefundReadinessReviewId}
        setSupportRefundReadinessReviewNotes={setSupportRefundReadinessReviewNotes}
        supportRefundReadinessReviewMessage={supportRefundReadinessReviewMessage}
        supportRefundReadinessReviewNotes={supportRefundReadinessReviewNotes}
        supportRefundReadinessReviewQueue={supportRefundReadinessReviewQueue}
      />
      <StoreTestEvidenceDecisionKit
        isCheckingValidationReadiness={isCheckingValidationReadiness}
        onRecordStoreTestEvidence={onRecordStoreTestEvidence}
        onReviewStoreTestEvidence={onReviewStoreTestEvidence}
        onValidationReadinessCheck={onValidationReadinessCheck}
        recordingStoreTestEvidenceId={recordingStoreTestEvidenceId}
        reviewingStoreTestEvidenceId={reviewingStoreTestEvidenceId}
        setStoreTestEvidenceReviewNotes={setStoreTestEvidenceReviewNotes}
        storeTestEvidenceCases={storeTestEvidenceCases}
        storeTestEvidenceDecisionReplyCopy={storeTestEvidenceDecisionReplyCopy}
        storeTestEvidenceLog={storeTestEvidenceLog}
        storeTestEvidenceMessage={storeTestEvidenceMessage}
        storeTestEvidenceReviewNotes={storeTestEvidenceReviewNotes}
        validationReadinessMessage={validationReadinessMessage}
      />
    </>
  );
}
