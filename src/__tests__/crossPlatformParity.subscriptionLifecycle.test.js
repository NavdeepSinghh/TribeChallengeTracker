const {
  iosProfile,
  androidApp,
  readWebProfileContracts,
} = require('../testUtils/crossPlatformParityFixtures');

describe('cross-platform subscription lifecycle parity source checks', () => {
  it('keeps Subscription Management Guidance Kit marketplace-first across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('SUBSCRIPTION MANAGEMENT GUIDANCE KIT');
      expect(source).toContain('COPY SUBSCRIPTION GUIDANCE');
      expect(source).toContain('subscriptionManagementGuidanceCopy');
      expect(source).toContain('App Store and Play cancellation/support boundaries');
      expect(source).toContain('MARKETPLACE FIRST');
      expect(source).toContain('Apple ID subscriptions');
      expect(source).toContain('Google Play subscriptions');
      expect(source).toContain('Restore/sync in the app');
      expect(source).toContain('Do not cancel subscriptions in-app');
      expect(source).toContain('process refunds');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('bypass App Store or Play policy');
    });
  });

  it('keeps Billing Support Escalation Kit marketplace-first across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('BILLING SUPPORT ESCALATION KIT');
      expect(source).toContain('COPY BILLING ESCALATION');
      expect(source).toContain('billingSupportEscalationCopy');
      expect(source).toContain('Wrong-account, renewal, charge, and entitlement triage');
      expect(source).toContain('failed renewal');
      expect(source).toContain('duplicate charge');
      expect(source).toContain('missing-entitlement cases');
      expect(source).toContain('Confirm the member is signed into the same Apple ID or Google Play account');
      expect(source).toContain('Route refund, cancellation, duplicate charge, chargeback, and payment-failure questions to marketplace support');
      expect(source).toContain('Do not cancel subscriptions in-app');
      expect(source).toContain('process refunds');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('override marketplace decisions');
      expect(source).toContain('collect payment details');
    });
  });

  it('keeps Renewal Recovery Kit restore-first across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('RENEWAL RECOVERY KIT');
      expect(source).toContain('COPY RENEWAL RECOVERY');
      expect(source).toContain('renewalRecoveryCopy');
      expect(source).toContain('Failed-renewal and lapsed-access support copy');
      expect(source).toContain('RESTORE FIRST');
      expect(source).toContain('grace period');
      expect(source).toContain('App Store or Google Play renewal/payment status');
      expect(source).toContain('restore/sync purchases in the app after marketplace renewal is fixed');
      expect(source).toContain('open entitlement recovery and attach support notes');
      expect(source).toContain('Do not retry charges in-app');
      expect(source).toContain('collect payment details');
      expect(source).toContain('cancel subscriptions');
      expect(source).toContain('process refunds');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('override marketplace renewal status');
    });
  });

  it('keeps Cancellation Feedback Kit learn-only across platforms', () => {
    const webProfile = readWebProfileContracts();
    [webProfile, iosProfile, androidApp].forEach((source) => {
      expect(source).toContain('CANCELLATION FEEDBACK KIT');
      expect(source).toContain('COPY CANCELLATION FEEDBACK');
      expect(source).toContain('cancellationFeedbackCopy');
      expect(source).toContain('Marketplace-safe churn learning prompts');
      expect(source).toContain('LEARN ONLY');
      expect(source).toContain('without obstructing the marketplace flow');
      expect(source).toContain('without storing payment details or marketplace account data');
      expect(source).toContain('first-party Pro interest');
      expect(source).toContain('Do not block cancellation');
      expect(source).toContain('retry charges in-app');
      expect(source).toContain('collect payment details');
      expect(source).toContain('offer unconfigured discounts');
      expect(source).toContain('process refunds');
      expect(source).toContain('create purchases');
      expect(source).toContain('write entitlements');
      expect(source).toContain('override marketplace subscription state');
      expect(source).toContain('pressure the member to stay');
    });
  });
});
