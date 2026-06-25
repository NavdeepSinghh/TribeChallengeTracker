export function buildSupportRequestCardProps({
  isSubmittingSupport,
  onSupportRequest,
  setSupportCategory,
  setSupportMessage,
  supportCategory,
  supportMessage,
  supportStatusMessage,
}) {
  return {
    isSubmittingSupport,
    onSupportRequest,
    setSupportCategory,
    setSupportMessage,
    supportCategory,
    supportMessage,
    supportStatusMessage,
  };
}

export function buildSupportReviewAdminSectionProps({
  copyText,
  onSupportRequestReview,
  reviewingSupportRequestId,
  setSupportReviewNotes,
  supportDecisionReplyCopy,
  supportReviewNotes,
  supportReviewQueue,
}) {
  return {
    supportReviewQueue,
    supportReviewNotes,
    setSupportReviewNotes,
    onSupportRequestReview,
    reviewingSupportRequestId,
    supportDecisionReplyCopy,
    copyText,
  };
}

export function buildContentReportReviewSectionProps({
  contentReportQueue,
  contentReportReviewNotes,
  onContentReportReview,
  reviewingContentReportId,
  setContentReportReviewNotes,
}) {
  return {
    contentReportQueue,
    contentReportReviewNotes,
    onContentReportReview,
    reviewingContentReportId,
    setContentReportReviewNotes,
  };
}

export function buildAccountDeletionRequestCardProps({
  accountDeletionRequested,
  deletionRequestMessage,
  isRequestingDeletion,
  onAccountDeletionRequest,
}) {
  return {
    accountDeletionRequested,
    deletionRequestMessage,
    isRequestingDeletion,
    onAccountDeletionRequest,
  };
}

export function buildAccountDeletionAdminReviewSectionProps({
  accountDeletionDecisionReplyCopy,
  accountDeletionReviewNotes,
  accountDeletionReviewQueue,
  copyText,
  onAccountDeletionReview,
  profile,
  reviewingAccountDeletionRequestId,
  setAccountDeletionReviewNotes,
}) {
  return {
    accountDeletionReviewQueue,
    accountDeletionReviewNotes,
    setAccountDeletionReviewNotes,
    onAccountDeletionReview,
    reviewingAccountDeletionRequestId,
    profile,
    accountDeletionDecisionReplyCopy,
    copyText,
  };
}

export function buildSupportAccountProps(props) {
  return {
    accountDeletionAdminReviewSectionProps: buildAccountDeletionAdminReviewSectionProps(props),
    accountDeletionRequestCardProps: buildAccountDeletionRequestCardProps(props),
    contentReportReviewSectionProps: buildContentReportReviewSectionProps(props),
    isAdmin: props.isAdmin,
    supportRequestCardProps: buildSupportRequestCardProps(props),
    supportReviewAdminSectionProps: buildSupportReviewAdminSectionProps(props),
  };
}
