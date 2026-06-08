export function buildTribeProStatusFooterProps(model) {
  const {
    checkoutMessage,
    entitlementRecoveryMessage,
    proSource,
  } = model;

  return {
    checkoutMessage,
    entitlementRecoveryMessage,
    proSource,
  };
}
