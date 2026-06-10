import EntitlementRecoveryDecisionKit from './EntitlementRecoveryDecisionKit';
import PaidLaunchDecisionReviewKit from './PaidLaunchDecisionReviewKit';
import StoreReviewResponseReviewKit from './StoreReviewResponseReviewKit';
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
  approvedPaidLaunchDecisionReviews = [],
  isSubmittingPaidLaunchDecisionReview,
  onPaidLaunchDecisionReviewDecision = () => {},
  onPaidLaunchDecisionReviewSubmit = () => {},
  paidLaunchDecisionReviewMessage,
  paidLaunchDecisionReviewNotes = {},
  paidLaunchDecisionReviewQueue = [],
  reviewingPaidLaunchDecisionReviewId,
  setPaidLaunchDecisionReviewNotes = () => {},
  approvedStoreReviewResponseReviews = [],
  isSubmittingStoreReviewResponseReview,
  onStoreReviewResponseReviewDecision = () => {},
  onStoreReviewResponseReviewSubmit = () => {},
  reviewingStoreReviewResponseReviewId,
  setStoreReviewResponseReviewNotes = () => {},
  storeReviewResponseReviewMessage,
  storeReviewResponseReviewNotes = {},
  storeReviewResponseReviewQueue = [],
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
      <StoreReviewResponseReviewKit
        approvedStoreReviewResponseReviews={approvedStoreReviewResponseReviews}
        isSubmittingStoreReviewResponseReview={isSubmittingStoreReviewResponseReview}
        onStoreReviewResponseReviewDecision={onStoreReviewResponseReviewDecision}
        onStoreReviewResponseReviewSubmit={onStoreReviewResponseReviewSubmit}
        reviewingStoreReviewResponseReviewId={reviewingStoreReviewResponseReviewId}
        setStoreReviewResponseReviewNotes={setStoreReviewResponseReviewNotes}
        storeReviewResponseReviewMessage={storeReviewResponseReviewMessage}
        storeReviewResponseReviewNotes={storeReviewResponseReviewNotes}
        storeReviewResponseReviewQueue={storeReviewResponseReviewQueue}
      />
      <PaidLaunchDecisionReviewKit
        approvedPaidLaunchDecisionReviews={approvedPaidLaunchDecisionReviews}
        isSubmittingPaidLaunchDecisionReview={isSubmittingPaidLaunchDecisionReview}
        onPaidLaunchDecisionReviewDecision={onPaidLaunchDecisionReviewDecision}
        onPaidLaunchDecisionReviewSubmit={onPaidLaunchDecisionReviewSubmit}
        paidLaunchDecisionReviewMessage={paidLaunchDecisionReviewMessage}
        paidLaunchDecisionReviewNotes={paidLaunchDecisionReviewNotes}
        paidLaunchDecisionReviewQueue={paidLaunchDecisionReviewQueue}
        reviewingPaidLaunchDecisionReviewId={reviewingPaidLaunchDecisionReviewId}
        setPaidLaunchDecisionReviewNotes={setPaidLaunchDecisionReviewNotes}
      />
    </>
  );
}
