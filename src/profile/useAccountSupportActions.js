import { buildAccountDeletionActionHandlers } from './accountDeletionActionHandlers';
import { buildContentReportActionHandlers } from './contentReportActionHandlers';
import { buildSupportRequestActionHandlers } from './supportRequestActionHandlers';

export default function useAccountSupportActions({
  accountDeletionRequested,
  accountDeletionReviewNotes,
  contentReportReviewNotes,
  isAdmin,
  isRequestingDeletion,
  isSubmittingSupport,
  profile,
  reviewingAccountDeletionRequestId,
  reviewingContentReportId,
  reviewingSupportRequestId,
  setAccountDeletionReviewQueue,
  setContentReportQueue,
  setDeletionRequestMessage,
  setIsRequestingDeletion,
  setIsSubmittingSupport,
  setProfile,
  setReviewMessage,
  setReviewingAccountDeletionRequestId,
  setReviewingContentReportId,
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

  const contentReportHandlers = buildContentReportActionHandlers({
    contentReportReviewNotes,
    profile,
    reviewingContentReportId,
    setContentReportQueue,
    setReviewingContentReportId,
    setSupportStatusMessage,
  });

  return {
    ...accountDeletionHandlers,
    ...supportRequestHandlers,
    ...contentReportHandlers,
  };
}
