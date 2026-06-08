export function buildSupportDecisionCopy({
  supportReviewQueue,
  supportCategory,
  accountDeletionReviewQueue,
  profile,
  userEmail,
}) {
  const supportDecisionReplyCopy = `Rise With The Tribe Support Decision Reply Kit:

Open support requests: ${supportReviewQueue.length}
Current category: ${supportCategory || 'general'}
Signed-in email: ${userEmail || 'unknown'}

Manual decision replies:
WAITING ON SUPPORT FOLLOW-UP: Your support request is in manual follow-up. We are checking the request category, account context, store/support boundaries, and the safest next step before any resolution is marked.

RESOLVED AFTER SUPPORT REVIEW: Your support request has been marked resolved after manual support review. If the issue returns or you need account, billing, safety, or bug help, send a new support request with updated context.

CLOSED FOR NOW: Your support request has been closed for now. This may be because we could not verify the context, the request belongs with App Store or Google Play support, the issue is already covered by a safer support path, or more information is needed before reopening.

ESCALATE TO MARKETPLACE SUPPORT: For refunds, cancellations, payment disputes, failed charges, or purchase records, use App Store or Google Play support first. We can review app-side context, but marketplace billing actions stay outside this profile UI.

This is a manual Support Decision Reply Kit only. Do not process refunds, cancel subscriptions, resolve purchases, write entitlements, delete accounts, erase activity records, collect payment details, bypass App Store or Google Play policy, expose private user data, promise immediate resolution, imply medical results, auto-message users, scrape/store DMs, or pressure members.`;
  const accountDeletionDecisionReplyCopy = `Rise With The Tribe Account Deletion Decision Reply Kit:

Open deletion requests: ${accountDeletionReviewQueue.length}
Current request status: ${profile?.accountDeletionRequest?.status || 'not requested'}
Signed-in email: ${userEmail || 'unknown'}

Manual decision replies:
VERIFIED FOR SUPPORT FOLLOW-UP: Your account/data deletion request has been verified for manual support follow-up. We are checking identity, subscription/refund context, data-retention obligations, and marketplace boundaries before any backend deletion work occurs.

CONTACTED FOR MORE INFO: We need more information before support can continue. Please confirm the account email, store purchase context if relevant, and whether you are asking for account deletion, data deletion, support follow-up, or marketplace billing help.

BLOCKED FOR NOW: We cannot move this deletion request forward yet. This may be due to identity uncertainty, unresolved subscription/refund context, legal or safety retention obligations, missing support context, or marketplace-policy boundaries.

CLOSED AFTER SUPPORT REVIEW: This deletion request has been closed after manual support review. If you still need account, data, subscription, refund, or safety help, open a new support request with updated context.

This is a manual Account Deletion Decision Reply Kit only. Do not delete Firebase Auth accounts, erase activity records, erase purchase records, cancel subscriptions, process refunds, write entitlements, bypass App Store or Google Play policy, collect payment details, expose private user data, promise immediate deletion, imply medical results, auto-message users, scrape/store DMs, or pressure members.`;

  return {
    supportDecisionReplyCopy,
    accountDeletionDecisionReplyCopy,
  };
}
