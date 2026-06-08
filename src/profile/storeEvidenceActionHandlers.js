import { buildStoreEvidenceRecordActionHandlers } from './storeEvidenceRecordActionHandlers';
import { buildStoreEvidenceReviewActionHandlers } from './storeEvidenceReviewActionHandlers';
import { buildStoreValidationReadinessActionHandlers } from './storeValidationReadinessActionHandlers';

export function buildStoreEvidenceActionHandlers({
  isAdmin,
  profile,
  recordingStoreTestEvidenceId,
  reviewingStoreTestEvidenceId,
  setIsCheckingValidationReadiness,
  setRecordingStoreTestEvidenceId,
  setReviewingStoreTestEvidenceId,
  setStoreTestEvidenceLog,
  setStoreTestEvidenceMessage,
  setValidationReadinessMessage,
  storeTestEvidenceReviewNotes,
  user,
}) {
  const validationReadinessHandlers = buildStoreValidationReadinessActionHandlers({
    setIsCheckingValidationReadiness,
    setValidationReadinessMessage,
  });
  const recordHandlers = buildStoreEvidenceRecordActionHandlers({
    isAdmin,
    recordingStoreTestEvidenceId,
    setRecordingStoreTestEvidenceId,
    setStoreTestEvidenceLog,
    setStoreTestEvidenceMessage,
    user,
  });
  const reviewHandlers = buildStoreEvidenceReviewActionHandlers({
    isAdmin,
    profile,
    reviewingStoreTestEvidenceId,
    setReviewingStoreTestEvidenceId,
    setStoreTestEvidenceLog,
    setStoreTestEvidenceMessage,
    storeTestEvidenceReviewNotes,
    user,
  });

  return {
    ...recordHandlers,
    ...reviewHandlers,
    ...validationReadinessHandlers,
  };
}
