export function buildProfileUtilitySectionProps({
  disableReminder,
  handleReminder,
  onSignOut,
  reminderError,
  reminderLabel,
  user,
}) {
  return {
    reminderLabel,
    reminderError,
    onReminder: handleReminder,
    onReminderOff: disableReminder,
    user,
    onSignOut,
  };
}

export function buildSupportAccountSectionProps({
  accountDeletionDecisionReplyCopy,
  accountDeletionRequested,
  accountDeletionReviewNotes,
  accountDeletionReviewQueue,
  copyText,
  deletionRequestMessage,
  handleAccountDeletionRequest,
  handleAccountDeletionReview,
  handleSupportRequest,
  handleSupportRequestReview,
  isAdmin,
  isRequestingDeletion,
  isSubmittingSupport,
  profile,
  reviewingAccountDeletionRequestId,
  reviewingSupportRequestId,
  setAccountDeletionReviewNotes,
  setSupportCategory,
  setSupportMessage,
  setSupportReviewNotes,
  supportCategory,
  supportDecisionReplyCopy,
  supportMessage,
  supportReviewNotes,
  supportReviewQueue,
  supportStatusMessage,
}) {
  return {
    supportCategory,
    setSupportCategory,
    supportMessage,
    setSupportMessage,
    isSubmittingSupport,
    onSupportRequest: handleSupportRequest,
    supportStatusMessage,
    isAdmin,
    supportReviewQueue,
    supportReviewNotes,
    setSupportReviewNotes,
    onSupportRequestReview: handleSupportRequestReview,
    reviewingSupportRequestId,
    supportDecisionReplyCopy,
    copyText,
    accountDeletionRequested,
    onAccountDeletionRequest: handleAccountDeletionRequest,
    isRequestingDeletion,
    deletionRequestMessage,
    accountDeletionReviewQueue,
    accountDeletionReviewNotes,
    setAccountDeletionReviewNotes,
    onAccountDeletionReview: handleAccountDeletionReview,
    reviewingAccountDeletionRequestId,
    profile,
    accountDeletionDecisionReplyCopy,
  };
}

export function buildProfileScreenSupportSectionsProps(model, { onSignOut }) {
  return {
    supportAccountSectionProps: buildSupportAccountSectionProps(model),
    utilitySectionProps: buildProfileUtilitySectionProps({
      ...model,
      onSignOut,
    }),
  };
}
