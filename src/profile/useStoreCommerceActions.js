import { buildEntitlementRecoveryActionHandlers } from './entitlementRecoveryActionHandlers';
import { buildStoreCheckoutActionHandlers } from './storeCheckoutActionHandlers';
import { buildStoreEvidenceActionHandlers } from './storeEvidenceActionHandlers';

export default function useStoreCommerceActions(inputs) {
  const checkoutActions = buildStoreCheckoutActionHandlers(inputs);
  const entitlementRecoveryActions = buildEntitlementRecoveryActionHandlers(inputs);
  const storeEvidenceActions = buildStoreEvidenceActionHandlers(inputs);

  return {
    ...checkoutActions,
    ...entitlementRecoveryActions,
    ...storeEvidenceActions,
  };
}
