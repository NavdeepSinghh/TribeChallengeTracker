import { buildEntitlementRecoveryActionHandlers } from './entitlementRecoveryActionHandlers';
import { buildStoreCheckoutActionHandlers } from './storeCheckoutActionHandlers';
import { buildStoreEvidenceActionHandlers } from './storeEvidenceActionHandlers';
import { buildSupportRefundReadinessReviewActionHandlers } from './supportRefundReadinessReviewActionHandlers';

export default function useStoreCommerceActions(inputs) {
  const checkoutActions = buildStoreCheckoutActionHandlers(inputs);
  const entitlementRecoveryActions = buildEntitlementRecoveryActionHandlers(inputs);
  const storeEvidenceActions = buildStoreEvidenceActionHandlers(inputs);
  const supportRefundReadinessReviewActions = buildSupportRefundReadinessReviewActionHandlers(inputs);

  return {
    ...checkoutActions,
    ...entitlementRecoveryActions,
    ...storeEvidenceActions,
    ...supportRefundReadinessReviewActions,
  };
}
