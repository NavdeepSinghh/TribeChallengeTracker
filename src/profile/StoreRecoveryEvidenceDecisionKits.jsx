import EntitlementRecoveryDecisionKit from './EntitlementRecoveryDecisionKit';
import StoreTestEvidenceDecisionKit from './StoreTestEvidenceDecisionKit';

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
