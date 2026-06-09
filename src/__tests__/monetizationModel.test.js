import {
  getMinimumStoreTestEvidenceStatus,
  summarizeStoreTestEvidence,
} from '../profile/monetizationModel';

const verifiedPurchaseEvidence = [
  ['ios', 'com.risewiththetribe.pro.monthly', 'sandbox_purchase'],
  ['ios', 'com.risewiththetribe.pro.monthly', 'restore_sync'],
  ['ios', 'com.risewiththetribe.pack.21_day_reset', 'sandbox_purchase'],
  ['ios', 'com.risewiththetribe.pack.summer_shred', 'sandbox_purchase'],
  ['android', 'com.risewiththetribe.pro.monthly', 'sandbox_purchase'],
  ['android', 'com.risewiththetribe.pro.monthly', 'restore_sync'],
  ['android', 'com.risewiththetribe.pack.21_day_reset', 'sandbox_purchase'],
  ['android', 'com.risewiththetribe.pack.summer_shred', 'sandbox_purchase'],
].map(([platform, productId, testCase]) => ({
  platform,
  productId,
  testCase,
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
    expect(status.verifiedCaseCount).toBe(10);
    expect(summary.minimumEvidence.ready).toBe(true);
    expect(summary.verified).toBe(8);
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
