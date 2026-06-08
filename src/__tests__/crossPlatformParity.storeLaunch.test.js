const {
  fs,
  path,
  repoRoot,
  iosProfile,
  iosUserProfile,
  androidBilling,
  androidApp,
  iosProducts,
  androidModels,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');


describe('cross-platform store launch and review parity source checks', () => {
  it('keeps Store Launch Readiness admin-only on all platforms', () => {
    const webProfile = readWebProfileContracts();
    const webPurchaseService = fs.readFileSync(path.resolve(repoRoot, 'src/purchaseService.js'), 'utf8');
    expect(webPurchaseService).toContain('STORE_PRODUCTS');
    [iosProducts, androidModels].forEach((source) => {
      expect(source).toContain('StoreProducts');
      expect(source).toContain('com.risewiththetribe.pro.monthly');
      expect(source).toContain('com.risewiththetribe.pack.summer_shred');
    });
    expect(fs.readFileSync(path.resolve(repoRoot, 'src/proFeatures.js'), 'utf8')).toContain('com.risewiththetribe.pack.summer_shred');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('Store Launch Readiness');
      expect(source).toContain('storeReadinessCopy');
      expect(source).toContain('COPY STORE LAUNCH CHECKLIST');
      expect(source).toContain('CREDENTIALS PENDING');
      expect(source).toContain('receipt-validation credentials');
    });
  });

  it('keeps purchase sync and restore hooks visible across platforms', () => {
    expect(readWebProfileContracts()).toContain('Sync previous purchases');
    expect(iosProfile).toContain('Sync previous purchases');
    expect(androidApp).toContain('Sync previous purchases');
    expect(iosUserProfile).toContain('currentEntitlementPayloads');
    expect(androidBilling).toContain('queryOwnedPurchases');
    expect(iosUserProfile).toContain('verifyPurchase');
    expect(androidApp).toContain('verifyPurchasePayload');
  });

  it('keeps Store Credential Setup Kit wired across profile surfaces', () => {
    const webProfile = readWebProfileContracts();
    const webPurchaseService = fs.readFileSync(path.resolve(repoRoot, 'src/purchaseService.js'), 'utf8');
    const functionsIndex = fs.readFileSync(path.resolve(repoRoot, 'functions/index.js'), 'utf8');
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('STORE CREDENTIAL SETUP KIT');
      expect(source).toContain('COPY CREDENTIAL SETUP KIT');
      expect(source).toContain('CHECK VALIDATION READINESS');
      expect(source).toContain('App Store Connect');
      expect(source).toContain('Play Console');
      expect(source).toContain('Firebase Functions');
      expect(source).toContain('verifyPurchase');
      expect(source).toContain('Firestore entitlements');
    });
    [webPurchaseService, functionsIndex, iosUserProfile, androidApp].forEach((source) => {
      expect(source).toContain('getPurchaseValidationReadiness');
    });
    expect(functionsIndex).toContain('validationConfigured');
    expect(fs.readFileSync(path.resolve(repoRoot, 'functions/purchaseEntitlements.js'), 'utf8')).toContain('validation_configured');
    [webProfile, functionsIndex, iosUserProfile, androidApp].forEach((source) => {
      expect(source).toContain('No entitlements were changed');
    });
  });

});
