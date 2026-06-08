const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform partner campaign decision parity source checks', () => {
  it('keeps Partner Contract Readiness Kit wired on all platforms without contract side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PARTNER CONTRACT READINESS KIT');
      expect(source).toContain('COPY PARTNER CONTRACT KIT');
      expect(source).toContain('partnerContractReadinessCopy');
      expect(source).toContain('Contract checklist');
      expect(source).toContain('Partner identity');
      expect(source).toContain('support owner');
      expect(source).toContain('disclosure wording');
      expect(source).toContain('fulfillment scope');
      expect(source).toContain('refund boundaries');
      expect(source).toContain('data deletion/privacy escalation');
      expect(source).toContain('partner contract readiness brief only');
      expect(source).toContain('Do not create partner links');
      expect(source).toContain('tracking pixels');
      expect(source).toContain('ad targeting');
      expect(source).toContain('affiliate payouts');
      expect(source).toContain('commissions');
      expect(source).toContain('revenue-share');
      expect(source).toContain('discounts');
      expect(source).toContain('coupons');
      expect(source).toContain('third-party data sharing');
      expect(source).toContain('fulfillment promises');
    });
  });

  it('keeps Partner Campaign Objection Reply Kit wired on all platforms without sponsor monetization side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PARTNER CAMPAIGN OBJECTION REPLY KIT');
      expect(source).toContain('COPY PARTNER REPLIES');
      expect(source).toContain('partnerCampaignObjectionReplyCopy');
      expect(source).toContain('Manual replies:');
      expect(source).toContain('Are partner perks or sponsor campaigns live yet?');
      expect(source).toContain('Do not claim partner campaigns are live');
      expect(source).toContain('add partner links');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('use ad targeting');
      expect(source).toContain('collect payments');
      expect(source).toContain('create purchases');
      expect(source).toContain('create affiliate payouts');
      expect(source).toContain('create commissions');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('write entitlements');
      expect(source).toContain('share third-party data');
      expect(source).toContain('store inbound DMs');
      expect(source).toContain('pressure users');
    });
  });

  it('keeps Partner Campaign Decision Reply Kit copy-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PARTNER CAMPAIGN DECISION REPLY KIT');
      expect(source).toContain('COPY PARTNER CAMPAIGN DECISION REPLIES');
      expect(source).toContain('partnerCampaignDecisionReplyCopy');
      expect(source).toContain('Manual sponsor-pilot review replies');
      expect(source).toContain('APPROVED FOR MANUAL FOLLOW-UP');
      expect(source).toContain('WAITING ON PARTNER TERMS');
      expect(source).toContain('NOT READY YET');
      expect(source).toContain('DECLINED FOR NOW');
      expect(source).toContain('Do not create partner links');
      expect(source).toContain('tracking pixels');
      expect(source).toContain('ad targeting');
      expect(source).toContain('affiliate payouts');
      expect(source).toContain('purchases');
      expect(source).toContain('entitlements');
      expect(source).toContain('revenue-share');
      expect(source).toContain('third-party data exports');
      expect(source).toContain('fulfillment promises');
      expect(source).toContain('pressure partners or members');
    });
  });
});
