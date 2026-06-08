import {
  beginWebCheckout,
  syncWebPurchases,
} from '../purchaseService';

export function buildStoreCheckoutActionHandlers({
  setCheckoutMessage,
  setCheckoutProductId,
}) {
  const handleCheckout = async productId => {
    setCheckoutProductId(productId);
    setCheckoutMessage('');
    try {
      await beginWebCheckout(productId);
      setCheckoutMessage('Checkout started.');
    } catch (err) {
      setCheckoutMessage(err?.message || 'Checkout is not configured yet.');
    } finally {
      setCheckoutProductId('');
    }
  };

  const handleSyncPurchases = async () => {
    setCheckoutProductId('sync');
    setCheckoutMessage('');
    try {
      await syncWebPurchases();
      setCheckoutMessage('Purchases synced.');
    } catch (err) {
      setCheckoutMessage(err?.message || 'Purchase sync is not configured yet.');
    } finally {
      setCheckoutProductId('');
    }
  };

  return {
    handleCheckout,
    handleSyncPurchases,
  };
}
