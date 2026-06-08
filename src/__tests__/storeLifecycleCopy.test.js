import {
  CANCELLATION_FEEDBACK_ITEMS,
  LAPSED_MEMBER_WINBACK_ITEMS,
  RENEWAL_RECOVERY_ITEMS,
  STORE_DEMO_ACCOUNT_ITEMS,
  STORE_LAUNCH_DRY_RUN_ITEMS,
  STORE_REVIEW_PACK_ITEMS,
} from '../profile/profileStoreConstants';
import { buildStoreLifecycleCopy } from '../profile/storeLifecycleCopy';
import { buildStoreSupportCopyCards } from '../profile/storeSupportCopyCards';

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

describe('store lifecycle copy contracts', () => {
  it('builds renewal, cancellation, lapsed winback, and review prep support cards without paid-live side effects', () => {
    const lifecycleCopy = buildStoreLifecycleCopy({
      activeChallengePackCount: 0,
      cancellationFeedbackItems: CANCELLATION_FEEDBACK_ITEMS,
      challengePackCount: 1,
      currentStreak: 4,
      entitlementRecoveryReviewCount: 2,
      lapsedMemberWinbackItems: LAPSED_MEMBER_WINBACK_ITEMS,
      monetizationSignalTotal: 9,
      paidLaunchDecisionItemCount: 6,
      paidLaunchDecisionStatus: 'HOLD FOR STORE TESTS',
      paidLaunchReadyCount: 3,
      policyLinks: [{ label: 'Privacy' }, { label: 'Support' }],
      proActive: false,
      proTrialDemandTotal: 3,
      recommendedRevenuePath: { label: 'Tribe Pro' },
      referralJoins: 5,
      renewalRecoveryItems: RENEWAL_RECOVERY_ITEMS,
      storeCatalog,
      storeDemoAccountItems: STORE_DEMO_ACCOUNT_ITEMS,
      storeLaunchDryRunItems: STORE_LAUNCH_DRY_RUN_ITEMS,
      storeReviewPackItems: STORE_REVIEW_PACK_ITEMS,
      storeTestEvidenceSummary,
      supportReviewCount: 1,
      validationReadinessConfirmed: false,
      weeklyCampaignPrompt: {
        cta: 'Log one honest session today.',
        hashtag: '#TribeReset',
        name: 'Seven Day Reset',
      },
    });
    const cards = buildStoreSupportCopyCards({
      billingSupportEscalationCopy: 'billing',
      cancellationFeedbackCopy: lifecycleCopy.cancellationFeedbackCopy,
      lapsedMemberWinbackCopy: lifecycleCopy.lapsedMemberWinbackCopy,
      renewalRecoveryCopy: lifecycleCopy.renewalRecoveryCopy,
      storeDemoAccountCopy: lifecycleCopy.storeDemoAccountCopy,
      storeLaunchDryRunCopy: lifecycleCopy.storeLaunchDryRunCopy,
      storeReviewPackCopy: lifecycleCopy.storeReviewPackCopy,
      subscriptionManagementGuidanceCopy: 'subscription',
    });

    expect(lifecycleCopy.renewalRecoveryCopy).toContain('Renewal Recovery Kit');
    expect(lifecycleCopy.renewalRecoveryCopy).toContain('Do not retry charges in-app');
    expect(lifecycleCopy.renewalRecoveryCopy).toContain('promise restored access');
    expect(lifecycleCopy.cancellationFeedbackCopy).toContain('Cancellation Feedback Kit');
    expect(lifecycleCopy.cancellationFeedbackCopy).toContain('Do not block cancellation');
    expect(lifecycleCopy.cancellationFeedbackCopy).toContain('pressure the member to stay');
    expect(lifecycleCopy.lapsedMemberWinbackCopy).toContain('Lapsed Member Winback Kit');
    expect(lifecycleCopy.lapsedMemberWinbackCopy).toContain('Do not auto-message users');
    expect(lifecycleCopy.storeLaunchDryRunCopy).toContain('Store Launch Dry-Run Kit');
    expect(lifecycleCopy.storeLaunchDryRunCopy).toContain('Do not flip paid access live');
    expect(lifecycleCopy.storeReviewPackCopy).toContain('Store Review Pack');
    expect(lifecycleCopy.storeReviewPackCopy).toContain('Do not submit store review');
    expect(cards.map(card => card.title)).toEqual([
      'SUBSCRIPTION MANAGEMENT GUIDANCE KIT',
      'BILLING SUPPORT ESCALATION KIT',
      'RENEWAL RECOVERY KIT',
      'CANCELLATION FEEDBACK KIT',
      'LAPSED MEMBER WINBACK KIT',
      'STORE LAUNCH DRY-RUN KIT',
      'STORE DEMO ACCOUNT KIT',
      'STORE REVIEW PACK',
    ]);
  });
});
