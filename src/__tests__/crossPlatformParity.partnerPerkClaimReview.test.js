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

describe('cross-platform partner perk claim review parity source checks', () => {
  it('keeps Partner Perk Claim Admin Review Updates wired on all platforms without fulfillment side effects', () => {
    const webProfile = readWebProfileContracts();
    const webUserService = readWebUserServiceContracts();
    const firestoreRules = fs.readFileSync(path.resolve(repoRoot, 'firestore.rules'), 'utf8');
    [
      webUserService,
      iosChallengeService,
      androidRepository,
      firestoreRules,
    ].forEach((source) => {
      expect(source).toContain('reviewPartnerPerkClaim');
      expect(source).toContain('reviewNote');
      expect(source).toContain('reviewedBy');
      expect(source).toContain('reviewedAt');
      expect(source).toContain('approved');
      expect(source).toContain('waiting');
      expect(source).toContain('not_ready');
      expect(source).toContain('declined');
    });
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('Manual review note');
      expect(source).toContain('Review note:');
      expect(source).toContain('APPROVE');
      expect(source).toContain('WAIT');
      expect(source).toContain('NOT READY');
      expect(source).toContain('DECLINE');
      expect(source).toContain('eligibility proof');
      expect(source).toContain('destination safety');
      expect(source).toContain('without creating coupons');
      expect(source).toContain('partner links');
      expect(source).toContain('payouts');
      expect(source).toContain('discounts');
      expect(source).toContain('purchases');
      expect(source).toContain('entitlements');
      expect(source).toContain('paid-access claims');
    });
    expect(androidModels).toContain('reviewNote');
    expect(iosChallengeService).toContain('reviewNote');
  });
});
