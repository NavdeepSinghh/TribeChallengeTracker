import AccountDeletionDecisionReplyKit from './AccountDeletionDecisionReplyKit';
import AccountDeletionReviewQueue from './AccountDeletionReviewQueue';

export default function AccountDeletionAdminReviewSection({
  accountDeletionReviewQueue,
  accountDeletionReviewNotes,
  setAccountDeletionReviewNotes,
  onAccountDeletionReview,
  reviewingAccountDeletionRequestId,
  profile,
  accountDeletionDecisionReplyCopy,
  copyText,
}) {
  return (
    <>
      <AccountDeletionReviewQueue
        accountDeletionReviewNotes={accountDeletionReviewNotes}
        accountDeletionReviewQueue={accountDeletionReviewQueue}
        onAccountDeletionReview={onAccountDeletionReview}
        reviewingAccountDeletionRequestId={reviewingAccountDeletionRequestId}
        setAccountDeletionReviewNotes={setAccountDeletionReviewNotes}
      />
      <AccountDeletionDecisionReplyKit
        accountDeletionDecisionReplyCopy={accountDeletionDecisionReplyCopy}
        accountDeletionReviewQueue={accountDeletionReviewQueue}
        copyText={copyText}
        profile={profile}
      />
    </>
  );
}
