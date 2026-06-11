import { STORE_PRODUCTS } from '../proFeatures.js';

const STORE_TEST_PLATFORMS = ['ios', 'android'];
const STORE_TEST_EVIDENCE_ID_OVERRIDES = {
  'com.risewiththetribe.pack.21_day_reset': 'reset',
  'com.risewiththetribe.pack.summer_shred': 'summer',
  'com.risewiththetribe.pack.beginner_consistency': 'beginner',
  'com.risewiththetribe.pack.discipline_30': 'discipline',
  'com.risewiththetribe.pack.tribe_mode_75': 'tribe_mode',
  'com.risewiththetribe.pack.comeback_14': 'comeback_14',
  'com.risewiththetribe.pack.event_prep_21': 'event_prep_21',
};
const STORE_TEST_PACK_TITLE_OVERRIDES = {
  '21_day_reset': '21-Day Reset Pack',
  summer_shred: '28-Day Summer Shred',
  beginner_consistency: 'Beginner Consistency Plan',
  discipline_30: '30-Day Discipline Challenge',
  tribe_mode_75: '75-Day Tribe Mode',
  comeback_14: '14-Day Comeback Sprint',
  event_prep_21: '21-Day Event Prep Pack',
};

function normalizeStoreProducts(productCatalog = STORE_PRODUCTS) {
  const products = Array.isArray(productCatalog)
    ? productCatalog
    : Object.entries(productCatalog).map(([productId, product]) => ({
      id: product.id || productId,
      ...product,
    }));
  return products.filter(product => product?.id);
}

function labelForEvidenceCase({ platform, product, testCase }) {
  const platformLabel = platform === 'android' ? 'Android' : 'iOS';
  if (testCase === 'restore_sync') return `${platformLabel} Pro restore sync`;
  if (product.kind === 'subscription') return `${platformLabel} Pro sandbox purchase`;
  const packTitle = STORE_TEST_PACK_TITLE_OVERRIDES[product.packId] || product.packId || product.id;
  return `${platformLabel} ${packTitle} sandbox purchase`;
}

function evidenceIdForProduct(platform, product, testCase) {
  if (product.kind === 'subscription') {
    return testCase === 'restore_sync' ? `${platform}_pro_restore` : `${platform}_pro_purchase`;
  }
  const productKey = STORE_TEST_EVIDENCE_ID_OVERRIDES[product.id] || product.packId || product.id;
  return `${platform}_${productKey}_purchase`;
}

function evidenceCaseForProduct(platform, product, testCase) {
  return {
    id: evidenceIdForProduct(platform, product, testCase),
    platform,
    productId: product.id,
    productKind: product.kind,
    testCase,
    label: labelForEvidenceCase({ platform, product, testCase }),
    acceptedResults: ['verified'],
  };
}

export function buildStoreTestEvidenceMatrix(productCatalog = STORE_PRODUCTS) {
  const products = normalizeStoreProducts(productCatalog);
  const monthlySubscription = products.find(product => (
    product.kind === 'subscription' && product.cadence === 'monthly'
  ));
  const challengePacks = products.filter(product => product.kind === 'challengePack');

  return STORE_TEST_PLATFORMS.flatMap((platform) => {
    const platformCases = [];
    if (monthlySubscription) {
      platformCases.push(
        evidenceCaseForProduct(platform, monthlySubscription, 'sandbox_purchase'),
        evidenceCaseForProduct(platform, monthlySubscription, 'restore_sync'),
      );
    }
    challengePacks.forEach((product) => {
      platformCases.push(evidenceCaseForProduct(platform, product, 'sandbox_purchase'));
    });
    platformCases.push({
      id: `${platform}_safe_denial`,
      platform,
      productId: 'any configured product',
      productKind: 'any',
      testCase: 'negative_validation_or_wrong_account',
      label: `${platform === 'android' ? 'Android' : 'iOS'} negative validation or wrong-account safe denial`,
      acceptedResults: ['failed', 'verified_safe_denial'],
      safeDenialRequired: true,
    });
    return platformCases;
  });
}

export function formatAcceptedResults(acceptedResults) {
  return acceptedResults.join(' or ');
}

export function evidenceMatrixForReadiness(productCatalog = STORE_PRODUCTS) {
  return buildStoreTestEvidenceMatrix(productCatalog).map(item => ({
    ...item,
    requiredResult: formatAcceptedResults(item.acceptedResults),
    safeDenialRequired: Boolean(item.safeDenialRequired || item.acceptedResults.includes('verified_safe_denial')),
  }));
}

export const STORE_TEST_EVIDENCE_MATRIX = buildStoreTestEvidenceMatrix();
