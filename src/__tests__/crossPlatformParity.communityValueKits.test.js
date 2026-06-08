const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform community value kit parity source checks', () => {
  it('keeps Community Ambassador Kit wired on all platforms without payout or affiliate side effects', () => {
    const webProfile = readWebProfileContracts();
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('COMMUNITY AMBASSADOR KIT');
      expect(source).toContain('COPY AMBASSADOR KIT');
      expect(source).toContain('communityAmbassadorCopy');
      expect(source).toContain('invite one accountability partner');
      expect(source).toContain('free community loop');
      expect(source).toContain('community-recognition brief');
      expect(source).toContain('Do not create commissions');
      expect(source).toContain('payouts');
      expect(source).toContain('paid roles');
      expect(source).toContain('affiliate links');
      expect(source).toContain('partner tracking');
      expect(source).toContain('revenue-share promises');
    });
  });

  it('keeps Customer Value Checklist wired on all platforms without paid-access side effects', () => {
    const webProfile = readWebProfileContracts();
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('CUSTOMER VALUE CHECKLIST');
      expect(source).toContain('COPY VALUE CHECKLIST');
      expect(source).toContain('customerValueChecklistCopy');
      expect(source).toContain('Charge only after value is visible');
      expect(source).toContain('free challenge loop must create visible consistency');
      expect(source).toContain('paid offer must add measurable accountability');
      expect(source).toContain('value-readiness brief');
      expect(source).toContain('Do not charge users');
      expect(source).toContain('unlock paid access');
      expect(source).toContain('promise outcomes');
      expect(source).toContain('imply medical results');
      expect(source).toContain('write entitlements');
      expect(source).toContain('promote paid features as live');
    });
  });
});
