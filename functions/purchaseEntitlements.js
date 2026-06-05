const crypto = require('crypto');

const PRODUCT_CATALOG = {
  'com.risewiththetribe.pro.monthly': {
    platformTypes: ['ios', 'android'],
    entitlement: 'pro',
    kind: 'subscription',
    cadence: 'monthly',
  },
  'com.risewiththetribe.pro.yearly': {
    platformTypes: ['ios', 'android'],
    entitlement: 'pro',
    kind: 'subscription',
    cadence: 'yearly',
  },
  'com.risewiththetribe.pack.21_day_reset': {
    platformTypes: ['ios', 'android'],
    entitlement: 'paidChallengePacks',
    kind: 'challengePack',
    packId: '21_day_reset',
  },
  'com.risewiththetribe.pack.summer_shred': {
    platformTypes: ['ios', 'android'],
    entitlement: 'paidChallengePacks',
    kind: 'challengePack',
    packId: 'summer_shred',
  },
};

const VALIDATION_CONFIG = {
  ios: {
    requiredKeys: [
      'APP_STORE_ISSUER_ID',
      'APP_STORE_KEY_ID',
      'APP_STORE_PRIVATE_KEY',
      'APP_STORE_BUNDLE_ID',
    ],
    credentialLabel: 'App Store Server API credentials',
    source: 'app_store',
  },
  android: {
    requiredKeys: [
      'PLAY_DEVELOPER_SERVICE_ACCOUNT_JSON',
      'PLAY_PACKAGE_NAME',
    ],
    credentialLabel: 'Google Play Developer API service account',
    source: 'play_billing',
  },
};

function getValidationReadiness(platform, env = process.env) {
  const validationConfig = VALIDATION_CONFIG[platform];
  if (!validationConfig) {
    return {
      validationConfig: null,
      missingConfigKeys: [],
      validationConfigured: false,
      status: 'unsupported_platform',
      message: `Purchase validation is not configured for platform: ${platform}.`,
      nextAction: 'Use ios or android for purchase validation readiness.',
    };
  }

  const missingConfigKeys = missingRequiredConfig(validationConfig?.requiredKeys || [], env);
  const validationConfigured = missingConfigKeys.length === 0;

  return {
    validationConfig,
    missingConfigKeys,
    validationConfigured,
    status: validationConfigured ? 'validation_configured' : 'validation_not_configured',
    message: validationConfigured
      ? `${validationConfig.credentialLabel} detected. Server-side receipt validation is ready to call the provider.`
      : `Server-side ${validationConfig.credentialLabel} are not configured yet.`,
    nextAction: validationConfigured
      ? 'Run sandbox/license-test purchases through verifyPurchase before promoting paid access.'
      : `Configure ${validationConfig.credentialLabel} for ${platform}.`,
  };
}

function buildEntitlementData({ product, productId, platform, transactionId = '', validationResult = {}, now }) {
  const source = VALIDATION_CONFIG[platform]?.source || platform;
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

function missingRequiredConfig(keys, env = process.env) {
  return keys.filter((key) => !env[key]);
}

function hashForAudit(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

module.exports = {
  PRODUCT_CATALOG,
  VALIDATION_CONFIG,
  buildEntitlementData,
  buildPurchaseRecord,
  getValidationReadiness,
  hashForAudit,
  missingRequiredConfig,
  purchaseRecordId,
};
