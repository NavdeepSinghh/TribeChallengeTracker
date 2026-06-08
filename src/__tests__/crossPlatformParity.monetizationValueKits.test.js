const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform monetization value kit parity source checks', () => {
  it('keeps Revenue Pathway Planner wired on all platforms without paid or tracking side effects', () => {
    const webProfile = readWebProfileContracts();
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('REVENUE PATHWAY PLANNER');
      expect(source).toContain('COPY REVENUE PATHWAY PLAN');
      expect(source).toContain('revenuePathwayPlannerCopy');
      expect(source).toContain('Recommended path');
      expect(source).toContain('Path signals');
      expect(source).toContain('Tribe Pro');
      expect(source).toContain('Paid Packs');
      expect(source).toContain('Creator Hosting');
      expect(source).toContain('Partner Campaign');
      expect(source).toContain('Do not add tracking pixels');
      expect(source).toContain('paid-access claims');
      expect(source).toContain('purchases, entitlements');
      expect(source).toContain('payout promises');
    });
  });

  it('keeps Pricing Test Kit wired on all platforms without purchase or discount side effects', () => {
    const webProfile = readWebProfileContracts();
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('PRICING TEST KIT');
      expect(source).toContain('COPY PRICING TEST KIT');
      expect(source).toContain('pricingTestKitCopy');
      expect(source).toContain('Products to configure before paid launch');
      expect(source).toContain('Do not quote unconfigured prices');
      expect(source).toContain('collect payments outside approved store flows');
      expect(source).toContain('grant purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('offer discounts');
      expect(source).toContain('claim paid access is live');
    });
  });

  it('keeps Founder Member Offer Kit wired on all platforms without sale or entitlement side effects', () => {
    const webProfile = readWebProfileContracts();
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('FOUNDER MEMBER OFFER KIT');
      expect(source).toContain('COPY FOUNDER OFFER KIT');
      expect(source).toContain('founderMemberOfferCopy');
      expect(source).toContain('early tribe accountability access');
      expect(source).toContain('free challenge loop');
      expect(source).toContain('first-party interest');
      expect(source).toContain('This is not a sale');
      expect(source).toContain('lifetime deal');
      expect(source).toContain('purchase, entitlement, discount');
      expect(source).toContain('Do not collect payment');
      expect(source).toContain('promise founder pricing');
    });
  });
});
