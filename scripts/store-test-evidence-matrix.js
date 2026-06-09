const STORE_TEST_EVIDENCE_MATRIX = [
  { platform: 'ios', productId: 'com.risewiththetribe.pro.monthly', testCase: 'sandbox_purchase', acceptedResults: ['verified'] },
  { platform: 'ios', productId: 'com.risewiththetribe.pro.monthly', testCase: 'restore_sync', acceptedResults: ['verified'] },
  { platform: 'ios', productId: 'com.risewiththetribe.pack.21_day_reset', testCase: 'sandbox_purchase', acceptedResults: ['verified'] },
  { platform: 'ios', productId: 'com.risewiththetribe.pack.summer_shred', testCase: 'sandbox_purchase', acceptedResults: ['verified'] },
  { platform: 'ios', productId: 'any configured product', testCase: 'negative_validation_or_wrong_account', acceptedResults: ['failed', 'verified_safe_denial'] },
  { platform: 'android', productId: 'com.risewiththetribe.pro.monthly', testCase: 'sandbox_purchase', acceptedResults: ['verified'] },
  { platform: 'android', productId: 'com.risewiththetribe.pro.monthly', testCase: 'restore_sync', acceptedResults: ['verified'] },
  { platform: 'android', productId: 'com.risewiththetribe.pack.21_day_reset', testCase: 'sandbox_purchase', acceptedResults: ['verified'] },
  { platform: 'android', productId: 'com.risewiththetribe.pack.summer_shred', testCase: 'sandbox_purchase', acceptedResults: ['verified'] },
  { platform: 'android', productId: 'any configured product', testCase: 'negative_validation_or_wrong_account', acceptedResults: ['failed', 'verified_safe_denial'] },
];

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
  evidenceMatrixForReadiness,
  formatAcceptedResults,
};
