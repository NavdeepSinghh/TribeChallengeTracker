const { createAppleServerJwt, validateApplePurchase } = require('./appleStoreValidation');
const {
  normalizeGoogleProduct,
  normalizeGoogleSubscription,
  validateGooglePlayPurchase,
} = require('./googlePlayValidation');
const { decodeJwtPayload } = require('./storeValidationJwt');

async function validateStorePurchase({ platform, product, productId, transactionId = '', purchaseToken = '', environment = 'production', env = process.env }) {
  try {
    if (platform === 'ios') {
      return validateApplePurchase({ product, productId, transactionId, environment, env });
    }
    if (platform === 'android') {
      return validateGooglePlayPurchase({ product, productId, purchaseToken, env });
    }
    return {
      verified: false,
      status: 'unsupported_platform',
      message: `Unsupported purchase platform: ${platform}.`,
    };
  } catch (error) {
    return {
      verified: false,
      status: 'validation_request_failed',
      message: error?.message || 'Purchase validation request failed.',
    };
  }
}

module.exports = {
  createAppleServerJwt,
  decodeJwtPayload,
  normalizeGoogleProduct,
  normalizeGoogleSubscription,
  validateStorePurchase,
};
