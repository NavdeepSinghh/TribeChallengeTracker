const { PRODUCT_CATALOG } = require('../functions/purchaseEntitlements');

function buildStoreTestEvidenceMatrix(productCatalog = PRODUCT_CATALOG) {
  const products = Object.entries(productCatalog);
  const monthlySubscription = products.find(([, product]) => (
    product.kind === 'subscription' && product.cadence === 'monthly'
  ));
  const challengePacks = products.filter(([, product]) => product.kind === 'challengePack');

  return ['ios', 'android'].flatMap((platform) => {
    const platformCases = [];
    if (monthlySubscription) {
      const [productId] = monthlySubscription;
      platformCases.push(
        { platform, productId, testCase: 'sandbox_purchase', acceptedResults: ['verified'] },
        { platform, productId, testCase: 'restore_sync', acceptedResults: ['verified'] },
      );
    }
    challengePacks.forEach(([productId]) => {
      platformCases.push({ platform, productId, testCase: 'sandbox_purchase', acceptedResults: ['verified'] });
    });
    platformCases.push({
      platform,
      productId: 'any configured product',
      testCase: 'negative_validation_or_wrong_account',
      acceptedResults: ['failed', 'verified_safe_denial'],
    });
    return platformCases;
  });
}

const STORE_TEST_EVIDENCE_MATRIX = buildStoreTestEvidenceMatrix();

function formatAcceptedResults(acceptedResults) {
  return acceptedResults.join(' or ');
}

function evidenceMatrixForReadiness() {
  return STORE_TEST_EVIDENCE_MATRIX.map((item) => ({
    ...item,
    requiredResult: formatAcceptedResults(item.acceptedResults),
    safeDenialRequired: item.acceptedResults.includes('verified_safe_denial'),
  }));
}

module.exports = {
  STORE_TEST_EVIDENCE_MATRIX,
  buildStoreTestEvidenceMatrix,
  evidenceMatrixForReadiness,
  formatAcceptedResults,
};
