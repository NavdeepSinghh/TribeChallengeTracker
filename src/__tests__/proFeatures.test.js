const fs = require('fs');
const path = require('path');
const { PRO_FEATURES, STORE_PRODUCT_IDS, STORE_PRODUCTS, canCreateChallengeTemplate, canUseProFeature, hasActiveChallengePack, hasActivePro } = require('../proFeatures');
const { readMarkdownWithIncludes } = require('../../scripts/verify-release-utils');

describe('Pro feature and store product catalog', () => {
  it('gates Pro features from the shared entitlement path', () => {
    expect(hasActivePro({ entitlements: { pro: { active: true } } })).toBe(true);
    expect(hasActivePro({ entitlements: { pro: { active: false } } })).toBe(false);
    expect(canUseProFeature({ entitlements: { pro: { active: true } } }, PRO_FEATURES.privateChallenges)).toBe(true);
    expect(canUseProFeature(null, PRO_FEATURES.privateChallenges)).toBe(false);
    expect(hasActiveChallengePack({ entitlements: { packs: { summer_shred: { active: true } } } }, 'summer_shred')).toBe(true);
    expect(canCreateChallengeTemplate(
      { entitlements: { packs: { summer_shred: { active: true } } } },
      { isPremium: true, packId: 'summer_shred' }
    )).toBe(true);
    expect(canCreateChallengeTemplate(
      { entitlements: { packs: { summer_shred: { active: false } } } },
      { isPremium: true, packId: 'summer_shred' }
    )).toBe(false);
  });

  it('keeps store product ids stable for native and backend purchase wiring', () => {
    expect(STORE_PRODUCT_IDS).toEqual([
      'com.risewiththetribe.pro.monthly',
      'com.risewiththetribe.pro.yearly',
      'com.risewiththetribe.pack.21_day_reset',
      'com.risewiththetribe.pack.summer_shred',
      'com.risewiththetribe.pack.beginner_consistency',
      'com.risewiththetribe.pack.discipline_30',
    ]);
    expect(STORE_PRODUCTS.reset21Pack.packId).toBe('21_day_reset');
    expect(STORE_PRODUCTS.reset21Pack.entitlement).toBe(PRO_FEATURES.paidChallengePacks);
    expect(STORE_PRODUCTS.summerShredPack.packId).toBe('summer_shred');
    expect(STORE_PRODUCTS.beginnerConsistencyPack.packId).toBe('beginner_consistency');
    expect(STORE_PRODUCTS.discipline30Pack.packId).toBe('discipline_30');

    const functionsSource = [
      fs.readFileSync(path.resolve(__dirname, '../../functions/index.js'), 'utf8'),
      fs.readFileSync(path.resolve(__dirname, '../../functions/purchaseEntitlements.js'), 'utf8'),
    ].join('\n');
    const storeReadiness = readMarkdownWithIncludes(path.resolve(__dirname, '../../docs/STORE_READINESS.md'));
    const featureCatalog = readMarkdownWithIncludes(path.resolve(__dirname, '../../docs/FEATURE_CATALOG.md'));
    STORE_PRODUCT_IDS.forEach(productId => {
      expect(functionsSource).toContain(productId);
      expect(storeReadiness).toContain(productId);
      expect(featureCatalog).toContain(productId);
    });
  });
});
