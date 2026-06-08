const { HttpsError } = require('firebase-functions/v2/https');

function parseVerifyPurchaseRequest({ request, productCatalog }) {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError('unauthenticated', 'Sign in is required to verify purchases.');
  }

  const { platform, productId, transactionId, purchaseToken, environment } = request.data || {};
  const product = productCatalog[productId];
  if (!product) {
    throw new HttpsError('invalid-argument', 'Unknown product id.');
  }
  if (!product.platformTypes.includes(platform)) {
    throw new HttpsError('invalid-argument', 'Product is not available on this platform.');
  }
  if (!transactionId && !purchaseToken) {
    throw new HttpsError('invalid-argument', 'A transaction id or purchase token is required.');
  }

  return {
    uid,
    platform,
    product,
    productId,
    transactionId: transactionId || '',
    purchaseToken: purchaseToken || '',
    environment: environment || 'production',
  };
}

function assertPurchaseReadinessRequestAuth(request) {
  if (!request.auth?.uid) {
    throw new HttpsError('unauthenticated', 'Sign in is required to inspect purchase validation readiness.');
  }
}

module.exports = {
  assertPurchaseReadinessRequestAuth,
  parseVerifyPurchaseRequest,
};
