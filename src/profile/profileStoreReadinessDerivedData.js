import {
  STORE_CREDENTIAL_SETUP_ITEMS,
  SUBSCRIPTION_MANAGEMENT_GUIDANCE_ITEMS,
  SUPPORT_REFUND_READINESS_ITEMS,
} from './profileConstants';
import { buildProfileStoreLaunchGateData } from './profileStoreLaunchGateData';
import { buildStoreReadinessSupportCopy } from './storeReadinessCopy';

export function buildProfileStoreReadinessDerivedData({
  monetizationSignalTotal,
  recommendedRevenuePath,
  storeCatalog,
  storePackCount,
  storeSubscriptionCount,
  storeTestEvidenceLog,
  validationReadinessMessage,
}) {
  const storeReadinessSupportCopy = buildStoreReadinessSupportCopy({
    storeCredentialSetupItems: STORE_CREDENTIAL_SETUP_ITEMS,
    supportRefundReadinessItems: SUPPORT_REFUND_READINESS_ITEMS,
    subscriptionManagementGuidanceItems: SUBSCRIPTION_MANAGEMENT_GUIDANCE_ITEMS,
    storeCatalog,
    storeSubscriptionCount,
    storePackCount,
    monetizationSignalTotal,
  });
  const storeLaunchGateData = buildProfileStoreLaunchGateData({
    monetizationSignalTotal,
    recommendedRevenuePath,
    storeCatalog,
    storeTestEvidenceLog,
    validationReadinessMessage,
  });

  return {
    ...storeReadinessSupportCopy,
    ...storeLaunchGateData,
  };
}
