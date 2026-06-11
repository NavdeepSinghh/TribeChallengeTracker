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

  it('keeps Partner Campaign Support Escalation Kit manual across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PARTNER CAMPAIGN SUPPORT ESCALATION KIT');
      expect(source).toContain('COPY PARTNER SUPPORT KIT');
      expect(source).toContain('partnerCampaignSupportEscalationCopy');
      expect(source).toContain('Partner Campaign Support Escalation Kit');
      expect(source).toContain('Partner campaign support escalation checklist');
      expect(source).toContain('partner terms owner');
      expect(source).toContain('member support');
      expect(source).toContain('partner support');
      expect(source).toContain('marketplace support');
      expect(source).toContain('privacy/data safety');
      expect(source).toContain('entitlement QA');
      expect(source).toContain('finance/refund policy');
      expect(source).toContain('moderation');
      expect(source).toContain('partner campaign support escalation is not a live sponsor campaign');
      expect(source).toContain('not partner-link activation');
      expect(source).toContain('not coupon delivery');
      expect(source).toContain('not payment collection');
      expect(source).toContain('not payout approval');
      expect(source).toContain('not entitlement approval');
      expect(source).toContain('Do not claim partner campaigns are live');
      expect(source).toContain('create partner links');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('use ad targeting');
      expect(source).toContain('collect payments');
      expect(source).toContain('create purchases');
      expect(source).toContain('create affiliate payouts');
      expect(source).toContain('create commissions');
      expect(source).toContain('start revenue-share');
      expect(source).toContain('write entitlements');
      expect(source).toContain('offer discounts');
      expect(source).toContain('create coupons');
      expect(source).toContain('share third-party data');
      expect(source).toContain('export private member logs');
      expect(source).toContain('scrape/store DMs');
      expect(source).toContain('auto-message users');
      expect(source).toContain('promise fulfillment');
      expect(source).toContain('pressure users, partners, or members');
    });
  });

  it('keeps Partner Campaign Retrospective Kit aggregate-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('PARTNER CAMPAIGN RETROSPECTIVE KIT');
      expect(source).toContain('COPY PARTNER RETROSPECTIVE');
      expect(source).toContain('partnerCampaignRetrospectiveCopy');
      expect(source).toContain('Manual retrospective prompts');
      expect(source).toContain('aggregate app signal');
      expect(source).toContain('support notes');
      expect(source).toContain('repeat-or-pause decisions');
      expect(source).toContain('aggregate-only post-pilot');
      expect(source).toContain('Do not create partner links');
      expect(source).toContain('tracking pixels');
      expect(source).toContain('ad targeting');
      expect(source).toContain('affiliate payouts');
      expect(source).toContain('coupons');
      expect(source).toContain('purchases');
      expect(source).toContain('entitlements');
      expect(source).toContain('revenue-share');
      expect(source).toContain('third-party data exports');
      expect(source).toContain('fulfillment promises');
      expect(source).toContain('auto-message users');
      expect(source).toContain('scrape/store DMs');
      expect(source).toContain('pressure partners or members');
    });
  });
});
