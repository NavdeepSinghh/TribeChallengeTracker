const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform partner perk decision copy parity source checks', () => {
  it('keeps Partner Perk Handoff Audit Kit wired on all platforms without fulfillment side effects', () => {
    const webProfile = readWebProfileContracts();
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('PARTNER PERK HANDOFF AUDIT KIT');
      expect(source).toContain('COPY PERK AUDIT KIT');
      expect(source).toContain('partnerPerkHandoffAuditCopy');
      expect(source).toContain('Manual audit checklist');
      expect(source).toContain('member-facing note stayed no-promise');
      expect(source).toContain('aggregate support outcomes');
      expect(source).toContain('unresolved support risk');
      expect(source).toContain('Do not create coupons');
      expect(source).toContain('partner links');
      expect(source).toContain('payouts');
      expect(source).toContain('discounts');
      expect(source).toContain('purchases');
      expect(source).toContain('entitlements');
      expect(source).toContain('affiliate rewards');
      expect(source).toContain('tracking pixels');
      expect(source).toContain('ad targeting');
      expect(source).toContain('third-party data exports');
      expect(source).toContain('paid-access claims');
      expect(source).toContain('payment collection');
      expect(source).toContain('refunds');
      expect(source).toContain('fulfillment promises');
      expect(source).toContain('auto-message users');
      expect(source).toContain('scrape/store DMs');
      expect(source).toContain('pressure members');
    });
  });

  it('keeps Partner Perk Admin Decision Reply Kit wired on all platforms without fulfillment side effects', () => {
    const webProfile = readWebProfileContracts();
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('PARTNER PERK DECISION REPLY KIT');
      expect(source).toContain('COPY PERK DECISION REPLIES');
      expect(source).toContain('partnerPerkDecisionReplyCopy');
      expect(source).toContain('Manual decision replies');
      expect(source).toContain('APPROVED FOR MANUAL FOLLOW-UP');
      expect(source).toContain('WAITING ON PARTNER TERMS');
      expect(source).toContain('NOT READY YET');
      expect(source).toContain('DECLINED FOR NOW');
      expect(source).toContain('eligibility proof');
      expect(source).toContain('destination safety');
      expect(source).toContain('Do not create coupons');
      expect(source).toContain('partner links');
      expect(source).toContain('payouts');
      expect(source).toContain('discounts');
      expect(source).toContain('purchases');
      expect(source).toContain('entitlements');
      expect(source).toContain('fulfillment promises');
    });
  });
});
