const crypto = require('crypto');

function buildEntitlementData({
  product,
  productId,
  platform,
  transactionId = '',
  validationResult = {},
  validationConfigByPlatform,
  now,
}) {
  const source = validationConfigByPlatform[platform]?.source || platform;
  const baseEntitlement = {
    active: true,
    source,
    productId,
    transactionId,
    updatedAt: now,
  };

  if (validationResult.expiresAt) {
    baseEntitlement.expiresAt = validationResult.expiresAt;
  }

  if (product.kind === 'subscription') {
    return {
      entitlements: {
        pro: {
          ...baseEntitlement,
          cadence: product.cadence || '',
        },
      },
    };
  }

  return {
    entitlements: {
      packs: {
        [product.packId]: {
          ...baseEntitlement,
          packId: product.packId,
        },
      },
    },
  };
}

function buildPurchaseRecord({
  uid,
  platform,
  product,
  productId,
  transactionId = '',
  purchaseToken = '',
  environment = 'production',
  status,
  validationConfigured,
  missingConfigKeys = [],
  now,
}) {
  return {
    uid,
    platform,
    productId,
    productKind: product.kind,
    entitlement: product.entitlement,
    packId: product.packId || '',
    cadence: product.cadence || '',
    transactionId,
    purchaseTokenHash: purchaseToken ? hashForAudit(purchaseToken) : '',
    environment,
    status,
    validationConfigured,
    missingConfigKeys,
    updatedAt: now,
    createdAt: now,
  };
}

function purchaseRecordId({ platform, productId, transactionId = '', purchaseToken = '' }) {
  const stableId = transactionId || hashForAudit(purchaseToken);
  return `${platform}_${hashForAudit(`${productId}:${stableId}`)}`;
}

function hashForAudit(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

module.exports = {
  buildEntitlementData,
  buildPurchaseRecord,
  hashForAudit,
  purchaseRecordId,
};
