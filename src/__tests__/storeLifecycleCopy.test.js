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
const STORE_REVIEW_REJECTION_ROOT_CAUSE_ITEMS = [
  'Classify each App Review or Play feedback item as demo access, permission wording, purchase/restore evidence, metadata, screenshot, privacy, support, or paid-access claim',
  'Map every rejection reason to one fixed build owner, one reviewer-note change, one evidence packet item, and one policy or support link',
  'Separate real app defects from reviewer-note gaps so product fixes, policy copy, screenshots, and evidence updates do not blur together',
  'Keep root-cause notes internal until a human confirms the fixed build, public policy links, and evidence packet are ready for resubmission prep',
];
const STORE_REVIEWER_REPLY_PACKET_ITEMS = [
  'Assemble the final reviewer reply from the confirmed root cause, fixed build note, evidence packet, policy links, and support handoff',
  'Keep the reply factual, build-specific, and limited to reviewed proof for demo access, permissions, purchase/restore, privacy, or support questions',
  'Add screenshot/caption, metadata, data safety, and reviewer-note changes only after the owner confirms they match the current build',
  'Hold the packet internally until a human confirms no credentials, personal data, purchase tokens, or paid-access claims are included',
];
const STORE_REVIEW_METADATA_DIFF_ITEMS = [
  'Compare App Store and Play listing text, screenshots, captions, permission explanations, and reviewer notes against the fixed build',
  'Flag every mismatch between metadata, data safety, privacy links, support links, purchase/restore behavior, and current app screens',
  'Assign one owner for each metadata, screenshot/caption, policy-link, data-safety, or reviewer-note change before resubmission prep',
  'Keep the diff internal until public listing copy, screenshots, policy links, evidence notes, and support handoff are reviewed together',
];
const STORE_REVIEW_DATA_SAFETY_ALIGNMENT_ITEMS = [
  'Match App Privacy and Play Data Safety answers to the current build for auth, profile, activity, optional health sync, media, purchases, support, and deletion',
  'Confirm permission explanations, policy links, reviewer notes, and screenshots describe the same data use without adding new collection claims',
  'Assign one owner for each privacy-label, data-safety, permission, support, deletion, purchase-validation, or screenshot mismatch before resubmission prep',
  'Keep alignment notes internal until public policy links, data safety answers, reviewer notes, and evidence packet references are reviewed together',
];
const STORE_REVIEW_PERMISSION_COPY_CHECK_ITEMS = [
  'Check reviewer-note language for optional HealthKit / Health Connect, media uploads, notifications, purchase validation, restore/sync, support, and account deletion',
  'Match every permission explanation to the current build, screenshot captions, policy links, and data-safety answers before resubmission prep',
  'Remove wording that implies required health access, automatic posting, medical outcomes, live paid access, or unreviewed purchase evidence',
  'Keep permission-copy notes internal until the fixed build, public policies, screenshot captions, and reviewer reply packet are reviewed together',
];
const STORE_REVIEW_DEMO_ACCESS_QA_ITEMS = [
  'Confirm reviewer demo access instructions point to one reviewed account shared only through App Store Connect or Play Console notes',
  'Check seeded free flows for onboarding, joined challenge, activity history, badges, share cards, support links, and Feature Me consent examples',
  'Verify paid surfaces stay in review mode unless sandbox/license-test purchase, restore, validation, and entitlement evidence is reviewed',
  'Keep demo-access QA internal until credentials, screenshots, policy links, support handoff, and reviewer notes are checked by a human',
];
const STORE_REVIEW_SUPPORT_HANDOFF_QA_ITEMS = [
  'Confirm reviewer notes route refunds, cancellations, failed renewals, duplicate charges, and billing disputes to App Store or Google Play support',
  'Check support, entitlement recovery, restore/sync, account deletion, privacy, terms, and data deletion links before resubmission prep',
  'Separate marketplace support handoff from in-app support so reviewer notes do not promise refunds, manual entitlements, or paid access',
  'Keep support-handoff QA internal until support owner, policy-link owner, evidence owner, and reviewer-note owner sign off',
];
const STORE_REVIEW_EVIDENCE_PACKET_INDEX_ITEMS = [
  'Create one internal index for reviewed product IDs, sandbox/license-test evidence, restore/sync results, policy links, screenshots, and reviewer-note owners',
  'Separate verified evidence, safe-denial evidence, needs-review gaps, failed checks, and archived proof before reviewer notes are copied',
  'Link every index row to a sanitized evidence note, fixed build reference, support handoff, policy URL, screenshot/caption owner, and reviewedAt value',
  'Keep the packet index internal until evidence owner, policy-link owner, support owner, and resubmission owner confirm it matches the fixed build',
];
const STORE_REVIEW_FINAL_SIGNOFF_ITEMS = [
  'Confirm fixed build, reviewer reply, evidence packet index, policy links, data safety, demo access, screenshots, metadata, and support handoff are all reviewed',
  'Require one named owner for build readiness, evidence, policy links, support routing, data safety, screenshots, metadata, and reviewer-note copy',
  'Hold resubmission if sandbox/license-test proof, restore/sync, safe-denial coverage, demo access, policy links, or support handoff still needs review',
  'Keep final sign-off internal until a human confirms the packet is ready for console work without paid-live claims or credential exposure',
];
const STORE_REVIEW_CONSOLE_DRAFT_QA_ITEMS = [
  'Check App Store Connect and Play Console draft fields against the final sign-off packet before any reviewer notes are pasted',
  'Confirm reviewer reply, demo access notes, metadata, screenshots, data safety, policy links, support handoff, and evidence summary match the fixed build',
  'Flag draft mismatches for owner review instead of editing console fields from client code or claiming submission readiness',
  'Keep console-draft QA internal until a human confirms no credentials, purchase tokens, private data, or paid-live claims are present',
];
const STORE_REVIEW_SUBMISSION_HOLD_REASONS_ITEMS = [
  'Classify every hold as evidence gap, policy/data-safety mismatch, demo-access issue, support handoff gap, metadata drift, console draft mismatch, missing final sign-off, or paid-live claim risk',
  'Attach each hold reason to one owner, one missing proof path, one reviewer-note impact, and one clear unblock condition before console work continues',
  'Keep hold notes separate from reviewer-facing copy so internal gaps do not become public store metadata or submission claims',
  'Release a hold only after reviewed evidence, policy links, support handoff, demo access, metadata, console draft, and final sign-off all match the fixed build',
];
const STORE_REVIEW_HOLD_RELEASE_DECISION_ITEMS = [
  'Approve hold release only when the missing proof path, reviewer-note impact, evidence packet row, and fixed-build reference are reviewed together',
  'Wait when policy links, data safety answers, support routing, demo access, screenshots, metadata, or console draft fields still need owner confirmation',
  'Mark not-ready when the hold still lacks a named owner, unblock condition, reviewed evidence, or safe-denial coverage for the affected platform',
  'Decline release requests that depend on fake proof, private credentials, purchase tokens, public metadata claims, paid-live claims, or pressure to resubmit',
];
const STORE_REVIEW_RESUBMISSION_PACKET_QA_ITEMS = [
  'Compare the fixed build, hold-release decisions, reviewer reply, evidence packet, policy links, support handoff, screenshots, metadata, demo access, and data safety before reviewer notes are pasted',
  'Confirm every released hold has a matching evidence packet row, reviewer-note impact, policy/support link, fixed-build reference, and owner sign-off',
  'Flag mismatches between console draft fields, public metadata, screenshots, permission copy, data safety, support routing, and reviewer-facing reply language',
  'Keep the packet QA internal until resubmission owner confirms no credentials, purchase tokens, private data, paid-live claims, or approval claims are present',
];
const STORE_REVIEW_RESUBMISSION_DECISION_REPLY_ITEMS = [
  'Approve resubmission prep only when packet QA, hold-release decisions, final sign-off, console draft QA, evidence packet, policy links, support handoff, and fixed-build notes agree',
  'Wait when reviewer notes, screenshots, metadata, data safety, demo access, permission copy, support routing, or evidence rows still need owner confirmation',
  'Mark not-ready when released holds are missing proof, packet QA found mismatches, safe-denial coverage is incomplete, or the fixed build is not confirmed',
  'Decline resubmission requests that rely on unreviewed proof, private data, credentials, purchase tokens, paid-live claims, approval claims, or pressure to move faster than evidence',
];
const STORE_REVIEW_REVIEWER_NOTES_PASTE_QA_ITEMS = [
  'Compare the final reviewer notes against resubmission decision replies, packet QA, fixed-build notes, evidence packet rows, policy links, support handoff, demo access, screenshots, metadata, and data safety before pasting',
  'Confirm reviewer-facing language is factual, build-specific, and limited to reviewed proof without credentials, purchase tokens, private data, paid-live claims, or approval claims',
  'Flag any mismatch between App Store Connect notes, Play Console notes, public metadata, screenshots, permission copy, support routing, and evidence packet references',
  'Keep paste QA internal until the resubmission owner confirms the exact notes are ready for human console work',
];
const STORE_REVIEW_CONSOLE_SUBMISSION_CHECKLIST_ITEMS = [
  'Confirm App Store Connect and Play Console drafts match reviewer-note paste QA, resubmission decisions, packet QA, fixed-build notes, evidence rows, policy links, support handoff, demo access, screenshots, metadata, and data safety',
  'Verify the human console owner has checked version/build number, reviewer notes, test instructions, screenshots, privacy/data safety answers, support URLs, and contact details before submission',
  'Hold submission if any credential, purchase token, order ID, transaction ID, private user data, draft-only link, paid-live claim, approval claim, or unreviewed proof remains',
  'Keep the checklist internal until the console owner confirms submission readiness outside client code',
];
const STORE_REVIEW_SUBMISSION_STATUS_WATCH_ITEMS = [
  'Track App Store Connect and Play Console review states after a human submits, including waiting for review, in review, rejected, approved, metadata rejected, and action required',
  'Match every status note to the submitted build, reviewer notes, evidence packet, policy links, support handoff, screenshots, metadata, data safety, and console submission checklist',
  'Route rejection, metadata rejection, or action-required states back to root cause, hold reasons, packet QA, reviewer notes paste QA, and resubmission decision replies before any follow-up',
  'Keep status watch internal until a human confirms the console state without exposing credentials, private data, purchase tokens, paid-live claims, or approval claims',
];
const STORE_REVIEW_OUTCOME_HANDOFF_ITEMS = [
  'Route approved, rejected, metadata rejected, action required, in review, waiting for review, and needs-owner-review outcomes to the right internal owner before any public follow-up',
  'For approved states, confirm paid launch gate, entitlement QA, store evidence, support handoff, policy links, and launch messaging before any paid-live or approval language is used',
  'For rejected, metadata rejected, or action-required states, reopen root cause, hold reasons, packet QA, reviewer notes paste QA, and resubmission decision replies before changing reviewer-facing copy',
  'Keep outcome handoff internal until a human confirms the console state, owner, next action, and evidence reference without exposing credentials, private data, purchase tokens, or approval claims',
];
const STORE_REVIEW_LAUNCH_COMMUNICATION_HOLD_ITEMS = [
  'Hold public launch, support, email, social, referral, partner, and paid-access messaging until store outcome, paid launch gate, entitlement QA, and evidence archive are reviewed together',
  'For approved outcomes, route launch wording through final release owner, support owner, policy-link owner, and marketing owner before saying paid access, Pro, or packs are available',
  'For rejected, metadata rejected, action-required, in-review, waiting-for-review, or unclear outcomes, keep communication internal and route back to outcome handoff, status watch, or resubmission prep',
  'Record channel, owner, approved wording, evidence reference, reviewedAt timestamp, and remaining hold reason without exposing credentials, private data, purchase tokens, or approval claims',
];
const STORE_REVIEW_LAUNCH_MESSAGE_QA_ITEMS = [
  'Compare exact public launch, support, email, social, referral, partner, paid-access, Pro, and pack wording against the approved launch communication hold record',
  'Confirm every message names only reviewed features, current product IDs, policy links, support boundaries, and availability states that match the paid launch gate',
  'Remove wording that implies store approval, paid access, Pro, packs, refunds, health outcomes, creator payouts, partner perks, or discounts before those surfaces are actually live',
  'Record channel owner, approved wording, evidence reference, reviewedAt timestamp, scheduled window, and rollback note before any human publishes or sends the message',
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
      storeReviewRejectionRootCauseItems: STORE_REVIEW_REJECTION_ROOT_CAUSE_ITEMS,
      storeReviewerReplyPacketItems: STORE_REVIEWER_REPLY_PACKET_ITEMS,
      storeReviewMetadataDiffItems: STORE_REVIEW_METADATA_DIFF_ITEMS,
      storeReviewDataSafetyAlignmentItems: STORE_REVIEW_DATA_SAFETY_ALIGNMENT_ITEMS,
      storeReviewPermissionCopyCheckItems: STORE_REVIEW_PERMISSION_COPY_CHECK_ITEMS,
      storeReviewDemoAccessQaItems: STORE_REVIEW_DEMO_ACCESS_QA_ITEMS,
      storeReviewSupportHandoffQaItems: STORE_REVIEW_SUPPORT_HANDOFF_QA_ITEMS,
      storeReviewEvidencePacketIndexItems: STORE_REVIEW_EVIDENCE_PACKET_INDEX_ITEMS,
      storeReviewFinalSignoffItems: STORE_REVIEW_FINAL_SIGNOFF_ITEMS,
      storeReviewConsoleDraftQaItems: STORE_REVIEW_CONSOLE_DRAFT_QA_ITEMS,
      storeReviewSubmissionHoldReasonsItems: STORE_REVIEW_SUBMISSION_HOLD_REASONS_ITEMS,
      storeReviewHoldReleaseDecisionItems: STORE_REVIEW_HOLD_RELEASE_DECISION_ITEMS,
      storeReviewResubmissionPacketQaItems: STORE_REVIEW_RESUBMISSION_PACKET_QA_ITEMS,
      storeReviewResubmissionDecisionReplyItems: STORE_REVIEW_RESUBMISSION_DECISION_REPLY_ITEMS,
      storeReviewReviewerNotesPasteQaItems: STORE_REVIEW_REVIEWER_NOTES_PASTE_QA_ITEMS,
      storeReviewConsoleSubmissionChecklistItems: STORE_REVIEW_CONSOLE_SUBMISSION_CHECKLIST_ITEMS,
      storeReviewSubmissionStatusWatchItems: STORE_REVIEW_SUBMISSION_STATUS_WATCH_ITEMS,
      storeReviewOutcomeHandoffItems: STORE_REVIEW_OUTCOME_HANDOFF_ITEMS,
      storeReviewLaunchCommunicationHoldItems: STORE_REVIEW_LAUNCH_COMMUNICATION_HOLD_ITEMS,
      storeReviewLaunchMessageQaItems: STORE_REVIEW_LAUNCH_MESSAGE_QA_ITEMS,
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
      storeReviewRejectionRootCauseCopy: lifecycleCopy.storeReviewRejectionRootCauseCopy,
      storeReviewerReplyPacketCopy: lifecycleCopy.storeReviewerReplyPacketCopy,
      storeReviewMetadataDiffCopy: lifecycleCopy.storeReviewMetadataDiffCopy,
      storeReviewDataSafetyAlignmentCopy: lifecycleCopy.storeReviewDataSafetyAlignmentCopy,
      storeReviewPermissionCopyCheckCopy: lifecycleCopy.storeReviewPermissionCopyCheckCopy,
      storeReviewDemoAccessQaCopy: lifecycleCopy.storeReviewDemoAccessQaCopy,
      storeReviewSupportHandoffQaCopy: lifecycleCopy.storeReviewSupportHandoffQaCopy,
      storeReviewEvidencePacketIndexCopy: lifecycleCopy.storeReviewEvidencePacketIndexCopy,
      storeReviewFinalSignoffCopy: lifecycleCopy.storeReviewFinalSignoffCopy,
      storeReviewConsoleDraftQaCopy: lifecycleCopy.storeReviewConsoleDraftQaCopy,
      storeReviewSubmissionHoldReasonsCopy: lifecycleCopy.storeReviewSubmissionHoldReasonsCopy,
      storeReviewHoldReleaseDecisionCopy: lifecycleCopy.storeReviewHoldReleaseDecisionCopy,
      storeReviewResubmissionPacketQaCopy: lifecycleCopy.storeReviewResubmissionPacketQaCopy,
      storeReviewResubmissionDecisionReplyCopy: lifecycleCopy.storeReviewResubmissionDecisionReplyCopy,
      storeReviewReviewerNotesPasteQaCopy: lifecycleCopy.storeReviewReviewerNotesPasteQaCopy,
      storeReviewConsoleSubmissionChecklistCopy: lifecycleCopy.storeReviewConsoleSubmissionChecklistCopy,
      storeReviewSubmissionStatusWatchCopy: lifecycleCopy.storeReviewSubmissionStatusWatchCopy,
      storeReviewOutcomeHandoffCopy: lifecycleCopy.storeReviewOutcomeHandoffCopy,
      storeReviewLaunchCommunicationHoldCopy: lifecycleCopy.storeReviewLaunchCommunicationHoldCopy,
      storeReviewLaunchMessageQaCopy: lifecycleCopy.storeReviewLaunchMessageQaCopy,
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
    expect(lifecycleCopy.storeReviewRejectionRootCauseCopy).toContain('Store Review Rejection Root Cause Kit');
    expect(lifecycleCopy.storeReviewRejectionRootCauseCopy).toContain('Classify each App Review or Play feedback item');
    expect(lifecycleCopy.storeReviewRejectionRootCauseCopy).toContain('Manual root-cause checklist');
    expect(lifecycleCopy.storeReviewRejectionRootCauseCopy).toContain('demo access, permission wording, IAP/purchase evidence');
    expect(lifecycleCopy.storeReviewRejectionRootCauseCopy).toContain('fixed build owner');
    expect(lifecycleCopy.storeReviewRejectionRootCauseCopy).toContain('sanitized evidence packet');
    expect(lifecycleCopy.storeReviewRejectionRootCauseCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeReviewRejectionRootCauseCopy).toContain('store reviewer passwords');
    expect(lifecycleCopy.storeReviewRejectionRootCauseCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewRejectionRootCauseCopy).toContain('publish private policy drafts');
    expect(lifecycleCopy.storeReviewRejectionRootCauseCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewRejectionRootCauseCopy).toContain('claim sandbox/license-test proof without evidence');
    expect(lifecycleCopy.storeReviewRejectionRootCauseCopy).toContain('claim review approval');
    expect(lifecycleCopy.storeReviewRejectionRootCauseCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewRejectionRootCauseCopy).toContain('auto-message users');
    expect(lifecycleCopy.storeReviewerReplyPacketCopy).toContain('Store Reviewer Reply Packet Kit');
    expect(lifecycleCopy.storeReviewerReplyPacketCopy).toContain('Assemble the final reviewer reply');
    expect(lifecycleCopy.storeReviewerReplyPacketCopy).toContain('Manual reviewer reply packet checklist');
    expect(lifecycleCopy.storeReviewerReplyPacketCopy).toContain('fixed build reference');
    expect(lifecycleCopy.storeReviewerReplyPacketCopy).toContain('sanitized evidence packet location');
    expect(lifecycleCopy.storeReviewerReplyPacketCopy).toContain('policy URLs');
    expect(lifecycleCopy.storeReviewerReplyPacketCopy).toContain('support owner sign off');
    expect(lifecycleCopy.storeReviewerReplyPacketCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeReviewerReplyPacketCopy).toContain('store reviewer passwords');
    expect(lifecycleCopy.storeReviewerReplyPacketCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewerReplyPacketCopy).toContain('include order IDs');
    expect(lifecycleCopy.storeReviewerReplyPacketCopy).toContain('include transaction IDs');
    expect(lifecycleCopy.storeReviewerReplyPacketCopy).toContain('publish private policy drafts');
    expect(lifecycleCopy.storeReviewerReplyPacketCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewerReplyPacketCopy).toContain('claim sandbox/license-test proof without evidence');
    expect(lifecycleCopy.storeReviewerReplyPacketCopy).toContain('claim review approval');
    expect(lifecycleCopy.storeReviewerReplyPacketCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewerReplyPacketCopy).toContain('auto-message users');
    expect(lifecycleCopy.storeReviewMetadataDiffCopy).toContain('Store Review Metadata Diff Kit');
    expect(lifecycleCopy.storeReviewMetadataDiffCopy).toContain('Compare App Store and Play listing text');
    expect(lifecycleCopy.storeReviewMetadataDiffCopy).toContain('Manual metadata diff checklist');
    expect(lifecycleCopy.storeReviewMetadataDiffCopy).toContain('title, subtitle, short description');
    expect(lifecycleCopy.storeReviewMetadataDiffCopy).toContain('screenshot captions');
    expect(lifecycleCopy.storeReviewMetadataDiffCopy).toContain('data-safety text');
    expect(lifecycleCopy.storeReviewMetadataDiffCopy).toContain('support/refund handoff');
    expect(lifecycleCopy.storeReviewMetadataDiffCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeReviewMetadataDiffCopy).toContain('publish unreviewed store metadata');
    expect(lifecycleCopy.storeReviewMetadataDiffCopy).toContain('store reviewer passwords');
    expect(lifecycleCopy.storeReviewMetadataDiffCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewMetadataDiffCopy).toContain('include order IDs');
    expect(lifecycleCopy.storeReviewMetadataDiffCopy).toContain('include transaction IDs');
    expect(lifecycleCopy.storeReviewMetadataDiffCopy).toContain('publish private policy drafts');
    expect(lifecycleCopy.storeReviewMetadataDiffCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewMetadataDiffCopy).toContain('claim sandbox/license-test proof without evidence');
    expect(lifecycleCopy.storeReviewMetadataDiffCopy).toContain('claim review approval');
    expect(lifecycleCopy.storeReviewMetadataDiffCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewMetadataDiffCopy).toContain('auto-message users');
    expect(lifecycleCopy.storeReviewDataSafetyAlignmentCopy).toContain('Store Review Data Safety Alignment Kit');
    expect(lifecycleCopy.storeReviewDataSafetyAlignmentCopy).toContain('Match App Privacy and Play Data Safety answers');
    expect(lifecycleCopy.storeReviewDataSafetyAlignmentCopy).toContain('Manual data safety alignment checklist');
    expect(lifecycleCopy.storeReviewDataSafetyAlignmentCopy).toContain('optional HealthKit / Health Connect sync');
    expect(lifecycleCopy.storeReviewDataSafetyAlignmentCopy).toContain('purchase validation');
    expect(lifecycleCopy.storeReviewDataSafetyAlignmentCopy).toContain('account/data deletion');
    expect(lifecycleCopy.storeReviewDataSafetyAlignmentCopy).toContain('privacy policy, terms, support, data deletion');
    expect(lifecycleCopy.storeReviewDataSafetyAlignmentCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeReviewDataSafetyAlignmentCopy).toContain('publish unreviewed privacy labels');
    expect(lifecycleCopy.storeReviewDataSafetyAlignmentCopy).toContain('publish unreviewed data safety answers');
    expect(lifecycleCopy.storeReviewDataSafetyAlignmentCopy).toContain('store reviewer passwords');
    expect(lifecycleCopy.storeReviewDataSafetyAlignmentCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewDataSafetyAlignmentCopy).toContain('include order IDs');
    expect(lifecycleCopy.storeReviewDataSafetyAlignmentCopy).toContain('include transaction IDs');
    expect(lifecycleCopy.storeReviewDataSafetyAlignmentCopy).toContain('publish private policy drafts');
    expect(lifecycleCopy.storeReviewDataSafetyAlignmentCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewDataSafetyAlignmentCopy).toContain('claim sandbox/license-test proof without evidence');
    expect(lifecycleCopy.storeReviewDataSafetyAlignmentCopy).toContain('claim review approval');
    expect(lifecycleCopy.storeReviewDataSafetyAlignmentCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewDataSafetyAlignmentCopy).toContain('auto-message users');
    expect(lifecycleCopy.storeReviewPermissionCopyCheckCopy).toContain('Store Review Permission Copy Check Kit');
    expect(lifecycleCopy.storeReviewPermissionCopyCheckCopy).toContain('Check reviewer-note language');
    expect(lifecycleCopy.storeReviewPermissionCopyCheckCopy).toContain('Manual permission copy checklist');
    expect(lifecycleCopy.storeReviewPermissionCopyCheckCopy).toContain('optional HealthKit / Health Connect');
    expect(lifecycleCopy.storeReviewPermissionCopyCheckCopy).toContain('media uploads');
    expect(lifecycleCopy.storeReviewPermissionCopyCheckCopy).toContain('notifications');
    expect(lifecycleCopy.storeReviewPermissionCopyCheckCopy).toContain('purchase validation');
    expect(lifecycleCopy.storeReviewPermissionCopyCheckCopy).toContain('account deletion');
    expect(lifecycleCopy.storeReviewPermissionCopyCheckCopy).toContain('health sync is required');
    expect(lifecycleCopy.storeReviewPermissionCopyCheckCopy).toContain('medical results are promised');
    expect(lifecycleCopy.storeReviewPermissionCopyCheckCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeReviewPermissionCopyCheckCopy).toContain('publish unreviewed permission copy');
    expect(lifecycleCopy.storeReviewPermissionCopyCheckCopy).toContain('store reviewer passwords');
    expect(lifecycleCopy.storeReviewPermissionCopyCheckCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewPermissionCopyCheckCopy).toContain('include order IDs');
    expect(lifecycleCopy.storeReviewPermissionCopyCheckCopy).toContain('include transaction IDs');
    expect(lifecycleCopy.storeReviewPermissionCopyCheckCopy).toContain('publish private policy drafts');
    expect(lifecycleCopy.storeReviewPermissionCopyCheckCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewPermissionCopyCheckCopy).toContain('claim sandbox/license-test proof without evidence');
    expect(lifecycleCopy.storeReviewPermissionCopyCheckCopy).toContain('claim review approval');
    expect(lifecycleCopy.storeReviewPermissionCopyCheckCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewPermissionCopyCheckCopy).toContain('auto-message users');
    expect(lifecycleCopy.storeReviewDemoAccessQaCopy).toContain('Store Review Demo Access QA Kit');
    expect(lifecycleCopy.storeReviewDemoAccessQaCopy).toContain('Confirm reviewer demo access instructions');
    expect(lifecycleCopy.storeReviewDemoAccessQaCopy).toContain('Manual demo access QA checklist');
    expect(lifecycleCopy.storeReviewDemoAccessQaCopy).toContain('App Store Connect or Play Console notes');
    expect(lifecycleCopy.storeReviewDemoAccessQaCopy).toContain('joined campaign challenge');
    expect(lifecycleCopy.storeReviewDemoAccessQaCopy).toContain('Feature Me consent');
    expect(lifecycleCopy.storeReviewDemoAccessQaCopy).toContain('without real member data');
    expect(lifecycleCopy.storeReviewDemoAccessQaCopy).toContain('paid surfaces in review mode');
    expect(lifecycleCopy.storeReviewDemoAccessQaCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeReviewDemoAccessQaCopy).toContain('store reviewer passwords');
    expect(lifecycleCopy.storeReviewDemoAccessQaCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewDemoAccessQaCopy).toContain('include order IDs');
    expect(lifecycleCopy.storeReviewDemoAccessQaCopy).toContain('include transaction IDs');
    expect(lifecycleCopy.storeReviewDemoAccessQaCopy).toContain('publish private policy drafts');
    expect(lifecycleCopy.storeReviewDemoAccessQaCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewDemoAccessQaCopy).toContain('claim sandbox/license-test proof without evidence');
    expect(lifecycleCopy.storeReviewDemoAccessQaCopy).toContain('claim review approval');
    expect(lifecycleCopy.storeReviewDemoAccessQaCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewDemoAccessQaCopy).toContain('auto-message users');
    expect(lifecycleCopy.storeReviewSupportHandoffQaCopy).toContain('Store Review Support Handoff QA Kit');
    expect(lifecycleCopy.storeReviewSupportHandoffQaCopy).toContain('Confirm reviewer notes route refunds');
    expect(lifecycleCopy.storeReviewSupportHandoffQaCopy).toContain('Manual support handoff QA checklist');
    expect(lifecycleCopy.storeReviewSupportHandoffQaCopy).toContain('App Store or Google Play support');
    expect(lifecycleCopy.storeReviewSupportHandoffQaCopy).toContain('restore/sync');
    expect(lifecycleCopy.storeReviewSupportHandoffQaCopy).toContain('entitlement recovery');
    expect(lifecycleCopy.storeReviewSupportHandoffQaCopy).toContain('account deletion');
    expect(lifecycleCopy.storeReviewSupportHandoffQaCopy).toContain('without promising manual entitlements');
    expect(lifecycleCopy.storeReviewSupportHandoffQaCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeReviewSupportHandoffQaCopy).toContain('promise refunds');
    expect(lifecycleCopy.storeReviewSupportHandoffQaCopy).toContain('process refunds');
    expect(lifecycleCopy.storeReviewSupportHandoffQaCopy).toContain('cancel subscriptions');
    expect(lifecycleCopy.storeReviewSupportHandoffQaCopy).toContain('collect payment details');
    expect(lifecycleCopy.storeReviewSupportHandoffQaCopy).toContain('store reviewer passwords');
    expect(lifecycleCopy.storeReviewSupportHandoffQaCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewSupportHandoffQaCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewSupportHandoffQaCopy).toContain('claim sandbox/license-test proof without evidence');
    expect(lifecycleCopy.storeReviewSupportHandoffQaCopy).toContain('claim review approval');
    expect(lifecycleCopy.storeReviewSupportHandoffQaCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewSupportHandoffQaCopy).toContain('auto-message users');
    expect(lifecycleCopy.storeReviewEvidencePacketIndexCopy).toContain('Store Review Evidence Packet Index Kit');
    expect(lifecycleCopy.storeReviewEvidencePacketIndexCopy).toContain('Create one internal index');
    expect(lifecycleCopy.storeReviewEvidencePacketIndexCopy).toContain('Manual evidence packet index checklist');
    expect(lifecycleCopy.storeReviewEvidencePacketIndexCopy).toContain('product ID, platform, evidence case');
    expect(lifecycleCopy.storeReviewEvidencePacketIndexCopy).toContain('safe-denial evidence');
    expect(lifecycleCopy.storeReviewEvidencePacketIndexCopy).toContain('sanitized evidence notes');
    expect(lifecycleCopy.storeReviewEvidencePacketIndexCopy).toContain('private screenshots out');
    expect(lifecycleCopy.storeReviewEvidencePacketIndexCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeReviewEvidencePacketIndexCopy).toContain('create fake evidence');
    expect(lifecycleCopy.storeReviewEvidencePacketIndexCopy).toContain('export raw purchase tokens');
    expect(lifecycleCopy.storeReviewEvidencePacketIndexCopy).toContain('export order IDs');
    expect(lifecycleCopy.storeReviewEvidencePacketIndexCopy).toContain('export transaction IDs');
    expect(lifecycleCopy.storeReviewEvidencePacketIndexCopy).toContain('store reviewer passwords');
    expect(lifecycleCopy.storeReviewEvidencePacketIndexCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewEvidencePacketIndexCopy).toContain('claim sandbox/license-test proof without evidence');
    expect(lifecycleCopy.storeReviewEvidencePacketIndexCopy).toContain('claim review approval');
    expect(lifecycleCopy.storeReviewEvidencePacketIndexCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewEvidencePacketIndexCopy).toContain('auto-message users');
    expect(lifecycleCopy.storeReviewFinalSignoffCopy).toContain('Store Review Final Sign-Off Kit');
    expect(lifecycleCopy.storeReviewFinalSignoffCopy).toContain('Confirm fixed build, reviewer reply');
    expect(lifecycleCopy.storeReviewFinalSignoffCopy).toContain('Manual final sign-off checklist');
    expect(lifecycleCopy.storeReviewFinalSignoffCopy).toContain('reviewer reply packet');
    expect(lifecycleCopy.storeReviewFinalSignoffCopy).toContain('metadata diff');
    expect(lifecycleCopy.storeReviewFinalSignoffCopy).toContain('resubmission owner');
    expect(lifecycleCopy.storeReviewFinalSignoffCopy).toContain('App Store Connect or Play Console work');
    expect(lifecycleCopy.storeReviewFinalSignoffCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeReviewFinalSignoffCopy).toContain('mark final approval');
    expect(lifecycleCopy.storeReviewFinalSignoffCopy).toContain('store reviewer passwords');
    expect(lifecycleCopy.storeReviewFinalSignoffCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewFinalSignoffCopy).toContain('include order IDs');
    expect(lifecycleCopy.storeReviewFinalSignoffCopy).toContain('include transaction IDs');
    expect(lifecycleCopy.storeReviewFinalSignoffCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewFinalSignoffCopy).toContain('claim sandbox/license-test proof without evidence');
    expect(lifecycleCopy.storeReviewFinalSignoffCopy).toContain('claim review approval');
    expect(lifecycleCopy.storeReviewFinalSignoffCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewFinalSignoffCopy).toContain('auto-message users');
    expect(lifecycleCopy.storeReviewConsoleDraftQaCopy).toContain('Store Review Console Draft QA Kit');
    expect(lifecycleCopy.storeReviewConsoleDraftQaCopy).toContain('Check App Store Connect and Play Console draft fields');
    expect(lifecycleCopy.storeReviewConsoleDraftQaCopy).toContain('Manual console draft QA checklist');
    expect(lifecycleCopy.storeReviewConsoleDraftQaCopy).toContain('App Store Connect reviewer notes');
    expect(lifecycleCopy.storeReviewConsoleDraftQaCopy).toContain('Play Console reviewer notes');
    expect(lifecycleCopy.storeReviewConsoleDraftQaCopy).toContain('final sign-off packet');
    expect(lifecycleCopy.storeReviewConsoleDraftQaCopy).toContain('draft-only policy links');
    expect(lifecycleCopy.storeReviewConsoleDraftQaCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeReviewConsoleDraftQaCopy).toContain('edit console fields from client code');
    expect(lifecycleCopy.storeReviewConsoleDraftQaCopy).toContain('mark final approval');
    expect(lifecycleCopy.storeReviewConsoleDraftQaCopy).toContain('store reviewer passwords');
    expect(lifecycleCopy.storeReviewConsoleDraftQaCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewConsoleDraftQaCopy).toContain('include order IDs');
    expect(lifecycleCopy.storeReviewConsoleDraftQaCopy).toContain('include transaction IDs');
    expect(lifecycleCopy.storeReviewConsoleDraftQaCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewConsoleDraftQaCopy).toContain('claim sandbox/license-test proof without evidence');
    expect(lifecycleCopy.storeReviewConsoleDraftQaCopy).toContain('claim review approval');
    expect(lifecycleCopy.storeReviewConsoleDraftQaCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewConsoleDraftQaCopy).toContain('auto-message users');
    expect(lifecycleCopy.storeReviewSubmissionHoldReasonsCopy).toContain('Store Review Submission Hold Reasons Kit');
    expect(lifecycleCopy.storeReviewSubmissionHoldReasonsCopy).toContain('Classify every hold');
    expect(lifecycleCopy.storeReviewSubmissionHoldReasonsCopy).toContain('Manual submission hold checklist');
    expect(lifecycleCopy.storeReviewSubmissionHoldReasonsCopy).toContain('evidence gap');
    expect(lifecycleCopy.storeReviewSubmissionHoldReasonsCopy).toContain('policy/data-safety mismatch');
    expect(lifecycleCopy.storeReviewSubmissionHoldReasonsCopy).toContain('console draft mismatch');
    expect(lifecycleCopy.storeReviewSubmissionHoldReasonsCopy).toContain('missing final sign-off');
    expect(lifecycleCopy.storeReviewSubmissionHoldReasonsCopy).toContain('unblock condition');
    expect(lifecycleCopy.storeReviewSubmissionHoldReasonsCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeReviewSubmissionHoldReasonsCopy).toContain('edit console fields from client code');
    expect(lifecycleCopy.storeReviewSubmissionHoldReasonsCopy).toContain('mark final approval');
    expect(lifecycleCopy.storeReviewSubmissionHoldReasonsCopy).toContain('remove holds without reviewed proof');
    expect(lifecycleCopy.storeReviewSubmissionHoldReasonsCopy).toContain('store reviewer passwords');
    expect(lifecycleCopy.storeReviewSubmissionHoldReasonsCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewSubmissionHoldReasonsCopy).toContain('include order IDs');
    expect(lifecycleCopy.storeReviewSubmissionHoldReasonsCopy).toContain('include transaction IDs');
    expect(lifecycleCopy.storeReviewSubmissionHoldReasonsCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewSubmissionHoldReasonsCopy).toContain('claim sandbox/license-test proof without evidence');
    expect(lifecycleCopy.storeReviewSubmissionHoldReasonsCopy).toContain('claim review approval');
    expect(lifecycleCopy.storeReviewSubmissionHoldReasonsCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewSubmissionHoldReasonsCopy).toContain('auto-message users');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('Store Review Hold Release Decision Kit');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('Approve hold release only');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('Manual hold release decision replies');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('APPROVED TO RELEASE HOLD');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('WAITING ON HOLD PROOF');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('NOT READY TO RELEASE HOLD');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('DECLINED FOR RESUBMISSION');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('missing proof path');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('evidence packet row');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('safe-denial coverage');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('fake proof');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('edit console fields from client code');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('remove holds without reviewed proof');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('mark final approval');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('store reviewer passwords');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('include order IDs');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('include transaction IDs');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('claim sandbox/license-test proof without evidence');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('claim review approval');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewHoldReleaseDecisionCopy).toContain('auto-message users');
    expect(lifecycleCopy.storeReviewResubmissionPacketQaCopy).toContain('Store Review Resubmission Packet QA Kit');
    expect(lifecycleCopy.storeReviewResubmissionPacketQaCopy).toContain('Compare the fixed build');
    expect(lifecycleCopy.storeReviewResubmissionPacketQaCopy).toContain('Manual resubmission packet QA checklist');
    expect(lifecycleCopy.storeReviewResubmissionPacketQaCopy).toContain('released holds');
    expect(lifecycleCopy.storeReviewResubmissionPacketQaCopy).toContain('evidence packet index');
    expect(lifecycleCopy.storeReviewResubmissionPacketQaCopy).toContain('console draft notes');
    expect(lifecycleCopy.storeReviewResubmissionPacketQaCopy).toContain('reviewer-facing copy factual');
    expect(lifecycleCopy.storeReviewResubmissionPacketQaCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeReviewResubmissionPacketQaCopy).toContain('edit console fields from client code');
    expect(lifecycleCopy.storeReviewResubmissionPacketQaCopy).toContain('paste reviewer notes without packet QA');
    expect(lifecycleCopy.storeReviewResubmissionPacketQaCopy).toContain('mark final approval');
    expect(lifecycleCopy.storeReviewResubmissionPacketQaCopy).toContain('remove holds without reviewed proof');
    expect(lifecycleCopy.storeReviewResubmissionPacketQaCopy).toContain('store reviewer passwords');
    expect(lifecycleCopy.storeReviewResubmissionPacketQaCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewResubmissionPacketQaCopy).toContain('include order IDs');
    expect(lifecycleCopy.storeReviewResubmissionPacketQaCopy).toContain('include transaction IDs');
    expect(lifecycleCopy.storeReviewResubmissionPacketQaCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewResubmissionPacketQaCopy).toContain('claim sandbox/license-test proof without evidence');
    expect(lifecycleCopy.storeReviewResubmissionPacketQaCopy).toContain('claim review approval');
    expect(lifecycleCopy.storeReviewResubmissionPacketQaCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewResubmissionPacketQaCopy).toContain('auto-message users');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('Store Review Resubmission Decision Reply Kit');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('Approve resubmission prep only');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('Manual resubmission decision replies');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('APPROVED FOR RESUBMISSION PREP');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('WAITING ON PACKET QA');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('NOT READY FOR RESUBMISSION');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('DECLINED FOR RESUBMISSION');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('safe-denial coverage is incomplete');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('fixed build is not confirmed');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('edit console fields from client code');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('paste reviewer notes without packet QA');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('mark final approval');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('remove holds without reviewed proof');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('store reviewer passwords');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('include order IDs');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('include transaction IDs');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('claim sandbox/license-test proof without evidence');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('claim review approval');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewResubmissionDecisionReplyCopy).toContain('auto-message users');
    expect(lifecycleCopy.storeReviewReviewerNotesPasteQaCopy).toContain('Store Review Reviewer Notes Paste QA Kit');
    expect(lifecycleCopy.storeReviewReviewerNotesPasteQaCopy).toContain('Compare the final reviewer notes');
    expect(lifecycleCopy.storeReviewReviewerNotesPasteQaCopy).toContain('Manual reviewer notes paste QA checklist');
    expect(lifecycleCopy.storeReviewReviewerNotesPasteQaCopy).toContain('App Store Connect notes');
    expect(lifecycleCopy.storeReviewReviewerNotesPasteQaCopy).toContain('Play Console notes');
    expect(lifecycleCopy.storeReviewReviewerNotesPasteQaCopy).toContain('exact reviewer notes are ready');
    expect(lifecycleCopy.storeReviewReviewerNotesPasteQaCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeReviewReviewerNotesPasteQaCopy).toContain('edit console fields from client code');
    expect(lifecycleCopy.storeReviewReviewerNotesPasteQaCopy).toContain('paste reviewer notes without human QA');
    expect(lifecycleCopy.storeReviewReviewerNotesPasteQaCopy).toContain('mark final approval');
    expect(lifecycleCopy.storeReviewReviewerNotesPasteQaCopy).toContain('remove holds without reviewed proof');
    expect(lifecycleCopy.storeReviewReviewerNotesPasteQaCopy).toContain('store reviewer passwords');
    expect(lifecycleCopy.storeReviewReviewerNotesPasteQaCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewReviewerNotesPasteQaCopy).toContain('include order IDs');
    expect(lifecycleCopy.storeReviewReviewerNotesPasteQaCopy).toContain('include transaction IDs');
    expect(lifecycleCopy.storeReviewReviewerNotesPasteQaCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewReviewerNotesPasteQaCopy).toContain('claim sandbox/license-test proof without evidence');
    expect(lifecycleCopy.storeReviewReviewerNotesPasteQaCopy).toContain('claim review approval');
    expect(lifecycleCopy.storeReviewReviewerNotesPasteQaCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewReviewerNotesPasteQaCopy).toContain('auto-message users');
    expect(lifecycleCopy.storeReviewConsoleSubmissionChecklistCopy).toContain('Store Review Console Submission Checklist Kit');
    expect(lifecycleCopy.storeReviewConsoleSubmissionChecklistCopy).toContain('Confirm App Store Connect and Play Console drafts');
    expect(lifecycleCopy.storeReviewConsoleSubmissionChecklistCopy).toContain('Manual console submission checklist');
    expect(lifecycleCopy.storeReviewConsoleSubmissionChecklistCopy).toContain('human console owner');
    expect(lifecycleCopy.storeReviewConsoleSubmissionChecklistCopy).toContain('version/build number');
    expect(lifecycleCopy.storeReviewConsoleSubmissionChecklistCopy).toContain('Hold submission if credentials');
    expect(lifecycleCopy.storeReviewConsoleSubmissionChecklistCopy).toContain('submission readiness outside client code');
    expect(lifecycleCopy.storeReviewConsoleSubmissionChecklistCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeReviewConsoleSubmissionChecklistCopy).toContain('edit console fields from client code');
    expect(lifecycleCopy.storeReviewConsoleSubmissionChecklistCopy).toContain('paste reviewer notes without human QA');
    expect(lifecycleCopy.storeReviewConsoleSubmissionChecklistCopy).toContain('mark final approval');
    expect(lifecycleCopy.storeReviewConsoleSubmissionChecklistCopy).toContain('remove holds without reviewed proof');
    expect(lifecycleCopy.storeReviewConsoleSubmissionChecklistCopy).toContain('store reviewer passwords');
    expect(lifecycleCopy.storeReviewConsoleSubmissionChecklistCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewConsoleSubmissionChecklistCopy).toContain('include order IDs');
    expect(lifecycleCopy.storeReviewConsoleSubmissionChecklistCopy).toContain('include transaction IDs');
    expect(lifecycleCopy.storeReviewConsoleSubmissionChecklistCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewConsoleSubmissionChecklistCopy).toContain('claim sandbox/license-test proof without evidence');
    expect(lifecycleCopy.storeReviewConsoleSubmissionChecklistCopy).toContain('claim review approval');
    expect(lifecycleCopy.storeReviewConsoleSubmissionChecklistCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewConsoleSubmissionChecklistCopy).toContain('auto-message users');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('Store Review Submission Status Watch Kit');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('Track App Store Connect and Play Console review states');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('Manual submission status watch checklist');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('waiting for review');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('metadata rejected');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('action required');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('submitted build');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('reviewedAt timestamp');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('edit console fields from client code');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('change review status from client code');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('mark final approval');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('announce approval');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('remove holds without reviewed proof');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('store reviewer passwords');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('include order IDs');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('include transaction IDs');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('claim sandbox/license-test proof without evidence');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('claim review approval');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewSubmissionStatusWatchCopy).toContain('auto-message users');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('Store Review Outcome Handoff Kit');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('Route approved, rejected');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('Manual outcome handoff checklist');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('paid launch gate review');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('launch messaging owner');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('needs owner review');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('evidence reference');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('edit console fields from client code');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('change review status from client code');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('mark final approval');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('announce approval');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('announce paid launch');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('remove holds without reviewed proof');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('store reviewer passwords');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('include order IDs');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('include transaction IDs');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('claim sandbox/license-test proof without evidence');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('claim review approval');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewOutcomeHandoffCopy).toContain('auto-message users');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('Store Review Launch Communication Hold Kit');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('Hold public launch, support, email');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('Manual launch communication hold checklist');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('marketing owner');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('public launch');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('paid-access');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('approved wording');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('remaining hold reason');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('edit console fields from client code');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('change review status from client code');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('mark final approval');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('announce approval');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('announce paid launch');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('publish public launch copy');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('send marketing email');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('post paid-access social copy');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('tell members Pro is live');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('tell members packs are live');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('remove holds without reviewed proof');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('store reviewer passwords');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('include order IDs');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('include transaction IDs');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('claim sandbox/license-test proof without evidence');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('claim review approval');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewLaunchCommunicationHoldCopy).toContain('auto-message users');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('Store Review Launch Message QA Kit');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('Compare exact public launch');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('Manual launch message QA checklist');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('launch communication hold record');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('scheduled window');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('rollback note');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('Do not submit store review');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('edit console fields from client code');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('change review status from client code');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('mark final approval');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('announce approval');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('announce paid launch');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('publish public launch copy');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('send marketing email');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('post paid-access social copy');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('tell members Pro is live');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('tell members packs are live');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('release referral or partner launch copy');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('offer discounts');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('promise refunds');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('remove holds without reviewed proof');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('include purchase tokens');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('include order IDs');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('include transaction IDs');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('write entitlements');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('claim sandbox/license-test proof without evidence');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('claim review approval');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('mark paid access live');
    expect(lifecycleCopy.storeReviewLaunchMessageQaCopy).toContain('auto-message users');
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
      'STORE REVIEW REJECTION ROOT CAUSE KIT',
      'STORE REVIEWER REPLY PACKET KIT',
      'STORE REVIEW METADATA DIFF KIT',
      'STORE REVIEW DATA SAFETY ALIGNMENT KIT',
      'STORE REVIEW PERMISSION COPY CHECK KIT',
      'STORE REVIEW DEMO ACCESS QA KIT',
      'STORE REVIEW SUPPORT HANDOFF QA KIT',
      'STORE REVIEW EVIDENCE PACKET INDEX KIT',
      'STORE REVIEW FINAL SIGN-OFF KIT',
      'STORE REVIEW CONSOLE DRAFT QA KIT',
      'STORE REVIEW SUBMISSION HOLD REASONS KIT',
      'STORE REVIEW HOLD RELEASE DECISION KIT',
      'STORE REVIEW RESUBMISSION PACKET QA KIT',
      'STORE REVIEW RESUBMISSION DECISION REPLY KIT',
      'STORE REVIEW REVIEWER NOTES PASTE QA KIT',
      'STORE REVIEW CONSOLE SUBMISSION CHECKLIST KIT',
      'STORE REVIEW SUBMISSION STATUS WATCH KIT',
      'STORE REVIEW OUTCOME HANDOFF KIT',
      'STORE REVIEW LAUNCH COMMUNICATION HOLD KIT',
      'STORE REVIEW LAUNCH MESSAGE QA KIT',
      'STORE REVIEW RESUBMISSION READINESS KIT',
    ]);
  });
});
