import { buildAccountDeletionActionHandlers } from './accountDeletionActionHandlers';
import { buildSupportRequestActionHandlers } from './supportRequestActionHandlers';

export default function useAccountSupportActions({
  accountDeletionRequested,
  accountDeletionReviewNotes,
  isAdmin,
  isRequestingDeletion,
  isSubmittingSupport,
  profile,
  reviewingAccountDeletionRequestId,
  reviewingSupportRequestId,
  setAccountDeletionReviewQueue,
  setDeletionRequestMessage,
  setIsRequestingDeletion,
  setIsSubmittingSupport,
  setProfile,
  setReviewMessage,
  setReviewingAccountDeletionRequestId,
  setReviewingSupportRequestId,
  setSupportMessage,
  setSupportReviewQueue,
  setSupportStatusMessage,
  supportCategory,
  supportMessage,
  supportReviewNotes,
  user,
  onProfileUpdated,
}) {
  const accountDeletionHandlers = buildAccountDeletionActionHandlers({
    accountDeletionRequested,
    accountDeletionReviewNotes,
    isRequestingDeletion,
    profile,
    reviewingAccountDeletionRequestId,
    setAccountDeletionReviewQueue,
    setDeletionRequestMessage,
    setIsRequestingDeletion,
    setProfile,
    setReviewMessage,
    setReviewingAccountDeletionRequestId,
    user,
    onProfileUpdated,
  });

  const supportRequestHandlers = buildSupportRequestActionHandlers({
    isAdmin,
    isSubmittingSupport,
    profile,
    reviewingSupportRequestId,
    setIsSubmittingSupport,
    setReviewingSupportRequestId,
    setSupportMessage,
    setSupportReviewQueue,
    setSupportStatusMessage,
    supportCategory,
    supportMessage,
    supportReviewNotes,
    user,
  });

  return {
    ...accountDeletionHandlers,
    ...supportRequestHandlers,
  };
}
