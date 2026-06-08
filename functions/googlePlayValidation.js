const { readJsonResponse, validationFailure } = require('./storeValidationHttp');
const { getGoogleAccessToken } = require('./googlePlayAccessToken');
const {
  normalizeGoogleProduct,
  normalizeGoogleSubscription,
} = require('./googlePlayPurchaseNormalization');

async function validateGooglePlayPurchase({ product, productId, purchaseToken, env }) {
  const accessToken = await getGoogleAccessToken(env);
  if (product.kind === 'subscription') {
    const response = await fetch(
      `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(env.PLAY_PACKAGE_NAME)}/purchases/subscriptionsv2/tokens/${encodeURIComponent(purchaseToken)}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const body = await readJsonResponse(response);
    if (!response.ok) {
      return validationFailure('play_subscription_validation_failed', body, response.status);
    }
    return normalizeGoogleSubscription(body, productId);
  }

  const response = await fetch(
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(env.PLAY_PACKAGE_NAME)}/purchases/productsv2/tokens/${encodeURIComponent(purchaseToken)}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const body = await readJsonResponse(response);
  if (!response.ok) {
    return validationFailure('play_product_validation_failed', body, response.status);
  }
  return normalizeGoogleProduct(body, productId);
}

module.exports = {
  getGoogleAccessToken,
  normalizeGoogleProduct,
  normalizeGoogleSubscription,
  validateGooglePlayPurchase,
};
