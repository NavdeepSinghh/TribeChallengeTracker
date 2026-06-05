const {
  decodeJwtPayload,
  normalizeGoogleProduct,
  normalizeGoogleSubscription,
} = require('../../functions/storeValidation');

describe('store validation response normalization', () => {
  it('accepts active Google Play subscriptions with a matching product line', () => {
    const result = normalizeGoogleSubscription({
      subscriptionState: 'SUBSCRIPTION_STATE_ACTIVE',
      lineItems: [
        { productId: 'com.risewiththetribe.pro.monthly', expiryTime: '2026-07-04T00:00:00Z' },
      ],
    }, 'com.risewiththetribe.pro.monthly');

    expect(result).toEqual({
      verified: true,
      status: 'verified',
      message: 'Google Play subscription verified.',
      expiresAt: '2026-07-04T00:00:00Z',
      rawStatus: 'SUBSCRIPTION_STATE_ACTIVE',
    });
  });

  it('rejects inactive Google Play subscriptions', () => {
    const result = normalizeGoogleSubscription({
      subscriptionState: 'SUBSCRIPTION_STATE_CANCELED',
      lineItems: [
        { productId: 'com.risewiththetribe.pro.monthly' },
      ],
    }, 'com.risewiththetribe.pro.monthly');

    expect(result.verified).toBe(false);
    expect(result.status).toBe('subscription_not_active');
  });

  it('accepts purchased Google Play one-time products with matching product line', () => {
    const result = normalizeGoogleProduct({
      purchaseStateContext: { purchaseState: 'PURCHASED' },
      productLineItem: [
        { productId: 'com.risewiththetribe.pack.summer_shred' },
      ],
    }, 'com.risewiththetribe.pack.summer_shred');

    expect(result).toEqual({
      verified: true,
      status: 'verified',
      message: 'Google Play product purchase verified.',
      rawStatus: 'PURCHASED',
    });
  });

  it('decodes StoreKit signed transaction payloads for product checks', () => {
    const payload = Buffer.from(JSON.stringify({
      transactionId: '1001',
      productId: 'com.risewiththetribe.pro.yearly',
      bundleId: 'com.risewiththetribe.challengetracker',
    })).toString('base64url');

    expect(decodeJwtPayload(`header.${payload}.signature`)).toEqual({
      transactionId: '1001',
      productId: 'com.risewiththetribe.pro.yearly',
      bundleId: 'com.risewiththetribe.challengetracker',
    });
  });
});
