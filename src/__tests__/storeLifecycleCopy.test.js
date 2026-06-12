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
const STORE_REVIEW_RESUBMISSION_ITEMS = [
  'Pair every App Review or Play rejection note with one owner, one policy area, one evidence gap, and one fix note',
  'Confirm the current build, demo account notes, permission explanations, screenshots, and support links match the resubmission reply',
  'Re-check sandbox/license-test evidence, restore/sync, entitlement recovery, and paid-launch decision status before sending updated notes',
  'Keep resubmission prep copy-only until the fixed build, reviewer notes, policies, and evidence packet are reviewed by a human',
];
const STORE_REVIEW_EVIDENCE_GAP_TRIAGE_ITEMS = [
  'Start with the minimum evidence matrix and list every missing purchase, restore, wrong-account, or safe-denial proof item',
  'Separate credential/setup gaps from product-copy gaps, screenshot gaps, demo-account gaps, and support/refund handoff gaps',
  'Assign one owner and one next proof action for each App Store sandbox or Play license-test gap before reviewer notes change',
  'Keep the triage notes internal until a human confirms evidence, policy wording, support links, and paid-launch gate status',
];
const STORE_REVIEW_EVIDENCE_GAP_DECISION_ITEMS = [
  'Approve only evidence gaps that have a named owner, a real proof path, and no paid-live or store-submission claim',
  'Wait when a sandbox/license-test action, restore/sync result, policy link, screenshot, or reviewer note is still being gathered',
  'Mark not-ready when the gap lacks product IDs, platform context, support/refund handoff, entitlement QA, or reviewed evidence notes',
  'Decline gaps that rely on fake proof, private data, credentials, purchase tokens, unreviewed screenshots, or pressure to resubmit',
];
const STORE_REVIEW_POLICY_LINK_QA_ITEMS = [
  'Open every public policy, support, and data-deletion link from the exact reviewer notes before resubmission',
  'Confirm permission explanations match the current build for media uploads, notifications, optional health sync, purchases, restore/sync, and account deletion',
  'Check that reviewer notes point to marketplace refund/support paths without promising in-app refunds, manual entitlements, or paid access',
  'Keep policy-link QA copy-only until the fixed build, data safety notes, screenshots, support handoff, and evidence packet are reviewed',
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
const STORE_EVIDENCE_ARCHIVE_ITEMS = [
  'Save the sanitized evidence export and --json audit output in the internal release packet after human review',
  'Record the release candidate build, reviewer, reviewedAt timestamp, missing matrix cases, and missing safe-denial platforms',
  'Attach only aggregate evidence status to App Store / Play review notes; keep tester aliases, tokens, transaction IDs, and private screenshots internal',
  'Re-run the archive checklist whenever product IDs, validation credentials, entitlement writes, restore/sync behavior, or support handoff copy changes',
];
const STORE_EVIDENCE_EXPORT_TEMPLATE_ITEMS = [
  'Start from the sanitized JSON template before every App Store sandbox or Play license-test session',
  'Create one record per platform, productId, testCase, result, evidenceNote, reviewNote, and reviewedAt value after real evidence is reviewed',
  'Use placeholder-safe notes until a real sandbox/license-test action has happened and never invent verified evidence',
  'Run the exported file through node scripts/check-store-launch-readiness.js --evidence-log path/to/sanitized-store-evidence.json --json before archiving',
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
      storeEvidenceArchiveItems: STORE_EVIDENCE_ARCHIVE_ITEMS,
      storeEvidenceExportTemplateItems: STORE_EVIDENCE_EXPORT_TEMPLATE_ITEMS,
      storeLaunchDryRunItems: STORE_LAUNCH_DRY_RUN_ITEMS,
      storeReviewPackItems: STORE_REVIEW_PACK_ITEMS,
      storeReviewEvidenceGapDecisionItems: STORE_REVIEW_EVIDENCE_GAP_DECISION_ITEMS,
      storeReviewEvidenceGapTriageItems: STORE_REVIEW_EVIDENCE_GAP_TRIAGE_ITEMS,
      storeReviewPolicyLinkQaItems: STORE_REVIEW_POLICY_LINK_QA_ITEMS,
      storeReviewResubmissionItems: STORE_REVIEW_RESUBMISSION_ITEMS,
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
      storeEvidenceArchiveCopy: lifecycleCopy.storeEvidenceArchiveCopy,
      storeEvidenceExportTemplateCopy: lifecycleCopy.storeEvidenceExportTemplateCopy,
      storeLaunchDryRunCopy: lifecycleCopy.storeLaunchDryRunCopy,
      storeReviewResponseCopy: lifecycleCopy.storeReviewResponseCopy,
      storeReviewEvidenceGapDecisionCopy: lifecycleCopy.storeReviewEvidenceGapDecisionCopy,
      storeReviewEvidenceGapTriageCopy: lifecycleCopy.storeReviewEvidenceGapTriageCopy,
      storeReviewPolicyLinkQaCopy: lifecycleCopy.storeReviewPolicyLinkQaCopy,
      storeReviewResubmissionCopy: lifecycleCopy.storeReviewResubmissionCopy,
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
    expect(lifecycleCopy.storeTestPurchaseSessionPrepCopy).toContain('platform, productId, testCase, result, evidenceNote, reviewNote, and reviewedAt');
    expect(lifecycleCopy.storeTestPurchaseSessionPrepCopy).toContain('--json and archive the output with the internal release packet');
    expect(lifecycleCopy.storeTestPurchaseSessionPrepCopy).toContain('Do not create fake purchase evidence');
    expect(lifecycleCopy.storeTestPurchaseSessionPrepCopy).toContain('export transaction IDs');
    expect(lifecycleCopy.storeTestPurchaseSessionPrepCopy).toContain('store raw purchase tokens');
    expect(lifecycleCopy.storeEvidenceArchiveCopy).toContain('Store Evidence Archive Kit');
    expect(lifecycleCopy.storeEvidenceArchiveCopy).toContain('Archive readiness brief');
    expect(lifecycleCopy.storeEvidenceArchiveCopy).toContain('evidenceReady, verifiedCaseCount, missingRequiredCases, and missingSafeDenialPlatforms');
    expect(lifecycleCopy.storeEvidenceArchiveCopy).toContain('internal release packet');
    expect(lifecycleCopy.storeEvidenceArchiveCopy).toContain('Do not create fake evidence');
    expect(lifecycleCopy.storeEvidenceArchiveCopy).toContain('treat archived evidence as final launch approval');
    expect(lifecycleCopy.storeEvidenceExportTemplateCopy).toContain('Store Evidence Export Template Kit');
    expect(lifecycleCopy.storeEvidenceExportTemplateCopy).toContain('Sanitized JSON template');
    expect(lifecycleCopy.storeEvidenceExportTemplateCopy).toContain('"platform": "ios"');
    expect(lifecycleCopy.storeEvidenceExportTemplateCopy).toContain('"result": "needs_review"');
    expect(lifecycleCopy.storeEvidenceExportTemplateCopy).toContain('Keep only platform, productId, testCase, result, evidenceNote, reviewNote, and reviewedAt fields');
    expect(lifecycleCopy.storeEvidenceExportTemplateCopy).toContain('treat a template record as verified evidence');
    expect(lifecycleCopy.storeReviewPackCopy).toContain('Store Review Pack');
    expect(lifecycleCopy.storeReviewPackCopy).toContain('Missing required cases: ios_pro_restore');
    expect(lifecycleCopy.storeReviewPackCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeScreenshotQaCopy).toContain('Store Screenshot QA Kit');
    expect(lifecycleCopy.storeScreenshotQaCopy).toContain('Missing safe-denial platforms: android');
    expect(lifecycleCopy.storeScreenshotQaCopy).toContain('synthetic demo account data only');
    expect(lifecycleCopy.storeScreenshotQaCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeScreenshotQaCopy).toContain('purchase tokens');
    expect(lifecycleCopy.storeScreenshotQaCopy).toContain('service account JSON');
    expect(lifecycleCopy.storeReviewEvidenceGapTriageCopy).toContain('Store Review Evidence Gap Triage Kit');
    expect(lifecycleCopy.storeReviewEvidenceGapTriageCopy).toContain('Start with the minimum evidence matrix');
    expect(lifecycleCopy.storeReviewEvidenceGapTriageCopy).toContain('Manual evidence-gap triage');
    expect(lifecycleCopy.storeReviewEvidenceGapTriageCopy).toContain('credentials or sandbox/license-test proof still pending');
    expect(lifecycleCopy.storeReviewEvidenceGapTriageCopy).toContain('Missing required cases: ios_pro_restore');
    expect(lifecycleCopy.storeReviewEvidenceGapTriageCopy).toContain('Missing safe-denial platforms: android');
    expect(lifecycleCopy.storeReviewEvidenceGapTriageCopy).toContain('Do not create fake evidence');
    expect(lifecycleCopy.storeReviewEvidenceGapTriageCopy).toContain('submit store review');
    expect(lifecycleCopy.storeReviewEvidenceGapTriageCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewEvidenceGapTriageCopy).toContain('export transaction IDs');
    expect(lifecycleCopy.storeReviewEvidenceGapTriageCopy).toContain('unlock paid access');
    expect(lifecycleCopy.storeReviewEvidenceGapTriageCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewEvidenceGapTriageCopy).toContain('claim sandbox/license-test proof without evidence');
    expect(lifecycleCopy.storeReviewEvidenceGapTriageCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewEvidenceGapDecisionCopy).toContain('Store Review Evidence Gap Decision Reply Kit');
    expect(lifecycleCopy.storeReviewEvidenceGapDecisionCopy).toContain('Approve only evidence gaps');
    expect(lifecycleCopy.storeReviewEvidenceGapDecisionCopy).toContain('Manual evidence-gap decision replies');
    expect(lifecycleCopy.storeReviewEvidenceGapDecisionCopy).toContain('APPROVED FOR GAP WORK');
    expect(lifecycleCopy.storeReviewEvidenceGapDecisionCopy).toContain('WAITING ON PROOF');
    expect(lifecycleCopy.storeReviewEvidenceGapDecisionCopy).toContain('NOT READY FOR REVIEW NOTES');
    expect(lifecycleCopy.storeReviewEvidenceGapDecisionCopy).toContain('DECLINED FOR RESUBMISSION');
    expect(lifecycleCopy.storeReviewEvidenceGapDecisionCopy).toContain('Missing required cases: ios_pro_restore');
    expect(lifecycleCopy.storeReviewEvidenceGapDecisionCopy).toContain('Do not create fake evidence');
    expect(lifecycleCopy.storeReviewEvidenceGapDecisionCopy).toContain('submit store review');
    expect(lifecycleCopy.storeReviewEvidenceGapDecisionCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewEvidenceGapDecisionCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewEvidenceGapDecisionCopy).toContain('claim review approval');
    expect(lifecycleCopy.storeReviewEvidenceGapDecisionCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewEvidenceGapDecisionCopy).toContain('auto-message users');
    expect(lifecycleCopy.storeReviewPolicyLinkQaCopy).toContain('Store Review Policy Link QA Kit');
    expect(lifecycleCopy.storeReviewPolicyLinkQaCopy).toContain('Open every public policy');
    expect(lifecycleCopy.storeReviewPolicyLinkQaCopy).toContain('Manual policy-link QA checklist');
    expect(lifecycleCopy.storeReviewPolicyLinkQaCopy).toContain('Privacy, Support');
    expect(lifecycleCopy.storeReviewPolicyLinkQaCopy).toContain('optional HealthKit / Health Connect');
    expect(lifecycleCopy.storeReviewPolicyLinkQaCopy).toContain('purchase validation');
    expect(lifecycleCopy.storeReviewPolicyLinkQaCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeReviewPolicyLinkQaCopy).toContain('store reviewer passwords');
    expect(lifecycleCopy.storeReviewPolicyLinkQaCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewPolicyLinkQaCopy).toContain('publish private policy drafts');
    expect(lifecycleCopy.storeReviewPolicyLinkQaCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewPolicyLinkQaCopy).toContain('claim sandbox/license-test proof without evidence');
    expect(lifecycleCopy.storeReviewPolicyLinkQaCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewPolicyLinkQaCopy).toContain('auto-message users');
    expect(lifecycleCopy.storeReviewResubmissionCopy).toContain('Store Review Resubmission Readiness Kit');
    expect(lifecycleCopy.storeReviewResubmissionCopy).toContain('Pair every App Review or Play rejection note');
    expect(lifecycleCopy.storeReviewResubmissionCopy).toContain('Manual resubmission checklist');
    expect(lifecycleCopy.storeReviewResubmissionCopy).toContain('Missing required cases: ios_pro_restore');
    expect(lifecycleCopy.storeReviewResubmissionCopy).toContain('App Store Connect / Play Console review notes');
    expect(lifecycleCopy.storeReviewResubmissionCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeReviewResubmissionCopy).toContain('store reviewer passwords');
    expect(lifecycleCopy.storeReviewResubmissionCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewResubmissionCopy).toContain('unlock paid access');
    expect(lifecycleCopy.storeReviewResubmissionCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewResubmissionCopy).toContain('create purchases');
    expect(lifecycleCopy.storeReviewResubmissionCopy).toContain('claim review approval');
    expect(lifecycleCopy.storeReviewResubmissionCopy).toContain('mark paid access live');
    expect(cards.map(card => card.title)).toEqual([
      'SUBSCRIPTION MANAGEMENT GUIDANCE KIT',
      'BILLING SUPPORT ESCALATION KIT',
      'RENEWAL RECOVERY KIT',
      'CANCELLATION FEEDBACK KIT',
      'LAPSED MEMBER WINBACK KIT',
      'STORE LAUNCH DRY-RUN KIT',
      'STORE TEST PURCHASE SESSION PREP KIT',
      'STORE EVIDENCE ARCHIVE KIT',
      'STORE EVIDENCE EXPORT TEMPLATE KIT',
      'STORE DEMO ACCOUNT KIT',
      'STORE SCREENSHOT QA KIT',
      'STORE REVIEW PACK',
      'STORE REVIEW RESPONSE KIT',
      'STORE REVIEW EVIDENCE GAP TRIAGE KIT',
      'STORE REVIEW EVIDENCE GAP DECISION REPLY KIT',
      'STORE REVIEW POLICY LINK QA KIT',
      'STORE REVIEW RESUBMISSION READINESS KIT',
    ]);
  });
});
