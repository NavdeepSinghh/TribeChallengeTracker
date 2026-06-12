import { getStoreProductCatalog } from '../purchaseService';
import { STORE_TEST_EVIDENCE_MATRIX } from './storeTestEvidenceMatrix';

export const STORE_CATALOG = getStoreProductCatalog();
export const STORE_READINESS_ITEMS = [
  'Create matching App Store Connect and Play Console products',
  'Configure server receipt-validation credentials',
  'Run sandbox/test purchases on iOS and Android',
  'Confirm entitlement writes before enabling paid access',
];
export const STORE_CREDENTIAL_SETUP_ITEMS = [
  'App Store Connect: subscription group, challenge-pack products, shared secret / App Store Server API keys',
  'Play Console: subscriptions, one-time pack products, service account JSON, package access',
  'Firebase Functions: store validation secrets configured for App Store and Play Billing',
  'QA: sandbox/test users complete purchase + restore, then verify Firestore entitlements',
];
export const SUPPORT_REFUND_READINESS_ITEMS = [
  'Publish clear support contact and response-time expectations',
  'Document restore purchase and entitlement recovery steps',
  'Prepare App Store and Play refund guidance without handling refunds in-app',
  'Escalate duplicate charge, missing entitlement, and account mismatch cases',
];
export const SUBSCRIPTION_MANAGEMENT_GUIDANCE_ITEMS = [
  'Tell iOS members to manage or cancel subscriptions from Apple ID subscriptions in iOS Settings or the App Store',
  'Tell Android members to manage or cancel subscriptions from Google Play subscriptions for the signed-in Play account',
  'Ask members to restore or sync purchases before opening support for missing entitlements',
  'Route refunds, cancellations, billing disputes, and failed renewals through marketplace support first',
];
export const BILLING_SUPPORT_ESCALATION_ITEMS = [
  'Confirm platform, store account, product ID, purchase date, and latest restore/sync result before escalating',
  'Separate wrong-account, failed renewal, duplicate charge, cancellation confusion, and missing-entitlement cases',
  'Attach store evidence, validation status, entitlement recovery request, and support review notes to the handoff',
  'Escalate marketplace refunds, cancellations, charge disputes, and payment failures to App Store or Google Play support',
];
export const RENEWAL_RECOVERY_ITEMS = [
  'Confirm whether the member is lapsed, cancelled, in grace period, or using the wrong store account',
  'Ask the member to update payment details and manage renewal inside App Store or Google Play subscriptions',
  'Invite the member to restore/sync purchases after renewal, then open entitlement recovery if access stays missing',
  'Use first-party support notes only; keep payment, refund, chargeback, and cancellation decisions with the marketplace',
];
export const CANCELLATION_FEEDBACK_ITEMS = [
  'Ask what felt unclear, unused, too expensive, or not valuable enough before the member leaves',
  'Route cancellation steps to App Store or Google Play subscriptions without obstructing the marketplace flow',
  'Capture optional support notes for product learning without storing payment details or marketplace account data',
  'Review cancellation themes against first-party Pro interest, pack interest, creator demand, and support readiness',
];
export const LAPSED_MEMBER_WINBACK_ITEMS = [
  'Lead with a free comeback challenge, not a discount or payment ask',
  'Use current weekly campaign copy, streak rescue prompts, and referral momentum as the return path',
  'Invite the member to log one activity before asking about Pro, packs, creator tools, or partner perks',
  'Review first-party re-engagement signals only: app logs, challenge joins, referrals, support notes, and saved interest',
];
export const STORE_LAUNCH_DRY_RUN_ITEMS = [
  'Run the full signup, onboarding, challenge join, activity log, share, support, and restore/sync path as a release rehearsal',
  'Confirm validation credentials, sandbox/license-test evidence, entitlement recovery, support links, and data deletion resources are visible',
  'Record any missing evidence, failed checks, confusing copy, or support handoff gaps before paid access is promoted',
  'Keep the report copy-only until real App Store sandbox and Play license-test purchases prove the flow end to end',
];
export const STORE_TEST_PURCHASE_SESSION_PREP_ITEMS = [
  'Confirm getPurchaseValidationReadiness returns validation_configured for iOS and Android before any sandbox/license-test run',
  'Prepare one App Store sandbox tester and one Play license-test account outside git, screenshots, and public notes',
  'Run Pro monthly, Pro yearly, pack purchase, restore/sync, wrong-account, duplicate-restore, and negative-validation cases',
  'Export a sanitized reviewed evidence log and run node scripts/check-store-launch-readiness.js --evidence-log path/to/sanitized-store-evidence.json before paid launch review',
  'Export only platform, productId, testCase, result, evidenceNote, reviewNote, and reviewedAt fields; keep order IDs, transaction IDs, purchase tokens, tester emails, and credentials out of the file',
  'Record only reviewed evidence notes in storeTestPurchaseEvidence; never store raw purchase tokens, passwords, service account JSON, or private keys',
  'Keep paid access in review mode until evidence, entitlement writes, support handoff, and paid launch decision gate are reviewed',
];
export const STORE_EVIDENCE_ARCHIVE_ITEMS = [
  'Save the sanitized evidence export and --json audit output in the internal release packet after human review',
  'Record the release candidate build, reviewer, reviewedAt timestamp, missing matrix cases, and missing safe-denial platforms',
  'Attach only aggregate evidence status to App Store / Play review notes; keep tester aliases, tokens, transaction IDs, and private screenshots internal',
  'Re-run the archive checklist whenever product IDs, validation credentials, entitlement writes, restore/sync behavior, or support handoff copy changes',
];
export const STORE_EVIDENCE_EXPORT_TEMPLATE_ITEMS = [
  'Start from the sanitized JSON template before every App Store sandbox or Play license-test session',
  'Create one record per platform, productId, testCase, result, evidenceNote, reviewNote, and reviewedAt value after real evidence is reviewed',
  'Use placeholder-safe notes until a real sandbox/license-test action has happened and never invent verified evidence',
  'Run the exported file through node scripts/check-store-launch-readiness.js --evidence-log path/to/sanitized-store-evidence.json --json before archiving',
];
export const STORE_DEMO_ACCOUNT_ITEMS = [
  'Prepare one reviewer-safe demo account with onboarding complete, profile appearance set, and no personal member data',
  'Seed visible free flows: joined campaign challenge, activity history, badges, calendar history, share cards, support links, and Feature Me consent example',
  'Keep paid surfaces in review mode unless sandbox/license-test purchases, restore, receipt validation, and entitlement QA are proven',
  'Document optional HealthKit / Health Connect, media upload, notifications, support, privacy, terms, and data deletion behavior for reviewers',
];
export const STORE_SCREENSHOT_QA_ITEMS = [
  'Capture screenshots from seeded demo data only: onboarding, challenge tracker, logging, profile, support links, and free challenge flows',
  'Hide private member data, emails, purchase tokens, store credentials, service account JSON, and reviewer passwords from every screenshot',
  'Show paid surfaces as pending or review mode until sandbox/license-test evidence, receipt validation, restore, and entitlement QA are proven',
  'Confirm App Store and Play screenshot captions match current app behavior, privacy policy, support links, and data safety notes',
];
export const STORE_REVIEW_PACK_ITEMS = [
  'Draft App Store and Play reviewer notes with demo account context, free challenge flows, permission explanations, and support links',
  'Attach data safety, privacy, terms, data deletion, refund/support handoff, and restore/sync notes before submission',
  'Summarize sandbox/license-test evidence and entitlement QA gaps without claiming paid access is live',
  'Keep review preparation copy-only until products, credentials, policies, support links, restore flow, and entitlement QA are verified',
];
export const STORE_REVIEW_RESUBMISSION_ITEMS = [
  'Pair every App Review or Play rejection note with one owner, one policy area, one evidence gap, and one fix note',
  'Confirm the current build, demo account notes, permission explanations, screenshots, and support links match the resubmission reply',
  'Re-check sandbox/license-test evidence, restore/sync, entitlement recovery, and paid-launch decision status before sending updated notes',
  'Keep resubmission prep copy-only until the fixed build, reviewer notes, policies, and evidence packet are reviewed by a human',
];
export const STORE_REVIEW_EVIDENCE_GAP_TRIAGE_ITEMS = [
  'Start with the minimum evidence matrix and list every missing purchase, restore, wrong-account, or safe-denial proof item',
  'Separate credential/setup gaps from product-copy gaps, screenshot gaps, demo-account gaps, and support/refund handoff gaps',
  'Assign one owner and one next proof action for each App Store sandbox or Play license-test gap before reviewer notes change',
  'Keep the triage notes internal until a human confirms evidence, policy wording, support links, and paid-launch gate status',
];
export const STORE_REVIEW_EVIDENCE_GAP_DECISION_ITEMS = [
  'Approve only evidence gaps that have a named owner, a real proof path, and no paid-live or store-submission claim',
  'Wait when a sandbox/license-test action, restore/sync result, policy link, screenshot, or reviewer note is still being gathered',
  'Mark not-ready when the gap lacks product IDs, platform context, support/refund handoff, entitlement QA, or reviewed evidence notes',
  'Decline gaps that rely on fake proof, private data, credentials, purchase tokens, unreviewed screenshots, or pressure to resubmit',
];
export const STORE_REVIEW_POLICY_LINK_QA_ITEMS = [
  'Open every public policy, support, and data-deletion link from the exact reviewer notes before resubmission',
  'Confirm permission explanations match the current build for media uploads, notifications, optional health sync, purchases, restore/sync, and account deletion',
  'Check that reviewer notes point to marketplace refund/support paths without promising in-app refunds, manual entitlements, or paid access',
  'Keep policy-link QA copy-only until the fixed build, data safety notes, screenshots, support handoff, and evidence packet are reviewed',
];
export const STORE_REVIEW_REJECTION_ROOT_CAUSE_ITEMS = [
  'Classify each App Review or Play feedback item as demo access, permission wording, purchase/restore evidence, metadata, screenshot, privacy, support, or paid-access claim',
  'Map every rejection reason to one fixed build owner, one reviewer-note change, one evidence packet item, and one policy or support link',
  'Separate real app defects from reviewer-note gaps so product fixes, policy copy, screenshots, and evidence updates do not blur together',
  'Keep root-cause notes internal until a human confirms the fixed build, public policy links, and evidence packet are ready for resubmission prep',
];
export const STORE_REVIEWER_REPLY_PACKET_ITEMS = [
  'Assemble the final reviewer reply from the confirmed root cause, fixed build note, evidence packet, policy links, and support handoff',
  'Keep the reply factual, build-specific, and limited to reviewed proof for demo access, permissions, purchase/restore, privacy, or support questions',
  'Add screenshot/caption, metadata, data safety, and reviewer-note changes only after the owner confirms they match the current build',
  'Hold the packet internally until a human confirms no credentials, personal data, purchase tokens, or paid-access claims are included',
];
export const STORE_REVIEW_METADATA_DIFF_ITEMS = [
  'Compare App Store and Play listing text, screenshots, captions, permission explanations, and reviewer notes against the fixed build',
  'Flag every mismatch between metadata, data safety, privacy links, support links, purchase/restore behavior, and current app screens',
  'Assign one owner for each metadata, screenshot/caption, policy-link, data-safety, or reviewer-note change before resubmission prep',
  'Keep the diff internal until public listing copy, screenshots, policy links, evidence notes, and support handoff are reviewed together',
];
export const STORE_REVIEW_DATA_SAFETY_ALIGNMENT_ITEMS = [
  'Match App Privacy and Play Data Safety answers to the current build for auth, profile, activity, optional health sync, media, purchases, support, and deletion',
  'Confirm permission explanations, policy links, reviewer notes, and screenshots describe the same data use without adding new collection claims',
  'Assign one owner for each privacy-label, data-safety, permission, support, deletion, purchase-validation, or screenshot mismatch before resubmission prep',
  'Keep alignment notes internal until public policy links, data safety answers, reviewer notes, and evidence packet references are reviewed together',
];
export const STORE_REVIEW_PERMISSION_COPY_CHECK_ITEMS = [
  'Check reviewer-note language for optional HealthKit / Health Connect, media uploads, notifications, purchase validation, restore/sync, support, and account deletion',
  'Match every permission explanation to the current build, screenshot captions, policy links, and data-safety answers before resubmission prep',
  'Remove wording that implies required health access, automatic posting, medical outcomes, live paid access, or unreviewed purchase evidence',
  'Keep permission-copy notes internal until the fixed build, public policies, screenshot captions, and reviewer reply packet are reviewed together',
];
export const STORE_REVIEW_DEMO_ACCESS_QA_ITEMS = [
  'Confirm reviewer demo access instructions point to one reviewed account shared only through App Store Connect or Play Console notes',
  'Check seeded free flows for onboarding, joined challenge, activity history, badges, share cards, support links, and Feature Me consent examples',
  'Verify paid surfaces stay in review mode unless sandbox/license-test purchase, restore, validation, and entitlement evidence is reviewed',
  'Keep demo-access QA internal until credentials, screenshots, policy links, support handoff, and reviewer notes are checked by a human',
];
export const STORE_REVIEW_SUPPORT_HANDOFF_QA_ITEMS = [
  'Confirm reviewer notes route refunds, cancellations, failed renewals, duplicate charges, and billing disputes to App Store or Google Play support',
  'Check support, entitlement recovery, restore/sync, account deletion, privacy, terms, and data deletion links before resubmission prep',
  'Separate marketplace support handoff from in-app support so reviewer notes do not promise refunds, manual entitlements, or paid access',
  'Keep support-handoff QA internal until support owner, policy-link owner, evidence owner, and reviewer-note owner sign off',
];
export const STORE_REVIEW_EVIDENCE_PACKET_INDEX_ITEMS = [
  'Create one internal index for reviewed product IDs, sandbox/license-test evidence, restore/sync results, policy links, screenshots, and reviewer-note owners',
  'Separate verified evidence, safe-denial evidence, needs-review gaps, failed checks, and archived proof before reviewer notes are copied',
  'Link every index row to a sanitized evidence note, fixed build reference, support handoff, policy URL, screenshot/caption owner, and reviewedAt value',
  'Keep the packet index internal until evidence owner, policy-link owner, support owner, and resubmission owner confirm it matches the fixed build',
];
export const STORE_REVIEW_FINAL_SIGNOFF_ITEMS = [
  'Confirm fixed build, reviewer reply, evidence packet index, policy links, data safety, demo access, screenshots, metadata, and support handoff are all reviewed',
  'Require one named owner for build readiness, evidence, policy links, support routing, data safety, screenshots, metadata, and reviewer-note copy',
  'Hold resubmission if sandbox/license-test proof, restore/sync, safe-denial coverage, demo access, policy links, or support handoff still needs review',
  'Keep final sign-off internal until a human confirms the packet is ready for console work without paid-live claims or credential exposure',
];
export const STORE_REVIEW_CONSOLE_DRAFT_QA_ITEMS = [
  'Check App Store Connect and Play Console draft fields against the final sign-off packet before any reviewer notes are pasted',
  'Confirm reviewer reply, demo access notes, metadata, screenshots, data safety, policy links, support handoff, and evidence summary match the fixed build',
  'Flag draft mismatches for owner review instead of editing console fields from client code or claiming submission readiness',
  'Keep console-draft QA internal until a human confirms no credentials, purchase tokens, private data, or paid-live claims are present',
];
export const STORE_REVIEW_SUBMISSION_HOLD_REASONS_ITEMS = [
  'Classify every hold as evidence gap, policy/data-safety mismatch, demo-access issue, support handoff gap, metadata drift, console draft mismatch, missing final sign-off, or paid-live claim risk',
  'Attach each hold reason to one owner, one missing proof path, one reviewer-note impact, and one clear unblock condition before console work continues',
  'Keep hold notes separate from reviewer-facing copy so internal gaps do not become public store metadata or submission claims',
  'Release a hold only after reviewed evidence, policy links, support handoff, demo access, metadata, console draft, and final sign-off all match the fixed build',
];
export const STORE_REVIEW_HOLD_RELEASE_DECISION_ITEMS = [
  'Approve hold release only when the missing proof path, reviewer-note impact, evidence packet row, and fixed-build reference are reviewed together',
  'Wait when policy links, data safety answers, support routing, demo access, screenshots, metadata, or console draft fields still need owner confirmation',
  'Mark not-ready when the hold still lacks a named owner, unblock condition, reviewed evidence, or safe-denial coverage for the affected platform',
  'Decline release requests that depend on fake proof, private credentials, purchase tokens, public metadata claims, paid-live claims, or pressure to resubmit',
];
export const SANDBOX_PURCHASE_TEST_ITEMS = [
  'iOS sandbox: buy Pro monthly, restore, then verify verifyPurchase writes entitlements.pro.active',
  'iOS sandbox: buy each challenge pack, restore, then verify the matching entitlements.packs entry',
  'Android license test: buy Pro monthly, restore owned purchases, then verify entitlements.pro.active',
  'Android license test: buy each challenge pack, restore owned purchases, then verify the matching entitlements.packs entry',
  'Negative QA: cancellation, duplicate restore, wrong account, and failed receipt validation must not unlock access',
];
export const STORE_TEST_EVIDENCE_CASES = STORE_TEST_EVIDENCE_MATRIX;
