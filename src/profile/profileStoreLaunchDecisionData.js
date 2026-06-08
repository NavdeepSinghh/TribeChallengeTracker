import {
  buildPaidLaunchDecisionItems,
  isValidationReadinessConfirmed,
  summarizeStoreTestEvidence,
} from './monetizationModel';

export function buildProfileStoreLaunchDecisionData({
  monetizationSignalTotal,
  storeCatalog,
  storeTestEvidenceLog,
  validationReadinessMessage,
}) {
  const validationReadinessConfirmed = isValidationReadinessConfirmed(validationReadinessMessage);
  const storeTestEvidenceSummary = summarizeStoreTestEvidence(storeTestEvidenceLog);
  const storeTestEvidenceReady = storeTestEvidenceSummary.minimumEvidence.ready && storeTestEvidenceSummary.unresolved_failed === 0 && storeTestEvidenceSummary.needs_review === 0;
  const paidLaunchDecisionItems = buildPaidLaunchDecisionItems({
    storeCatalog,
    monetizationSignalTotal,
    validationReadinessConfirmed,
    storeTestEvidenceReady,
  });
  const paidLaunchReadyCount = paidLaunchDecisionItems.filter(item => item.ready).length;
  const paidLaunchDecisionStatus = paidLaunchDecisionItems.every(item => item.ready) ? 'READY TO LAUNCH' : 'HOLD FOR STORE TESTS';

  return {
    paidLaunchDecisionItems,
    paidLaunchDecisionStatus,
    paidLaunchReadyCount,
    storeTestEvidenceReady,
    storeTestEvidenceSummary,
    validationReadinessConfirmed,
  };
}
