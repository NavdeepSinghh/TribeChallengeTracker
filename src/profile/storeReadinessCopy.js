export function buildStoreReadinessSupportCopy({
  storeCredentialSetupItems,
  supportRefundReadinessItems,
  subscriptionManagementGuidanceItems,
  storeCatalog,
  storeSubscriptionCount,
  storePackCount,
  monetizationSignalTotal,
}) {
  const storeCredentialSetupCopy = `Rise With The Tribe Store Credential Setup Kit:\n\n${storeCredentialSetupItems.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\nDo not promote paid access as live until App Store and Play test purchases validate through the Firebase verifyPurchase callable and write the shared Firestore entitlement fields for Pro and challenge packs.`;
  const supportRefundReadinessCopy = `Rise With The Tribe Support and Refund Readiness Kit:\n\n${supportRefundReadinessItems.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\nLaunch status: ${storeCatalog.length} shared product IDs, ${storeSubscriptionCount} subscriptions, ${storePackCount} challenge packs, and ${monetizationSignalTotal} first-party monetization signals.\n\nUse this before paid access goes live so members know how to restore purchases, request marketplace refunds, recover missing entitlements, and contact support without confusion.\n\nThis is a support-readiness brief only. Do not process refunds in-app, override App Store or Play refund policy, write entitlements manually, promise outcomes, imply medical results, or promote paid access as live until support operations, receipt validation, store products, and release QA are complete.`;
  const subscriptionManagementGuidanceCopy = `Rise With The Tribe Subscription Management Guidance Kit:\n\n${subscriptionManagementGuidanceItems.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\nMember-facing guidance:\n- iOS: open Settings > Apple ID > Subscriptions, or App Store account subscriptions, then choose Rise With The Tribe if a subscription exists.\n- Android: open Google Play > Payments & subscriptions > Subscriptions, then choose Rise With The Tribe if a subscription exists.\n- Restore/sync in the app after any store account change so server-side verification can refresh entitlements.\n- Contact support with store account context, product ID, renewal/cancellation state, and restore result if access still looks wrong.\n\nThis is subscription-management guidance only. Do not cancel subscriptions in-app, process refunds, create purchases, write entitlements, bypass App Store or Play policy, collect payment details, promise outcomes, imply medical results, or claim paid access is live until store products, receipt validation, restore QA, and support operations are complete.`;

  return {
    storeCredentialSetupCopy,
    supportRefundReadinessCopy,
    subscriptionManagementGuidanceCopy,
  };
}
