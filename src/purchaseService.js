import { STORE_PRODUCTS } from './proFeatures';
import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

export function getStoreProductCatalog() {
  return Object.values(STORE_PRODUCTS);
}

export function getStoreProduct(productId) {
  return getStoreProductCatalog().find(product => product.id === productId) || null;
}

export async function beginWebCheckout(productId) {
  const product = getStoreProduct(productId);
  if (!product) {
    throw new Error('Unknown store product.');
  }
  throw new Error('Web checkout is not configured yet. Use shared product IDs when wiring a billing provider.');
}

export async function syncWebPurchases() {
  throw new Error('Web purchase sync is not configured yet. Native apps restore purchases from StoreKit and Play Billing history.');
}

export async function verifyPurchase({ platform, productId, transactionId = '', purchaseToken = '', environment = 'production' }) {
  const product = getStoreProduct(productId);
  if (!product) {
    throw new Error('Unknown store product.');
  }
  const callable = httpsCallable(functions, 'verifyPurchase');
  const result = await callable({
    platform,
    productId,
    transactionId,
    purchaseToken,
    environment,
  });
  return result.data;
}

export async function getPurchaseValidationReadiness() {
  const callable = httpsCallable(functions, 'getPurchaseValidationReadiness');
  const result = await callable({});
  return result.data;
}
