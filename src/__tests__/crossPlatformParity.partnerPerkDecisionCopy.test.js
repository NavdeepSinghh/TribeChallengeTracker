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

  it('keeps Partner Perk Handoff Audit Review Records wired on all platforms without fulfillment side effects', () => {
    const webProfile = readWebProfileContracts();
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('PARTNER PERK HANDOFF AUDIT REVIEW RECORD');
      expect(source).toContain('partnerPerkHandoffAuditReviews');
      expect(source).toContain('manualReviewOnly');
      expect(source).toContain('createsCoupons');
      expect(source).toContain('createsPartnerLinks');
      expect(source).toContain('createsPayouts');
      expect(source).toContain('createsDiscounts');
      expect(source).toContain('createsPurchases');
      expect(source).toContain('writesEntitlements');
      expect(source).toContain('createsAffiliateRewards');
      expect(source).toContain('hasTrackingPixels');
      expect(source).toContain('usesAdTargeting');
      expect(source).toContain('exportsThirdPartyData');
      expect(source).toContain('makesPaidAccessClaims');
      expect(source).toContain('collectsPayment');
      expect(source).toContain('processesRefunds');
      expect(source).toContain('promisesFulfillment');
      expect(source).toContain('autoMessagesUsers');
      expect(source).toContain('scrapesMessages');
      expect(source).toContain('pressuresMembers');
    });
    expect(webProfile).toContain('submitPartnerPerkHandoffAuditReview');
    expect(iosProfile).toContain('submitPartnerPerkHandoffAuditReview');
    expect(androidApp).toContain('submitPartnerPerkHandoffAuditReview');
  });

  it('keeps Partner Perk Handoff Audit Decision Reply Kit copy-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('PARTNER PERK HANDOFF AUDIT DECISION REPLY KIT');
      expect(source).toContain('COPY PERK AUDIT DECISION REPLIES');
      expect(source).toContain('partnerPerkHandoffAuditDecisionReplyCopy');
      expect(source).toContain('Partner Perk Handoff Audit Decision Reply Kit');
      expect(source).toContain('APPROVED FOR MANUAL HANDOFF');
      expect(source).toContain('WAITING ON HANDOFF REVIEW');
      expect(source).toContain('NOT READY FOR HANDOFF');
      expect(source).toContain('DECLINED FOR HANDOFF');
      expect(source).toContain('no-promise');
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
      expect(source).toContain('collect payment');
      expect(source).toContain('process refunds');
      expect(source).toContain('promise fulfillment');
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

  it('keeps Partner Perk Support Escalation Kit copy-only across platforms without fulfillment side effects', () => {
    const webProfile = readWebProfileContracts();
    [
      webProfile,
      iosProfile,
      androidApp,
    ].forEach((source) => {
      expect(source).toContain('PARTNER PERK SUPPORT ESCALATION KIT');
      expect(source).toContain('COPY PERK SUPPORT KIT');
      expect(source).toContain('partnerPerkSupportEscalationCopy');
      expect(source).toContain('Partner Perk Support Escalation Kit');
      expect(source).toContain('Partner perk support escalation checklist');
      expect(source).toContain('member support');
      expect(source).toContain('partner support');
      expect(source).toContain('marketplace support');
      expect(source).toContain('privacy/data safety');
      expect(source).toContain('entitlement QA');
      expect(source).toContain('finance/refund policy');
      expect(source).toContain('partner perk support escalation is not live fulfillment');
      expect(source).toContain('not coupon delivery');
      expect(source).toContain('not refund processing');
      expect(source).toContain('not payment collection');
      expect(source).toContain('not entitlement approval');
      expect(source).toContain('Do not provide live perk fulfillment');
      expect(source).toContain('create coupons');
      expect(source).toContain('create partner links');
      expect(source).toContain('process refunds');
      expect(source).toContain('collect payment details');
      expect(source).toContain('create payouts');
      expect(source).toContain('create discounts');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('create affiliate rewards');
      expect(source).toContain('add tracking pixels');
      expect(source).toContain('use ad targeting');
      expect(source).toContain('export third-party data');
      expect(source).toContain('expose private member logs');
      expect(source).toContain('scrape/store DMs');
      expect(source).toContain('auto-message users');
      expect(source).toContain('promise fulfillment');
      expect(source).toContain('imply paid access is live');
      expect(source).toContain('pressure members');
    });
  });
});
