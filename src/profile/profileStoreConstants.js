import { getStoreProductCatalog } from '../purchaseService';

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
export const STORE_DEMO_ACCOUNT_ITEMS = [
  'Prepare one reviewer-safe demo account with onboarding complete, profile appearance set, and no personal member data',
  'Seed visible free flows: joined campaign challenge, activity history, badges, calendar history, share cards, support links, and Feature Me consent example',
  'Keep paid surfaces in review mode unless sandbox/license-test purchases, restore, receipt validation, and entitlement QA are proven',
  'Document optional HealthKit / Health Connect, media upload, notifications, support, privacy, terms, and data deletion behavior for reviewers',
];
export const STORE_REVIEW_PACK_ITEMS = [
  'Draft App Store and Play reviewer notes with demo account context, free challenge flows, permission explanations, and support links',
  'Attach data safety, privacy, terms, data deletion, refund/support handoff, and restore/sync notes before submission',
  'Summarize sandbox/license-test evidence and entitlement QA gaps without claiming paid access is live',
  'Keep review preparation copy-only until products, credentials, policies, support links, restore flow, and entitlement QA are verified',
];
export const SANDBOX_PURCHASE_TEST_ITEMS = [
  'iOS sandbox: buy Pro monthly, restore, then verify verifyPurchase writes entitlements.pro.active',
  'iOS sandbox: buy each challenge pack, restore, then verify the matching entitlements.packs entry',
  'Android license test: buy Pro monthly, restore owned purchases, then verify entitlements.pro.active',
  'Android license test: buy each challenge pack, restore owned purchases, then verify the matching entitlements.packs entry',
  'Negative QA: cancellation, duplicate restore, wrong account, and failed receipt validation must not unlock access',
];
export const STORE_TEST_EVIDENCE_CASES = [
  { id: 'ios_pro_sandbox', platform: 'ios', productKind: 'subscription', testCase: 'sandbox_purchase', label: 'iOS Pro sandbox purchase' },
  { id: 'ios_pack_restore', platform: 'ios', productKind: 'challengePack', testCase: 'restore_sync', label: 'iOS pack restore sync' },
  { id: 'android_pro_license', platform: 'android', productKind: 'subscription', testCase: 'sandbox_purchase', label: 'Android Pro license test' },
  { id: 'android_negative_validation', platform: 'android', productKind: 'challengePack', testCase: 'negative_validation', label: 'Android negative validation' },
];
