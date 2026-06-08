import { buildProfileStoreLaunchDecisionData } from './profileStoreLaunchDecisionData';
import { buildStoreDecisionCopy } from './storeDecisionCopy';

export function buildProfileStoreLaunchGateData({
  monetizationSignalTotal,
  recommendedRevenuePath,
  storeCatalog,
  storeTestEvidenceLog,
  validationReadinessMessage,
}) {
  const launchDecisionData = buildProfileStoreLaunchDecisionData({
    monetizationSignalTotal,
    storeCatalog,
    storeTestEvidenceLog,
    validationReadinessMessage,
  });
  const {
    paidLaunchDecisionItems,
    paidLaunchDecisionStatus,
    paidLaunchReadyCount,
    storeTestEvidenceReady,
    storeTestEvidenceSummary,
    validationReadinessConfirmed,
  } = launchDecisionData;
  const launchDecisionCopy = buildStoreDecisionCopy({
    storeTestEvidenceSummary,
    storeTestEvidenceReady,
    paidLaunchDecisionStatus,
    paidLaunchReadyCount,
    paidLaunchDecisionItems,
    recommendedRevenuePath,
    monetizationSignalTotal,
    validationReadinessConfirmed,
  });

  return {
    ...launchDecisionData,
    ...launchDecisionCopy,
  };
}
