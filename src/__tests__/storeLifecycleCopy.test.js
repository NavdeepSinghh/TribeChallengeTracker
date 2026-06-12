import { buildStoreLifecycleCopy } from '../profile/storeLifecycleCopy';
import { buildStoreSupportCopyCards } from '../profile/storeSupportCopyCards';

const CANCELLATION_FEEDBACK_ITEMS = [
  'Ask what felt unclear, unused, too expensive, or not valuable enough before the member leaves',
  'Route cancellation steps to App Store or Google Play subscriptions without obstructing the marketplace flow',
  'Capture optional support notes for product learning without storing payment details or marketplace account data',
  'Review cancellation themes against first-party Pro interest, pack interest, creator demand, and support readiness',
];
const LAPSED_MEMBER_WINBACK_ITEMS = [
  'Lead with a free comeback challenge, not a discount or payment ask',
  'Use current weekly campaign copy, streak rescue prompts, and referral momentum as the return path',
  'Invite the member to log one activity before asking about Pro, packs, creator tools, or partner perks',
  'Review first-party re-engagement signals only: app logs, challenge joins, referrals, support notes, and saved interest',
];
const RENEWAL_RECOVERY_ITEMS = [
  'Confirm whether the member is lapsed, cancelled, in grace period, or using the wrong store account',
  'Ask the member to update payment details and manage renewal inside App Store or Google Play subscriptions',
  'Invite the member to restore/sync purchases after renewal, then open entitlement recovery if access stays missing',
  'Use first-party support notes only; keep payment, refund, chargeback, and cancellation decisions with the marketplace',
];
const STORE_DEMO_ACCOUNT_ITEMS = [
  'Prepare one reviewer-safe demo account with onboarding complete, profile appearance set, and no personal member data',
  'Seed visible free flows: joined campaign challenge, activity history, badges, calendar history, share cards, support links, and Feature Me consent example',
  'Keep paid surfaces in review mode unless sandbox/license-test purchases, restore, receipt validation, and entitlement QA are proven',
  'Document optional HealthKit / Health Connect, media upload, notifications, support, privacy, terms, and data deletion behavior for reviewers',
];
const STORE_LAUNCH_DRY_RUN_ITEMS = [
  'Run the full signup, onboarding, challenge join, activity log, share, support, and restore/sync path as a release rehearsal',
  'Confirm validation credentials, sandbox/license-test evidence, entitlement recovery, support links, and data deletion resources are visible',
  'Record any missing evidence, failed checks, confusing copy, or support handoff gaps before paid access is promoted',
  'Keep the report copy-only until real App Store sandbox and Play license-test purchases prove the flow end to end',
];
const STORE_REVIEW_PACK_ITEMS = [
  'Draft App Store and Play reviewer notes with demo account context, free challenge flows, permission explanations, and support links',
  'Attach data safety, privacy, terms, data deletion, refund/support handoff, and restore/sync notes before submission',
  'Summarize sandbox/license-test evidence and entitlement QA gaps without claiming paid access is live',
  'Keep review preparation copy-only until products, credentials, policies, support links, restore flow, and entitlement QA are verified',
];
const STORE_SCREENSHOT_QA_ITEMS = [
  'Capture screenshots from seeded demo data only: onboarding, challenge tracker, logging, profile, support links, and free challenge flows',
  'Hide private member data, emails, purchase tokens, store credentials, service account JSON, and reviewer passwords from every screenshot',
  'Show paid surfaces as pending or review mode until sandbox/license-test evidence, receipt validation, restore, and entitlement QA are proven',
  'Confirm App Store and Play screenshot captions match current app behavior, privacy policy, support links, and data safety notes',
];
const STORE_TEST_PURCHASE_SESSION_PREP_ITEMS = [
  'Confirm getPurchaseValidationReadiness returns validation_configured for iOS and Android before any sandbox/license-test run',
  'Prepare one App Store sandbox tester and one Play license-test account outside git, screenshots, and public notes',
  'Run Pro monthly, Pro yearly, pack purchase, restore/sync, wrong-account, duplicate-restore, and negative-validation cases',
  'Export a sanitized reviewed evidence log and run node scripts/check-store-launch-readiness.js --evidence-log path/to/sanitized-store-evidence.json before paid launch review',
  'Record only reviewed evidence notes in storeTestPurchaseEvidence; never store raw purchase tokens, passwords, service account JSON, or private keys',
  'Keep paid access in review mode until evidence, entitlement writes, support handoff, and paid launch decision gate are reviewed',
];

const storeCatalog = [
  { id: 'com.risewiththetribe.pro.monthly', kind: 'subscription' },
  { id: 'com.risewiththetribe.pack.21_day_reset', kind: 'pack' },
];

const storeTestEvidenceSummary = {
  android: 1,
  failed: 0,
  ios: 1,
  minimumEvidence: {
    missingRequiredCases: ['ios_pro_restore'],
    missingSafeDenialPlatforms: ['android'],
    requiredCaseCount: 20,
    verifiedCaseCount: 18,
  },
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
      storeScreenshotQaItems: STORE_SCREENSHOT_QA_ITEMS,
      storeTestPurchaseSessionPrepItems: STORE_TEST_PURCHASE_SESSION_PREP_ITEMS,
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
      storeReviewResponseCopy: lifecycleCopy.storeReviewResponseCopy,
      storeReviewPackCopy: lifecycleCopy.storeReviewPackCopy,
      storeScreenshotQaCopy: lifecycleCopy.storeScreenshotQaCopy,
      storeTestPurchaseSessionPrepCopy: lifecycleCopy.storeTestPurchaseSessionPrepCopy,
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
    expect(lifecycleCopy.storeLaunchDryRunCopy).toContain('Minimum evidence matrix: 18/20 required proof items verified');
    expect(lifecycleCopy.storeLaunchDryRunCopy).toContain('Missing required cases: ios_pro_restore');
    expect(lifecycleCopy.storeLaunchDryRunCopy).toContain('Missing safe-denial platforms: android');
    expect(lifecycleCopy.storeTestPurchaseSessionPrepCopy).toContain('Store Test Purchase Session Prep Kit');
    expect(lifecycleCopy.storeTestPurchaseSessionPrepCopy).toContain('getPurchaseValidationReadiness returns validation_configured');
    expect(lifecycleCopy.storeTestPurchaseSessionPrepCopy).toContain('Minimum evidence matrix: 18/20 required proof items verified');
    expect(lifecycleCopy.storeTestPurchaseSessionPrepCopy).toContain('node scripts/check-store-launch-readiness.js --evidence-log');
    expect(lifecycleCopy.storeTestPurchaseSessionPrepCopy).toContain('Do not create fake purchase evidence');
    expect(lifecycleCopy.storeTestPurchaseSessionPrepCopy).toContain('store raw purchase tokens');
    expect(lifecycleCopy.storeReviewPackCopy).toContain('Store Review Pack');
    expect(lifecycleCopy.storeReviewPackCopy).toContain('Missing required cases: ios_pro_restore');
    expect(lifecycleCopy.storeReviewPackCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeScreenshotQaCopy).toContain('Store Screenshot QA Kit');
    expect(lifecycleCopy.storeScreenshotQaCopy).toContain('Missing safe-denial platforms: android');
    expect(lifecycleCopy.storeScreenshotQaCopy).toContain('synthetic demo account data only');
    expect(lifecycleCopy.storeScreenshotQaCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeScreenshotQaCopy).toContain('purchase tokens');
    expect(lifecycleCopy.storeScreenshotQaCopy).toContain('service account JSON');
    expect(cards.map(card => card.title)).toEqual([
      'SUBSCRIPTION MANAGEMENT GUIDANCE KIT',
      'BILLING SUPPORT ESCALATION KIT',
      'RENEWAL RECOVERY KIT',
      'CANCELLATION FEEDBACK KIT',
      'LAPSED MEMBER WINBACK KIT',
      'STORE LAUNCH DRY-RUN KIT',
      'STORE TEST PURCHASE SESSION PREP KIT',
      'STORE DEMO ACCOUNT KIT',
      'STORE SCREENSHOT QA KIT',
      'STORE REVIEW PACK',
      'STORE REVIEW RESPONSE KIT',
    ]);
  });
});
