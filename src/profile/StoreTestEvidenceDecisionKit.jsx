import StoreTestEvidenceCaseButtons from './StoreTestEvidenceCaseButtons';
import StoreTestEvidenceHeaderActions from './StoreTestEvidenceHeaderActions';
import StoreTestEvidenceReviewList from './StoreTestEvidenceReviewList';

export default function StoreTestEvidenceDecisionKit({
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
    <div style={{
      borderRadius: 12, padding: 12,
      background: 'rgba(14,165,233,0.075)',
      border: '1px solid rgba(14,165,233,0.18)',
    }}>
      <StoreTestEvidenceHeaderActions
        isCheckingValidationReadiness={isCheckingValidationReadiness}
        onValidationReadinessCheck={onValidationReadinessCheck}
        storeTestEvidenceDecisionReplyCopy={storeTestEvidenceDecisionReplyCopy}
        storeTestEvidenceLog={storeTestEvidenceLog}
        validationReadinessMessage={validationReadinessMessage}
      />
      <StoreTestEvidenceCaseButtons
        onRecordStoreTestEvidence={onRecordStoreTestEvidence}
        recordingStoreTestEvidenceId={recordingStoreTestEvidenceId}
        storeTestEvidenceCases={storeTestEvidenceCases}
      />
      <StoreTestEvidenceReviewList
        onReviewStoreTestEvidence={onReviewStoreTestEvidence}
        reviewingStoreTestEvidenceId={reviewingStoreTestEvidenceId}
        setStoreTestEvidenceReviewNotes={setStoreTestEvidenceReviewNotes}
        storeTestEvidenceLog={storeTestEvidenceLog}
        storeTestEvidenceMessage={storeTestEvidenceMessage}
        storeTestEvidenceReviewNotes={storeTestEvidenceReviewNotes}
      />
    </div>
  );
}
