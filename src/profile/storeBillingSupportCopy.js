export function buildStoreBillingSupportCopy({
  billingSupportEscalationItems,
  storeCatalog,
  storeSubscriptionCount,
  storePackCount,
  storeTestEvidenceSummary,
  entitlementRecoveryReviewCount,
  validationReadinessConfirmed,
  proActive,
  activeChallengePackCount,
  challengePackCount,
}) {
  const billingSupportEscalationCopy = `Rise With The Tribe Billing Support Escalation Kit:\n\n${billingSupportEscalationItems.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\nEscalation summary:\n- Products in scope: ${storeCatalog.length} shared IDs (${storeSubscriptionCount} subscriptions, ${storePackCount} challenge packs)\n- Store test evidence: ${storeTestEvidenceSummary.total} records (${storeTestEvidenceSummary.ios} iOS, ${storeTestEvidenceSummary.android} Android, ${storeTestEvidenceSummary.failed} failed)\n- Entitlement recovery queue: ${entitlementRecoveryReviewCount} open support case${entitlementRecoveryReviewCount === 1 ? '' : 's'}\n- Validation readiness: ${validationReadinessConfirmed ? 'provider credentials detected' : 'credentials or sandbox/license-test proof still pending'}\n\nManual support handoff:\n[ ] Confirm the member is signed into the same Apple ID or Google Play account that made the purchase\n[ ] Ask the member to restore/sync purchases before entitlement recovery review\n[ ] Capture product ID, transaction/order reference if provided, platform, renewal/cancellation state, and restore result\n[ ] Check store validation response and entitlement recovery request before changing any backend state\n[ ] Route refund, cancellation, duplicate charge, chargeback, and payment-failure questions to marketplace support\n\nThis is a billing support escalation brief only. Do not cancel subscriptions in-app, process refunds, create purchases, write entitlements, override marketplace decisions, collect payment details, promise outcomes, imply medical results, or mark paid access live until store products, receipt validation, sandbox/license-test evidence, entitlement QA, and support operations are complete.`;

  const entitlementRecoveryDecisionReplyCopy = `Rise With The Tribe Entitlement Recovery Decision Reply Kit:

Open entitlement recovery requests: ${entitlementRecoveryReviewCount}
Active Pro: ${proActive ? 'yes' : 'no'}
Active packs: ${activeChallengePackCount}/${challengePackCount}
Validation readiness: ${validationReadinessConfirmed ? 'provider credentials detected' : 'credentials or sandbox/license-test proof still pending'}

Manual decision replies:
WAITING ON STORE CONTEXT: Your entitlement recovery request is in manual review. Please confirm the store account, product ID, transaction/order context if available, platform, renewal/cancellation state, and restore/sync result before support can continue.

RESOLVED AFTER RECOVERY REVIEW: Your entitlement recovery request has been marked resolved after manual review. We checked the request context, restore/sync status, and support notes without changing billing, refunds, subscriptions, or purchases from this profile UI.

CLOSED FOR NOW: Your entitlement recovery request has been closed for now. This may be because restore/sync now matches, purchase ownership could not be verified, marketplace support is required first, or the request needs clearer store context before reopening.

ESCALATE TO MARKETPLACE SUPPORT: For refunds, cancellations, failed charges, duplicate charges, chargebacks, subscription status, payment method issues, or purchase records, use App Store or Google Play support first. We can review app-side entitlement context after marketplace status is clear.

This is a manual Entitlement Recovery Decision Reply Kit only. Do not write entitlements, process refunds, cancel subscriptions, create purchases, retry charges, collect payment details, bypass App Store or Google Play policy, override marketplace decisions, expose private user data, promise restored access, imply medical results, auto-message users, scrape/store DMs, or pressure members.`;

  return {
    billingSupportEscalationCopy,
    entitlementRecoveryDecisionReplyCopy,
  };
}
