const {
  PRODUCT_CATALOG,
  VALIDATION_CONFIG,
  getValidationReadiness,
} = require('../functions/purchaseEntitlements');

const strict = process.argv.includes('--strict');
const json = process.argv.includes('--json');
const platforms = ['ios', 'android'];
const evidenceCases = [
  { platform: 'ios', productId: 'com.risewiththetribe.pro.monthly', testCase: 'sandbox_purchase', requiredResult: 'verified' },
  { platform: 'ios', productId: 'com.risewiththetribe.pro.monthly', testCase: 'restore_sync', requiredResult: 'verified' },
  { platform: 'ios', productId: 'com.risewiththetribe.pack.21_day_reset', testCase: 'sandbox_purchase', requiredResult: 'verified' },
  { platform: 'ios', productId: 'com.risewiththetribe.pack.summer_shred', testCase: 'sandbox_purchase', requiredResult: 'verified' },
  { platform: 'ios', productId: 'any configured product', testCase: 'negative_validation_or_wrong_account', requiredResult: 'safe denial verified' },
  { platform: 'android', productId: 'com.risewiththetribe.pro.monthly', testCase: 'sandbox_purchase', requiredResult: 'verified' },
  { platform: 'android', productId: 'com.risewiththetribe.pro.monthly', testCase: 'restore_sync', requiredResult: 'verified' },
  { platform: 'android', productId: 'com.risewiththetribe.pack.21_day_reset', testCase: 'sandbox_purchase', requiredResult: 'verified' },
  { platform: 'android', productId: 'com.risewiththetribe.pack.summer_shred', testCase: 'sandbox_purchase', requiredResult: 'verified' },
  { platform: 'android', productId: 'any configured product', testCase: 'negative_validation_or_wrong_account', requiredResult: 'safe denial verified' },
];

const readiness = platforms.map((platform) => {
  const status = getValidationReadiness(platform);
  return {
    platform,
    credentialLabel: VALIDATION_CONFIG[platform].credentialLabel,
    validationConfigured: status.validationConfigured,
    status: status.status,
    missingConfigKeys: status.missingConfigKeys,
    missingConfigKeysOnly: status.missingConfigKeysOnly,
    placeholderConfigKeys: status.placeholderConfigKeys,
    requiredConfigKeys: status.validationConfig.requiredKeys,
    nextAction: status.nextAction,
  };
});

const missingCredentialCount = readiness.reduce((sum, platform) => sum + platform.missingConfigKeys.length, 0);
const launchReady = missingCredentialCount === 0;
const products = Object.entries(PRODUCT_CATALOG).map(([productId, product]) => ({
  productId,
  kind: product.kind,
  platformTypes: product.platformTypes,
  entitlement: product.entitlement,
  cadence: product.cadence || '',
  packId: product.packId || '',
}));
const result = {
  launchReady,
  credentialReady: launchReady,
  status: launchReady ? 'credentials_configured' : 'credentials_missing_or_placeholder',
  readiness,
  products,
  requiredEvidence: evidenceCases,
  decision: launchReady
    ? 'Credential readiness is configured. Paid launch still requires the external evidence matrix to be recorded in the admin Store Test Purchase Evidence Log.'
    : 'Not ready for paid launch review. Configure missing store validation credentials, then run sandbox/license-test purchases and record evidence outside source control.',
};

if (json) {
  console.log(JSON.stringify(result, null, 2));
  if (strict && !launchReady) {
    process.exit(1);
  }
  process.exit(0);
}

console.log('Store launch readiness');
console.log('======================');
readiness.forEach((platform) => {
  console.log(`\n${platform.platform.toUpperCase()}: ${platform.status}`);
  console.log(`Credential set: ${platform.credentialLabel}`);
  if (platform.validationConfigured) {
    console.log('Missing config keys: none');
    console.log('Placeholder config keys: none');
  } else {
    console.log(`Missing config keys: ${platform.missingConfigKeysOnly.join(', ') || 'none'}`);
    console.log(`Placeholder config keys: ${platform.placeholderConfigKeys.join(', ') || 'none'}`);
    console.log(`Missing or placeholder config keys: ${platform.missingConfigKeys.join(', ')}`);
  }
  console.log(`Next action: ${platform.nextAction}`);
});

console.log('\nConfigured product IDs');
console.log('----------------------');
products.forEach((product) => {
  const platforms = product.platformTypes.join(', ');
  const detail = product.packId ? ` pack=${product.packId}` : ` cadence=${product.cadence}`;
  console.log(`- ${product.productId} (${product.kind}; ${platforms}; entitlement=${product.entitlement}${detail})`);
});

console.log('\nRequired external evidence');
console.log('--------------------------');
evidenceCases.forEach((item) => {
  console.log(`- ${item.platform}: ${item.productId} / ${item.testCase} -> ${item.requiredResult}`);
});

console.log('\nDecision');
console.log('--------');
if (launchReady) {
  console.log(result.decision);
} else {
  console.log(result.decision);
}

if (strict && !launchReady) {
  process.exit(1);
}
