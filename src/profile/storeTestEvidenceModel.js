const MINIMUM_STORE_TEST_EVIDENCE_CASES = [
  { id: 'ios_pro_purchase', platform: 'ios', productId: 'com.risewiththetribe.pro.monthly', testCase: 'sandbox_purchase' },
  { id: 'ios_pro_restore', platform: 'ios', productId: 'com.risewiththetribe.pro.monthly', testCase: 'restore_sync' },
  { id: 'ios_reset_purchase', platform: 'ios', productId: 'com.risewiththetribe.pack.21_day_reset', testCase: 'sandbox_purchase' },
  { id: 'ios_summer_purchase', platform: 'ios', productId: 'com.risewiththetribe.pack.summer_shred', testCase: 'sandbox_purchase' },
  { id: 'ios_beginner_purchase', platform: 'ios', productId: 'com.risewiththetribe.pack.beginner_consistency', testCase: 'sandbox_purchase' },
  { id: 'ios_discipline_purchase', platform: 'ios', productId: 'com.risewiththetribe.pack.discipline_30', testCase: 'sandbox_purchase' },
  { id: 'android_pro_purchase', platform: 'android', productId: 'com.risewiththetribe.pro.monthly', testCase: 'sandbox_purchase' },
  { id: 'android_pro_restore', platform: 'android', productId: 'com.risewiththetribe.pro.monthly', testCase: 'restore_sync' },
  { id: 'android_reset_purchase', platform: 'android', productId: 'com.risewiththetribe.pack.21_day_reset', testCase: 'sandbox_purchase' },
  { id: 'android_summer_purchase', platform: 'android', productId: 'com.risewiththetribe.pack.summer_shred', testCase: 'sandbox_purchase' },
  { id: 'android_beginner_purchase', platform: 'android', productId: 'com.risewiththetribe.pack.beginner_consistency', testCase: 'sandbox_purchase' },
  { id: 'android_discipline_purchase', platform: 'android', productId: 'com.risewiththetribe.pack.discipline_30', testCase: 'sandbox_purchase' },
];

function evidenceNoteText(item) {
  return `${item.evidenceNote || ''} ${item.reviewNote || ''}`.toLowerCase();
}

function isVerifiedPurchaseEvidence(item) {
  return item.result === 'verified';
}

function isSafeDenialEvidence(item) {
  if (!['negative_validation', 'wrong_account'].includes(item.testCase)) return false;
  if (item.result === 'failed') return true;
  if (item.result === 'verified_safe_denial') return true;
  if (item.result !== 'verified') return false;
  const note = evidenceNoteText(item);
  return note.includes('entitlement') && (
    note.includes('no pro') || note.includes('no pack') || note.includes('no access') || note.includes('no unlock') || note.includes('did not unlock')
  );
}

export function getMinimumStoreTestEvidenceStatus(storeTestEvidenceLog = []) {
  const missingRequiredCases = MINIMUM_STORE_TEST_EVIDENCE_CASES
    .filter(required => !storeTestEvidenceLog.some(item => (
      item.platform === required.platform
      && item.productId === required.productId
      && item.testCase === required.testCase
      && isVerifiedPurchaseEvidence(item)
    )))
    .map(required => required.id);
  const safeDenialPlatforms = ['ios', 'android'].filter(platform => storeTestEvidenceLog.some(item => (
    item.platform === platform && isSafeDenialEvidence(item)
  )));
  const missingSafeDenialPlatforms = ['ios', 'android'].filter(platform => !safeDenialPlatforms.includes(platform));

  return {
    ready: missingRequiredCases.length === 0 && missingSafeDenialPlatforms.length === 0,
    missingRequiredCases,
    missingSafeDenialPlatforms,
    requiredCaseCount: MINIMUM_STORE_TEST_EVIDENCE_CASES.length + 2,
    verifiedCaseCount: MINIMUM_STORE_TEST_EVIDENCE_CASES.length - missingRequiredCases.length + safeDenialPlatforms.length,
  };
}

export function summarizeStoreTestEvidence(storeTestEvidenceLog) {
  const minimumEvidence = getMinimumStoreTestEvidenceStatus(storeTestEvidenceLog);
  return storeTestEvidenceLog.reduce((summary, item) => {
    const platform = item.platform === 'android' ? 'android' : 'ios';
    const result = ['verified', 'verified_safe_denial', 'passed', 'failed', 'needs_review'].includes(item.result) ? item.result : 'needs_review';
    const safeDenial = isSafeDenialEvidence(item);
    summary.total += 1;
    summary[platform] += 1;
    summary[result] += 1;
    if (safeDenial) summary.safe_denial += 1;
    if (result === 'failed' && !safeDenial) summary.unresolved_failed += 1;
    return summary;
  }, {
    total: 0,
    ios: 0,
    android: 0,
    verified: 0,
    verified_safe_denial: 0,
    passed: 0,
    needs_review: 0,
    failed: 0,
    safe_denial: 0,
    unresolved_failed: 0,
    minimumEvidence,
  });
}
