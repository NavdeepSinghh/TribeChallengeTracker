import {
  getCreatorLeaderboardSnapshotReviewQueue,
  getPublishedCreatorLeaderboardSnapshots,
  reviewCreatorLeaderboardSnapshot,
  submitCreatorLeaderboardSnapshot,
} from '../userService';

export function buildCreatorLeaderboardSnapshotActionHandlers({
  creatorEnabled,
  creatorLeaderboardSnapshotReviewNotes,
  isAdmin,
  isSubmittingCreatorLeaderboardSnapshot,
  proActive,
  reviewingCreatorLeaderboardSnapshotId,
  setCreatorLeaderboardSnapshotMessage,
  setCreatorLeaderboardSnapshotReviewQueue,
  setIsSubmittingCreatorLeaderboardSnapshot,
  setPublishedCreatorLeaderboardSnapshots,
  setReviewingCreatorLeaderboardSnapshotId,
  user,
}) {
  const handleCreatorLeaderboardSnapshotSubmit = async () => {
    if (!user?.uid || !proActive || !creatorEnabled || isSubmittingCreatorLeaderboardSnapshot) {
      setCreatorLeaderboardSnapshotMessage('Enable Pro Creator / Coach Mode before saving a leaderboard snapshot.');
      return;
    }
    setIsSubmittingCreatorLeaderboardSnapshot(true);
    try {
      await submitCreatorLeaderboardSnapshot(user.uid);
      setCreatorLeaderboardSnapshotMessage('Creator leaderboard snapshot saved for admin review. This records aggregate hosted challenge movement only, without member identities, per-user logs, payouts, purchases, entitlements, or paid-hosting claims.');
      if (isAdmin) {
        getCreatorLeaderboardSnapshotReviewQueue().then(setCreatorLeaderboardSnapshotReviewQueue).catch(() => {});
      }
    } catch (err) {
      setCreatorLeaderboardSnapshotMessage(err?.message || 'Could not save creator leaderboard snapshot.');
    } finally {
      setIsSubmittingCreatorLeaderboardSnapshot(false);
    }
  };

  const handleCreatorLeaderboardSnapshotReview = async (snapshot, status) => {
    if (!isAdmin || !snapshot?.id || reviewingCreatorLeaderboardSnapshotId) return;
    setReviewingCreatorLeaderboardSnapshotId(snapshot.id);
    try {
      await reviewCreatorLeaderboardSnapshot(snapshot.id, {
        status,
        reviewNote: creatorLeaderboardSnapshotReviewNotes[snapshot.id] || '',
        reviewedBy: user?.email || user?.displayName || 'admin',
      });
      setCreatorLeaderboardSnapshotMessage(`Creator leaderboard snapshot marked ${status}. Manual review note saved without member identities, per-user logs, payouts, purchases, entitlements, revenue-share, tracking, or paid-hosting claims.`);
      getCreatorLeaderboardSnapshotReviewQueue().then(setCreatorLeaderboardSnapshotReviewQueue).catch(() => {});
      getPublishedCreatorLeaderboardSnapshots().then(setPublishedCreatorLeaderboardSnapshots).catch(() => {});
    } catch (err) {
      setCreatorLeaderboardSnapshotMessage(err?.message || 'Could not update creator leaderboard snapshot review.');
    } finally {
      setReviewingCreatorLeaderboardSnapshotId('');
    }
  };

  return {
    handleCreatorLeaderboardSnapshotReview,
    handleCreatorLeaderboardSnapshotSubmit,
  };
}
