export function buildProfileBaseDataBundleArgs({
  accountDeletionReviewQueue,
  profile,
  rank,
  selectedFrameId,
  supportCategory,
  supportReviewQueue,
  user,
}) {
  return {
    accountDeletionReviewQueue,
    profile,
    rank,
    selectedFrameId,
    supportCategory,
    supportReviewQueue,
    user,
  };
}
