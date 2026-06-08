const {
  fs,
  path,
  repoRoot,
  iosChallengeService,
  iosProfile,
  androidRepository,
  androidApp,
  androidModels,
  readWebProfileContracts,
  readWebUserServiceContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform partner perk parity source checks', () => {
  it('keeps Partner Perk Claim requests wired on all platforms without fulfillment side effects', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    [
      webUserService,
      iosChallengeService,
      androidRepository,
      firestoreRules,
    ].forEach((source) => {
      expect(source).toContain('partnerPerkClaims');
      expect(source).toContain('perkId');
      expect(source).toContain('perkLabel');
      expect(source).toContain('current');
      expect(source).toContain('target');
      expect(source).toContain('status');
    });
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('REQUEST PERK REVIEW');
      expect(source).toContain('PARTNER PERK CLAIM REVIEW QUEUE');
      expect(source).toContain('Partner perk claim sent for manual review');
      expect(source).toContain('do not create coupons');
      expect(source).toContain('partner links');
      expect(source).toContain('payouts');
      expect(source).toContain('discounts');
      expect(source).toContain('purchases');
      expect(source).toContain('entitlements');
      expect(source).toContain('paid-access claims');
    });
    expect(androidModels).toContain('PartnerPerkClaim');
    expect(iosChallengeService).toContain('PartnerPerkClaim');
  });

  it('keeps Partner Perk Claim Status History wired on all platforms without fulfillment side effects', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    [
      webUserService,
      iosChallengeService,
    ].forEach((source) => {
      expect(source).toContain('getPartnerPerkClaims');
      expect(source).toContain('partnerPerkClaims');
    });
    expect(androidRepository).toContain('partnerPerkClaims');
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('Partner perk claim status');
      expect(source).toContain('Review-only claim history from partnerPerkClaims');
      expect(source).toContain('No partner perk claims yet');
      expect(source).toContain('do not create coupons');
      expect(source).toContain('partner links');
      expect(source).toContain('payouts');
      expect(source).toContain('discounts');
      expect(source).toContain('purchases');
      expect(source).toContain('entitlements');
      expect(source).toContain('paid-access claims');
    });
  });
});
