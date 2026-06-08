export function buildStoreMemberRecoveryActionProps({
  checkoutProductId,
  isRequestingEntitlementRecovery,
  onEntitlementRecoveryRequest,
  onSyncPurchases,
}) {
  return {
    checkoutProductId,
    onSyncPurchases,
    onEntitlementRecoveryRequest,
    isRequestingEntitlementRecovery,
  };
}
