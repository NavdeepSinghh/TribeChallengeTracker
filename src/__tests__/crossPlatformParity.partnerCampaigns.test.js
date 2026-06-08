const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform partner campaign parity source checks', () => {
  it('keeps Partner Pitch Kit wired on all platforms without ad tracking behavior', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PARTNER PITCH KIT');
      expect(source).toContain('COPY PARTNER PITCH');
      expect(source).toContain('first-party');
      expect(source).toContain('without random ads or third-party tracking');
    });
  });

  it('keeps Partner Campaign Activation Kit wired on all platforms without tracking or purchase side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PARTNER CAMPAIGN ACTIVATION KIT');
      expect(source).toContain('COPY ACTIVATION KIT');
      expect(source).toContain('partnerActivationCopy');
      expect(source).toContain('Pilot theme');
      expect(source).toContain('Total first-party perk signals');
      expect(source).toContain('Campaign member reach');
      expect(source).toContain('Referral joins');
      expect(source).toContain('Do not add partner links');
      expect(source).toContain('tracking pixels');
      expect(source).toContain('ad targeting');
      expect(source).toContain('purchases, entitlements');
    });
  });

  it('keeps Partner Terms Readiness Kit wired on all platforms without ad, payout, or data-sharing side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PARTNER TERMS READINESS KIT');
      expect(source).toContain('COPY PARTNER TERMS KIT');
      expect(source).toContain('partnerTermsReadinessCopy');
      expect(source).toContain('Partner fit');
      expect(source).toContain('Disclosure copy');
      expect(source).toContain('Data boundaries');
      expect(source).toContain('Destination review');
      expect(source).toContain('Reporting readiness');
      expect(source).toContain('Support handoff');
      expect(source).toContain('partner terms readiness brief only');
      expect(source).toContain('Do not add partner links');
      expect(source).toContain('tracking pixels');
      expect(source).toContain('ad targeting');
      expect(source).toContain('affiliate payouts');
      expect(source).toContain('third-party data sharing');
      expect(source).toContain('medical claims');
      expect(source).toContain('guaranteed outcomes');
      expect(source).toContain('paid-access claims');
    });
  });

});
