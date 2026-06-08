function buildFailedPurchaseVerificationResponse({
  product,
  productId,
  validationConfig,
  validationConfigured,
  validationResult,
  missingConfigKeys,
  status,
  message,
  nextAction,
}) {
  return {
    verified: false,
    entitlementUpdated: false,
    status: validationResult.status || status,
    reason: validationResult.status || status,
    message: validationResult.message || message,
    productId,
    productKind: product.kind,
    entitlement: product.entitlement,
    packId: product.packId || '',
    validationConfigured,
    missingConfigKeys,
    requiredConfigKeys: validationConfig?.requiredKeys || [],
    nextAction: validationConfigured ? 'Review store validation response and product setup.' : nextAction,
  };
}

function buildVerifiedPurchaseResponse({
  product,
  productId,
  validationConfig,
  validationConfigured,
  validationResult,
  missingConfigKeys,
}) {
  return {
    verified: true,
    entitlementUpdated: true,
    status: 'verified',
    reason: 'verified',
    message: validationResult.message || 'Purchase verified.',
    productId,
    productKind: product.kind,
    entitlement: product.entitlement,
    packId: product.packId || '',
    validationConfigured,
    missingConfigKeys,
    requiredConfigKeys: validationConfig?.requiredKeys || [],
    nextAction: 'Refresh profile and entitlements on the client.',
  };
}

function buildPurchaseValidationReadinessResponse({ platforms, getValidationReadiness }) {
  return {
    status: 'readiness_checked',
    message: 'Purchase validation readiness checked. No entitlements were changed.',
    platforms: platforms.reduce((result, platform) => {
      const {
        validationConfig,
        missingConfigKeys,
        validationConfigured,
        status,
        message,
        nextAction,
      } = getValidationReadiness(platform);
      result[platform] = {
        validationConfigured,
        status,
        message,
        nextAction,
        missingConfigKeys,
        requiredConfigKeys: validationConfig?.requiredKeys || [],
      };
      return result;
    }, {}),
  };
}

module.exports = {
  buildFailedPurchaseVerificationResponse,
  buildPurchaseValidationReadinessResponse,
  buildVerifiedPurchaseResponse,
};
