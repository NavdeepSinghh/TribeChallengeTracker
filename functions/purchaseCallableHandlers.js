const {
  PRODUCT_CATALOG,
  getValidationReadiness,
} = require('./purchaseEntitlements');
const {
  applyVerifiedEntitlement,
  recordPurchaseVerificationAttempt,
} = require('./purchaseVerificationService');
const {
  buildFailedPurchaseVerificationResponse,
  buildPurchaseValidationReadinessResponse,
  buildVerifiedPurchaseResponse,
} = require('./purchaseCallableResponses');
const {
  assertPurchaseReadinessRequestAuth,
  parseVerifyPurchaseRequest,
} = require('./purchaseCallableRequestValidation');
const { validateStorePurchase } = require('./storeValidation');

async function handleVerifyPurchaseRequest({ admin, request }) {
  const {
    uid,
    platform,
    product,
    productId,
    transactionId,
    purchaseToken,
    environment,
  } = parseVerifyPurchaseRequest({ request, productCatalog: PRODUCT_CATALOG });

  const {
    validationConfig,
    missingConfigKeys,
    validationConfigured,
    status,
    message,
    nextAction,
  } = getValidationReadiness(platform);

  const validationResult = validationConfigured
    ? await validateStorePurchase({
      platform,
      product,
      productId,
      transactionId,
      purchaseToken,
      environment,
    })
    : {
      verified: false,
      status,
      message,
    };
  await recordPurchaseVerificationAttempt({
    admin,
    uid,
    platform,
    product,
    productId,
    transactionId,
    purchaseToken,
    environment,
    validationResult,
    validationConfigured,
    missingConfigKeys,
    fallbackStatus: status,
  });

  if (!validationResult.verified) {
    return buildFailedPurchaseVerificationResponse({
      product,
      productId,
      validationConfig,
      validationConfigured,
      validationResult,
      missingConfigKeys,
      status,
      message,
      nextAction,
    });
  }

  await applyVerifiedEntitlement({
    admin,
    uid,
    platform,
    product,
    productId,
    transactionId,
    purchaseToken,
    environment,
    validationResult,
  });

  return buildVerifiedPurchaseResponse({
    product,
    productId,
    validationConfig,
    validationConfigured,
    validationResult,
    missingConfigKeys,
  });
}

async function handlePurchaseValidationReadinessRequest({ request }) {
  assertPurchaseReadinessRequestAuth(request);

  const platforms = ['ios', 'android'];
  return buildPurchaseValidationReadinessResponse({ platforms, getValidationReadiness });
}

module.exports = {
  handlePurchaseValidationReadinessRequest,
  handleVerifyPurchaseRequest,
};
