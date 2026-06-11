import { STORE_TEST_EVIDENCE_MATRIX } from './storeTestEvidenceMatrix';

const MINIMUM_STORE_TEST_EVIDENCE_CASES = STORE_TEST_EVIDENCE_MATRIX.filter(test => !test.safeDenialRequired);
const MINIMUM_SAFE_DENIAL_PLATFORMS = STORE_TEST_EVIDENCE_MATRIX
  .filter(test => test.safeDenialRequired)
  .map(test => test.platform);

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
  const safeDenialPlatforms = MINIMUM_SAFE_DENIAL_PLATFORMS.filter(platform => storeTestEvidenceLog.some(item => (
    item.platform === platform && isSafeDenialEvidence(item)
  )));
  const missingSafeDenialPlatforms = MINIMUM_SAFE_DENIAL_PLATFORMS.filter(platform => !safeDenialPlatforms.includes(platform));

  return {
    ready: missingRequiredCases.length === 0 && missingSafeDenialPlatforms.length === 0,
    missingRequiredCases,
    missingSafeDenialPlatforms,
    requiredCaseCount: MINIMUM_STORE_TEST_EVIDENCE_CASES.length + MINIMUM_SAFE_DENIAL_PLATFORMS.length,
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
