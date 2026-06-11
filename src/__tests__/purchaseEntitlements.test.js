const {
  PRODUCT_CATALOG,
  buildEntitlementData,
  buildPurchaseRecord,
  hashForAudit,
  purchaseRecordId,
} = require('../../functions/purchaseEntitlements');

describe('purchase entitlement backend contract', () => {
  const now = 'SERVER_TIME';

  it('maps Pro subscription purchases to the shared pro entitlement path', () => {
    const productId = 'com.risewiththetribe.pro.monthly';
    const data = buildEntitlementData({
      product: PRODUCT_CATALOG[productId],
      productId,
      platform: 'ios',
      transactionId: 'txn_123',
      validationResult: { expiresAt: '2026-07-04T00:00:00Z' },
      now,
    });

    expect(data).toEqual({
      entitlements: {
        pro: {
          active: true,
          source: 'app_store',
          productId,
          transactionId: 'txn_123',
          updatedAt: now,
          expiresAt: '2026-07-04T00:00:00Z',
          cadence: 'monthly',
        },
      },
    });
  });

  it('maps paid challenge pack purchases to the specific pack entitlement path', () => {
    const productId = 'com.risewiththetribe.pack.comeback_14';
    const data = buildEntitlementData({
      product: PRODUCT_CATALOG[productId],
      productId,
      platform: 'android',
      transactionId: 'order_456',
      validationResult: {},
      now,
    });

    expect(data).toEqual({
      entitlements: {
        packs: {
          comeback_14: {
            active: true,
            source: 'play_billing',
            productId,
            transactionId: 'order_456',
            updatedAt: now,
            packId: 'comeback_14',
          },
        },
      },
    });
  });

  it('keeps raw purchase tokens out of backend audit records', () => {
    const productId = 'com.risewiththetribe.pack.21_day_reset';
    const record = buildPurchaseRecord({
      uid: 'user_1',
      platform: 'android',
      product: PRODUCT_CATALOG[productId],
      productId,
      transactionId: 'order_789',
      purchaseToken: 'raw-secret-token',
      environment: 'production',
      status: 'verified',
      validationConfigured: true,
      now,
    });

    expect(record.purchaseTokenHash).toBe(hashForAudit('raw-secret-token'));
    expect(JSON.stringify(record)).not.toContain('raw-secret-token');
    expect(purchaseRecordId({ platform: 'android', productId, purchaseToken: 'raw-secret-token' })).toContain('android_');
  });

});
