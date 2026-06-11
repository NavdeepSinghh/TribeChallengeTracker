const { verifyStoreProductParity } = require('../../scripts/verify-store-product-parity');

// storeProductParity.test.js is required by the store-readiness release contract.
describe('store product parity verifier', () => {
  it('keeps backend, web, iOS, Android, and Play Billing product catalogs aligned', () => {
    const result = verifyStoreProductParity();

    expect(result.ok).toBe(true);
    expect(result.failures).toEqual([]);
    expect(result.productCount).toBe(9);
    expect(result.products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          productId: 'com.risewiththetribe.pro.monthly',
          kind: 'subscription',
          entitlement: 'pro',
          cadence: 'monthly',
        }),
        expect.objectContaining({
          productId: 'com.risewiththetribe.pack.event_prep_21',
          kind: 'challengePack',
          entitlement: 'paidChallengePacks',
          packId: 'event_prep_21',
        }),
      ])
    );
  });
});
