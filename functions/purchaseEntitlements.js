const {
  buildEntitlementData: buildEntitlementDataRecord,
  buildPurchaseRecord,
  hashForAudit,
  purchaseRecordId,
} = require('./purchaseEntitlementRecords');

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
  'com.risewiththetribe.pack.beginner_consistency': {
    platformTypes: ['ios', 'android'],
    entitlement: 'paidChallengePacks',
    kind: 'challengePack',
    packId: 'beginner_consistency',
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

  const configReadiness = classifyRequiredConfig(validationConfig?.requiredKeys || [], env);
  const missingConfigKeys = configReadiness.notReadyConfigKeys;
  const validationConfigured = missingConfigKeys.length === 0;

  return {
    validationConfig,
    missingConfigKeys,
    missingConfigKeysOnly: configReadiness.missingConfigKeys,
    placeholderConfigKeys: configReadiness.placeholderConfigKeys,
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

function buildEntitlementData(args) {
  return buildEntitlementDataRecord({
    ...args,
    validationConfigByPlatform: VALIDATION_CONFIG,
  });
}

function missingRequiredConfig(keys, env = process.env) {
  return classifyRequiredConfig(keys, env).notReadyConfigKeys;
}

function classifyRequiredConfig(keys, env = process.env) {
  const missingConfigKeys = [];
  const placeholderConfigKeys = [];

  keys.forEach((key) => {
    if (!env[key]) {
      missingConfigKeys.push(key);
    } else if (isPlaceholderConfigValue(env[key])) {
      placeholderConfigKeys.push(key);
    }
  });

  return {
    missingConfigKeys,
    placeholderConfigKeys,
    notReadyConfigKeys: [...missingConfigKeys, ...placeholderConfigKeys],
  };
}

function isPlaceholderConfigValue(value) {
  const normalized = String(value).trim();
  return [
    '00000000-0000-0000-0000-000000000000',
    'ABC123DEFG',
    'REPLACE_WITH_APP_STORE_CONNECT_PRIVATE_KEY',
    'REPLACE_WITH_PLAY_SERVICE_ACCOUNT_PRIVATE_KEY',
    'replace-me',
    'play-validation@example.iam.gserviceaccount.com',
  ].some((placeholder) => normalized.includes(placeholder));
}

module.exports = {
  PRODUCT_CATALOG,
  VALIDATION_CONFIG,
  buildEntitlementData,
  buildPurchaseRecord,
  classifyRequiredConfig,
  getValidationReadiness,
  hashForAudit,
  isPlaceholderConfigValue,
  missingRequiredConfig,
  purchaseRecordId,
};
