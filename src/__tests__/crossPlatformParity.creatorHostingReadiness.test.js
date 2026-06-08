const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform creator hosting readiness parity source checks', () => {
  it('keeps Creator Hosting Offer Kit wired on all platforms without paid-hosting side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR HOSTING OFFER KIT');
      expect(source).toContain('COPY HOSTING OFFER KIT');
      expect(source).toContain('Future paid-hosting planning brief');
      expect(source).toContain('creatorHostingOfferCopy');
      expect(source).toContain('Revenue-ready signals');
      expect(source).toContain('paid-hosting policy');
      expect(source).toContain('payout operations');
      expect(source).toContain('Firestore entitlement QA');
      expect(source).toContain('does not create a contract');
      expect(source).toContain('paid-access claim');
    });
  });

  it('keeps Creator Terms Readiness Kit wired on all platforms without payout or contract side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR TERMS READINESS KIT');
      expect(source).toContain('COPY CREATOR TERMS KIT');
      expect(source).toContain('creatorTermsReadinessCopy');
      expect(source).toContain('Responsibilities before paid hosting');
      expect(source).toContain('Creator responsibilities');
      expect(source).toContain('Content moderation');
      expect(source).toContain('Payout readiness');
      expect(source).toContain('Marketplace alignment');
      expect(source).toContain('Support handoff');
      expect(source).toContain('creator terms readiness brief only');
      expect(source).toContain('Do not create contracts');
      expect(source).toContain('collect payout details');
      expect(source).toContain('collect tax details');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('process payments');
      expect(source).toContain('write entitlements');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('claim paid creator hosting is live');
    });
  });

  it('keeps Creator Payout Readiness Kit wired on all platforms without payout side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CREATOR PAYOUT READINESS KIT');
      expect(source).toContain('COPY CREATOR PAYOUT KIT');
      expect(source).toContain('creatorPayoutReadinessCopy');
      expect(source).toContain('Payout operations before revenue-share');
      expect(source).toContain('Payout readiness checklist');
      expect(source).toContain('payout provider');
      expect(source).toContain('tax collection');
      expect(source).toContain('identity verification');
      expect(source).toContain('refund responsibility');
      expect(source).toContain('creator payout readiness brief only');
      expect(source).toContain('Do not create payouts');
      expect(source).toContain('collect payout details');
      expect(source).toContain('collect tax details');
      expect(source).toContain('create contracts');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('process payments');
      expect(source).toContain('write entitlements');
      expect(source).toContain('bypass marketplace policy');
      expect(source).toContain('claim paid creator hosting is live');
    });
  });
});
