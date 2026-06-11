import {
  getMinimumStoreTestEvidenceStatus,
  summarizeStoreTestEvidence,
} from '../profile/monetizationModel';
import { STORE_TEST_EVIDENCE_MATRIX } from '../profile/storeTestEvidenceMatrix';

const verifiedPurchaseEvidence = STORE_TEST_EVIDENCE_MATRIX
  .filter(test => !test.safeDenialRequired)
  .map(test => ({
    platform: test.platform,
    productId: test.productId,
    testCase: test.testCase,
    result: 'verified',
  }));

describe('monetization launch evidence model', () => {
  it('blocks paid launch evidence readiness when the minimum matrix is incomplete', () => {
    const status = getMinimumStoreTestEvidenceStatus([
      { platform: 'ios', productId: 'com.risewiththetribe.pro.monthly', testCase: 'sandbox_purchase', result: 'verified' },
      { platform: 'android', productId: 'com.risewiththetribe.pro.monthly', testCase: 'sandbox_purchase', result: 'verified' },
    ]);

    expect(status.ready).toBe(false);
    expect(status.missingRequiredCases).toContain('ios_pro_restore');
    expect(status.missingRequiredCases).toContain('android_summer_purchase');
    expect(status.missingSafeDenialPlatforms).toEqual(['ios', 'android']);
  });

  it('derives the minimum proof matrix from shared store evidence cases', () => {
    const purchaseEvidenceCases = STORE_TEST_EVIDENCE_MATRIX.filter(test => !test.safeDenialRequired);
    const safeDenialCases = STORE_TEST_EVIDENCE_MATRIX.filter(test => test.safeDenialRequired);

    expect(purchaseEvidenceCases).toHaveLength(18);
    expect(safeDenialCases.map(test => test.platform)).toEqual(['ios', 'android']);
    expect(purchaseEvidenceCases.map(test => test.id)).toEqual(
      expect.arrayContaining([
        'ios_pro_restore',
        'ios_event_prep_21_purchase',
        'android_summer_purchase',
      ])
    );
  });

  it('accepts complete verified purchase evidence plus safe-denial negative evidence', () => {
    const log = [
      ...verifiedPurchaseEvidence,
      {
        platform: 'ios',
        productId: 'com.risewiththetribe.pro.monthly',
        testCase: 'wrong_account',
        result: 'verified_safe_denial',
        reviewNote: 'Checked entitlements.pro and pack entitlement paths; did not unlock any Pro or pack access.',
      },
      {
        platform: 'android',
        productId: 'com.risewiththetribe.pack.summer_shred',
        testCase: 'negative_validation',
        result: 'failed',
        evidenceNote: 'Invalid token denied; entitlement paths checked and no unlock occurred.',
      },
    ];

    const status = getMinimumStoreTestEvidenceStatus(log);
    const summary = summarizeStoreTestEvidence(log);

    expect(status.ready).toBe(true);
    expect(status.verifiedCaseCount).toBe(20);
    expect(summary.minimumEvidence.ready).toBe(true);
    expect(summary.verified).toBe(18);
    expect(summary.verified_safe_denial).toBe(1);
    expect(summary.failed).toBe(1);
    expect(summary.safe_denial).toBe(2);
  });

  it('does not accept a verified negative record unless it documents safe denial', () => {
    const status = getMinimumStoreTestEvidenceStatus([
      ...verifiedPurchaseEvidence,
      {
        platform: 'ios',
        productId: 'com.risewiththetribe.pro.monthly',
        testCase: 'wrong_account',
        result: 'verified',
        reviewNote: 'Wrong account scenario reviewed.',
      },
      {
        platform: 'android',
        productId: 'com.risewiththetribe.pack.summer_shred',
        testCase: 'negative_validation',
        result: 'verified',
        reviewNote: 'Negative case reviewed.',
      },
    ]);

    expect(status.ready).toBe(false);
    expect(status.missingSafeDenialPlatforms).toEqual(['ios', 'android']);
  });
});
