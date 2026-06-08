const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');


describe('cross-platform support and billing parity source checks', () => {
  it('keeps Support Refund Readiness Kit wired without refund or entitlement side effects', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('SUPPORT REFUND READINESS KIT');
      expect(source).toContain('COPY SUPPORT KIT');
      expect(source).toContain('supportRefundReadinessCopy');
      expect(source).toContain('restore purchases');
      expect(source).toContain('marketplace refunds');
      expect(source).toContain('missing entitlements');
      expect(source).toContain('support-readiness brief');
      expect(source).toContain('Do not process refunds in-app');
      expect(source).toContain('override App Store or Play refund policy');
      expect(source).toContain('write entitlements manually');
      expect(source).toContain('promise outcomes');
      expect(source).toContain('imply medical results');
      expect(source).toContain('promote paid access as live');
    });
  });

  it('keeps Entitlement Recovery Decision Reply Kit copy-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('ENTITLEMENT RECOVERY DECISION REPLY KIT');
      expect(source).toContain('COPY ENTITLEMENT RECOVERY REPLIES');
      expect(source).toContain('entitlementRecoveryDecisionReplyCopy');
      expect(source).toContain('Manual missing-purchase support replies');
      expect(source).toContain('WAITING ON STORE CONTEXT');
      expect(source).toContain('RESOLVED AFTER RECOVERY REVIEW');
      expect(source).toContain('CLOSED FOR NOW');
      expect(source).toContain('ESCALATE TO MARKETPLACE SUPPORT');
      expect(source).toContain('Do not write entitlements');
      expect(source).toContain('process refunds');
      expect(source).toContain('cancel subscriptions');
      expect(source).toContain('create purchases');
      expect(source).toContain('retry charges');
      expect(source).toContain('collect payment details');
      expect(source).toContain('bypass App Store or Google Play policy');
      expect(source).toContain('override marketplace decisions');
      expect(source).toContain('expose private user data');
      expect(source).toContain('promise restored access');
      expect(source).toContain('auto-message users');
      expect(source).toContain('scrape/store DMs');
      expect(source).toContain('pressure members');
    });
  });
});
