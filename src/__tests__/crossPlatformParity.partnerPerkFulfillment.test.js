const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform partner perk fulfillment parity source checks', () => {
  it('keeps Partner Perk Fulfillment Readiness Kit wired on all platforms without fulfillment side effects', () => {
    const webProfile = readWebProfileContracts();
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('PARTNER PERK FULFILLMENT READINESS KIT');
      expect(source).toContain('COPY PERK FULFILLMENT KIT');
      expect(source).toContain('partnerPerkFulfillmentReadinessCopy');
      expect(source).toContain('Manual readiness checks');
      expect(source).toContain('Open perk claims');
      expect(source).toContain('Verify the claim was written from first-party eligibility progress only');
      expect(source).toContain('support owner');
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

  it('keeps Partner Perk Fulfillment Handoff Kit wired on all platforms without fulfillment side effects', () => {
    const webProfile = readWebProfileContracts();
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('PARTNER PERK FULFILLMENT HANDOFF KIT');
      expect(source).toContain('COPY PERK HANDOFF KIT');
      expect(source).toContain('partnerPerkFulfillmentHandoffCopy');
      expect(source).toContain('Manual handoff script');
      expect(source).toContain('approved for manual follow-up only');
      expect(source).toContain('no-promise handoff note');
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
      expect(source).toContain('fulfillment promises');
      expect(source).toContain('auto-message users');
      expect(source).toContain('scrape/store DMs');
      expect(source).toContain('pressure members');
    });
  });

});
