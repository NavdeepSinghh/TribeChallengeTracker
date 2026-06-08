export function buildStoreCheckoutButtonProps({
  challengePackTitle,
  checkoutProductId,
  isPackUnlocked,
  onCheckout,
}) {
  return {
    checkoutProductId,
    onCheckout,
    isPackUnlocked,
    challengePackTitle,
  };
}
