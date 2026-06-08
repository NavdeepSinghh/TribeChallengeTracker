const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform store launch decision parity source checks', () => {
  it('keeps Paid Launch Decision Gate wired without payment or entitlement side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PAID LAUNCH DECISION GATE');
      expect(source).toContain('COPY LAUNCH DECISION');
      expect(source).toContain('paidLaunchDecisionCopy');
      expect(source).toContain('HOLD FOR STORE TESTS');
      expect(source).toContain('Product IDs in code');
      expect(source).toContain('Receipt-validation credentials confirmed');
      expect(source).toContain('Store test evidence recorded');
      expect(source).toContain('Store test evidence:');
      expect(source).toContain('storeTestEvidence');
      expect(source).toContain('Entitlement QA passed');
      expect(source).toContain('decision-support brief');
      expect(source).toContain('Do not flip paid access live');
      expect(source).toContain('write entitlements');
      expect(source).toContain('process payments');
      expect(source).toContain('process refunds');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('announce launch readiness');
    });
  });

  it('keeps Paid Launch Decision Reply Kit copy-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PAID LAUNCH DECISION REPLY KIT');
      expect(source).toContain('COPY PAID LAUNCH REPLIES');
      expect(source).toContain('paidLaunchDecisionReplyCopy');
      expect(source).toContain('Manual launch gate decision replies');
      expect(source).toContain('READY FOR FINAL LAUNCH REVIEW');
      expect(source).toContain('HOLD FOR STORE TESTS');
      expect(source).toContain('BLOCKED BY RELEASE RISK');
      expect(source).toContain('REVIEW NOTES ONLY');
      expect(source).toContain('Do not flip paid access live');
      expect(source).toContain('write entitlements');
      expect(source).toContain('create purchases');
      expect(source).toContain('process payments');
      expect(source).toContain('process refunds');
      expect(source).toContain('bypass App Store or Google Play policy');
      expect(source).toContain('submit store review');
      expect(source).toContain('mark validation complete without credentials');
      expect(source).toContain('claim sandbox/license-test purchases passed without evidence');
      expect(source).toContain('collect payment details');
      expect(source).toContain('auto-message users');
      expect(source).toContain('scrape/store DMs');
      expect(source).toContain('announce launch readiness');
    });
  });

  it('keeps Sandbox Purchase Test Plan wired without live charge or entitlement side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('SANDBOX PURCHASE TEST PLAN');
      expect(source).toContain('COPY SANDBOX TEST PLAN');
      expect(source).toContain('sandboxPurchaseTestPlanCopy');
      expect(source).toContain('App Store sandbox');
      expect(source).toContain('Play license test');
      expect(source).toContain('restore');
      expect(source).toContain('verifyPurchase');
      expect(source).toContain('Firestore entitlement QA');
      expect(source).toContain('Negative QA');
      expect(source).toContain('manual sandbox QA plan only');
      expect(source).toContain('Do not run live charges');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('unlock entitlements from profile UI');
      expect(source).toContain('write fake purchases');
      expect(source).toContain('process refunds');
      expect(source).toContain('claim paid access is live');
    });
  });

});
