import { buildEntitlementRecoveryActionHandlers } from './entitlementRecoveryActionHandlers';
import { buildStoreCheckoutActionHandlers } from './storeCheckoutActionHandlers';
import { buildStoreEvidenceActionHandlers } from './storeEvidenceActionHandlers';
import { buildPaidLaunchDecisionReviewActionHandlers } from './paidLaunchDecisionReviewActionHandlers';
import { buildStoreReviewResponseReviewActionHandlers } from './storeReviewResponseReviewActionHandlers';
import { buildSupportRefundReadinessReviewActionHandlers } from './supportRefundReadinessReviewActionHandlers';

export default function useStoreCommerceActions(inputs) {
  const checkoutActions = buildStoreCheckoutActionHandlers(inputs);
  const entitlementRecoveryActions = buildEntitlementRecoveryActionHandlers(inputs);
  const paidLaunchDecisionReviewActions = buildPaidLaunchDecisionReviewActionHandlers(inputs);
  const storeEvidenceActions = buildStoreEvidenceActionHandlers(inputs);
  const storeReviewResponseReviewActions = buildStoreReviewResponseReviewActionHandlers(inputs);
  const supportRefundReadinessReviewActions = buildSupportRefundReadinessReviewActionHandlers(inputs);

  return {
    ...checkoutActions,
    ...entitlementRecoveryActions,
    ...paidLaunchDecisionReviewActions,
    ...storeEvidenceActions,
    ...storeReviewResponseReviewActions,
    ...supportRefundReadinessReviewActions,
  };
}
