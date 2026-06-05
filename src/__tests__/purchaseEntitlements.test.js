const {
  PRODUCT_CATALOG,
  buildEntitlementData,
  buildPurchaseRecord,
  getValidationReadiness,
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
    const productId = 'com.risewiththetribe.pack.summer_shred';
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
          summer_shred: {
            active: true,
            source: 'play_billing',
            productId,
            transactionId: 'order_456',
            updatedAt: now,
            packId: 'summer_shred',
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

  it('reports validation readiness without granting entitlements when credentials are missing', () => {
    const readiness = getValidationReadiness('ios', {});

    expect(readiness.validationConfigured).toBe(false);
    expect(readiness.status).toBe('validation_not_configured');
    expect(readiness.missingConfigKeys).toEqual([
      'APP_STORE_ISSUER_ID',
      'APP_STORE_KEY_ID',
      'APP_STORE_PRIVATE_KEY',
      'APP_STORE_BUNDLE_ID',
    ]);
  });

  it('reports App Store validation as provider-ready when all credentials are configured', () => {
    const readiness = getValidationReadiness('ios', {
      APP_STORE_ISSUER_ID: 'issuer-id',
      APP_STORE_KEY_ID: 'key-id',
      APP_STORE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----',
      APP_STORE_BUNDLE_ID: 'com.risewiththetribe.challengetracker',
    });

    expect(readiness.validationConfigured).toBe(true);
    expect(readiness.status).toBe('validation_configured');
    expect(readiness.missingConfigKeys).toEqual([]);
    expect(readiness.message).toContain('ready to call the provider');
    expect(readiness.nextAction).toContain('sandbox/license-test purchases');
  });

  it('reports Play validation as provider-ready when all credentials are configured', () => {
    const readiness = getValidationReadiness('android', {
      PLAY_DEVELOPER_SERVICE_ACCOUNT_JSON: '{"client_email":"service@example.com","private_key":"key"}',
      PLAY_PACKAGE_NAME: 'com.risewiththetribe.challengetracker',
    });

    expect(readiness.validationConfigured).toBe(true);
    expect(readiness.status).toBe('validation_configured');
    expect(readiness.missingConfigKeys).toEqual([]);
    expect(readiness.requiredKeys).toBeUndefined();
    expect(readiness.nextAction).toContain('verifyPurchase');
  });

  it('rejects unsupported validation readiness platforms', () => {
    const readiness = getValidationReadiness('web', {});

    expect(readiness.validationConfigured).toBe(false);
    expect(readiness.status).toBe('unsupported_platform');
    expect(readiness.nextAction).toContain('ios or android');
  });
});
