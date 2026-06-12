jest.mock('../firebase', () => ({
  db: {},
  functions: {},
}));

import {
  BILLING_SUPPORT_ESCALATION_ITEMS,
  SUBSCRIPTION_MANAGEMENT_GUIDANCE_ITEMS,
  SUPPORT_REFUND_READINESS_ITEMS,
} from '../profile/profileStoreConstants';
import { buildStoreBillingSupportCopy } from '../profile/storeBillingSupportCopy';
import { buildStoreReadinessSupportCopy } from '../profile/storeReadinessCopy';

const storeCatalog = [
  { id: 'com.risewiththetribe.pro.monthly', kind: 'subscription' },
  { id: 'com.risewiththetribe.pack.21_day_reset', kind: 'pack' },
];

const storeTestEvidenceSummary = {
  android: 1,
  failed: 0,
  ios: 1,
  needs_review: 1,
  total: 3,
};

describe('store billing support copy contracts', () => {
  it('builds marketplace-first support, subscription, billing, and entitlement recovery copy', () => {
    const readinessCopy = buildStoreReadinessSupportCopy({
      monetizationSignalTotal: 9,
      storeCatalog,
      storeCredentialSetupItems: ['Configure App Store and Play validation secrets'],
      storePackCount: 1,
      storeSubscriptionCount: 1,
      subscriptionManagementGuidanceItems: SUBSCRIPTION_MANAGEMENT_GUIDANCE_ITEMS,
      supportRefundReadinessItems: SUPPORT_REFUND_READINESS_ITEMS,
    });
    const billingCopy = buildStoreBillingSupportCopy({
      activeChallengePackCount: 0,
      billingSupportEscalationItems: BILLING_SUPPORT_ESCALATION_ITEMS,
      challengePackCount: 1,
      entitlementRecoveryReviewCount: 2,
      proActive: false,
      storeCatalog,
      storePackCount: 1,
      storeSubscriptionCount: 1,
      storeTestEvidenceSummary,
      validationReadinessConfirmed: false,
    });

    expect(readinessCopy.supportRefundReadinessCopy).toContain('Support and Refund Readiness Kit');
    expect(readinessCopy.supportRefundReadinessCopy).toContain('Do not process refunds in-app');
    expect(readinessCopy.supportRefundReadinessCopy).toContain('write entitlements manually');
    expect(readinessCopy.subscriptionManagementGuidanceCopy).toContain('Subscription Management Guidance Kit');
    expect(readinessCopy.subscriptionManagementGuidanceCopy).toContain('Apple ID > Subscriptions');
    expect(readinessCopy.subscriptionManagementGuidanceCopy).toContain('Google Play');
    expect(readinessCopy.subscriptionManagementGuidanceCopy).toContain('Do not cancel subscriptions in-app');
    expect(billingCopy.billingSupportEscalationCopy).toContain('Billing Support Escalation Kit');
    expect(billingCopy.billingSupportEscalationCopy).toContain('Route refund, cancellation, duplicate charge');
    expect(billingCopy.billingSupportEscalationCopy).toContain('Do not cancel subscriptions in-app');
    expect(billingCopy.billingSupportEscalationCopy).toContain('collect payment details');
    expect(billingCopy.entitlementRecoveryDecisionReplyCopy).toContain('Entitlement Recovery Decision Reply Kit');
    expect(billingCopy.entitlementRecoveryDecisionReplyCopy).toContain('WAITING ON STORE CONTEXT');
    expect(billingCopy.entitlementRecoveryDecisionReplyCopy).toContain('ESCALATE TO MARKETPLACE SUPPORT');
    expect(billingCopy.entitlementRecoveryDecisionReplyCopy).toContain('Do not write entitlements');
    expect(billingCopy.entitlementRecoveryDecisionReplyCopy).toContain('promise restored access');
  });
});
