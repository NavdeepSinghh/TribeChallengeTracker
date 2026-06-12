const {
  PRODUCT_CATALOG,
  VALIDATION_CONFIG,
  getValidationReadiness,
} = require('../functions/purchaseEntitlements');
const { evidenceMatrixForReadiness } = require('./store-test-evidence-matrix');
const fs = require('fs');
const path = require('path');

const strict = process.argv.includes('--strict');
const json = process.argv.includes('--json');
const evidenceLogArgIndex = process.argv.indexOf('--evidence-log');
const evidenceLogPath = evidenceLogArgIndex >= 0 ? process.argv[evidenceLogArgIndex + 1] : '';
const platforms = ['ios', 'android'];
const evidenceCases = evidenceMatrixForReadiness();

function evidenceNoteText(item) {
  return `${item.evidenceNote || ''} ${item.reviewNote || ''}`.toLowerCase();
}

function isSafeDenialEvidence(item) {
  const testCase = item.testCase === 'negative_validation_or_wrong_account' ? 'negative_validation' : item.testCase;
  if (!['negative_validation', 'wrong_account'].includes(testCase)) return false;
  if (item.result === 'failed' || item.result === 'verified_safe_denial') return true;
  if (item.result !== 'verified') return false;
  const note = evidenceNoteText(item);
  return note.includes('entitlement') && (
    note.includes('no pro') ||
    note.includes('no pack') ||
    note.includes('no access') ||
    note.includes('no unlock') ||
    note.includes('did not unlock')
  );
}

function normalizeEvidenceLog(raw) {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.storeTestEvidenceLog)) return raw.storeTestEvidenceLog;
  if (Array.isArray(raw?.storeTestPurchaseEvidenceLog)) return raw.storeTestPurchaseEvidenceLog;
  if (Array.isArray(raw?.evidence)) return raw.evidence;
  return [];
}

function readEvidenceLog(filePath) {
  if (!filePath) return null;
  const resolvedPath = path.resolve(filePath);
  const parsed = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
  return {
    path: resolvedPath,
    records: normalizeEvidenceLog(parsed),
  };
}

function evidenceMatchesCase(item, required) {
  if (item.platform !== required.platform) return false;
  if (required.safeDenialRequired) return isSafeDenialEvidence(item);
  return item.productId === required.productId &&
    item.testCase === required.testCase &&
    required.acceptedResults.includes(item.result);
}

function summarizeEvidenceLog(evidenceLog) {
  if (!evidenceLog) {
    return {
      provided: false,
      ready: false,
      recordCount: 0,
      verifiedCaseCount: 0,
      requiredCaseCount: evidenceCases.length,
      missingRequiredCases: evidenceCases.map(item => item.id),
      missingSafeDenialPlatforms: evidenceCases.filter(item => item.safeDenialRequired).map(item => item.platform),
      sourcePath: '',
    };
  }
  const missingCases = evidenceCases.filter(required => (
    !evidenceLog.records.some(item => evidenceMatchesCase(item, required))
  ));
  return {
    provided: true,
    ready: missingCases.length === 0,
    recordCount: evidenceLog.records.length,
    verifiedCaseCount: evidenceCases.length - missingCases.length,
    requiredCaseCount: evidenceCases.length,
    missingRequiredCases: missingCases.map(item => item.id),
    missingSafeDenialPlatforms: missingCases.filter(item => item.safeDenialRequired).map(item => item.platform),
    sourcePath: evidenceLog.path,
  };
}

if (evidenceLogArgIndex >= 0 && !evidenceLogPath) {
  throw new Error('--evidence-log requires a JSON file path');
}

const evidenceLog = readEvidenceLog(evidenceLogPath);
const evidenceStatus = summarizeEvidenceLog(evidenceLog);

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
  launchReady: launchReady && (!evidenceStatus.provided || evidenceStatus.ready),
  credentialReady: launchReady,
  evidenceReady: evidenceStatus.provided ? evidenceStatus.ready : false,
  status: launchReady ? 'credentials_configured' : 'credentials_missing_or_placeholder',
  readiness,
  products,
  requiredEvidence: evidenceCases,
  evidenceStatus,
  decision: launchReady
    ? (evidenceStatus.provided && evidenceStatus.ready
      ? 'Credential readiness is configured and the supplied evidence log satisfies the minimum evidence matrix. Paid access still requires final human launch review before promotion.'
      : 'Credential readiness is configured. Paid launch still requires the external evidence matrix to be recorded in the admin Store Test Purchase Evidence Log.')
    : 'Not ready for paid launch review. Configure missing store validation credentials, then run sandbox/license-test purchases and record evidence outside source control.',
};

if (json) {
  console.log(JSON.stringify(result, null, 2));
  if (strict && !result.launchReady) {
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
  const safeDenial = item.safeDenialRequired ? ' (safe denial note required)' : '';
  console.log(`- ${item.platform}: ${item.productId} / ${item.testCase} -> ${item.requiredResult}${safeDenial}`);
});

console.log('\nEvidence log audit');
console.log('------------------');
if (!evidenceStatus.provided) {
  console.log('No evidence log supplied. Use --evidence-log path/to/sanitized-store-evidence.json after exporting reviewed admin evidence.');
} else {
  console.log(`Evidence log: ${evidenceStatus.sourcePath}`);
  console.log(`Records checked: ${evidenceStatus.recordCount}`);
  console.log(`Minimum evidence matrix: ${evidenceStatus.verifiedCaseCount}/${evidenceStatus.requiredCaseCount} required proof items verified`);
  console.log(`Missing required cases: ${evidenceStatus.missingRequiredCases.join(', ') || 'none'}`);
  console.log(`Missing safe-denial platforms: ${evidenceStatus.missingSafeDenialPlatforms.join(', ') || 'none'}`);
}

console.log('\nDecision');
console.log('--------');
if (launchReady) {
  console.log(result.decision);
} else {
  console.log(result.decision);
}

if (strict && !result.launchReady) {
  process.exit(1);
}
