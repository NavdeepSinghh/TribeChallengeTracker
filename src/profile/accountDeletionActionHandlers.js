import {
  getAccountDeletionReviewQueue,
  requestAccountDeletion,
  reviewAccountDeletionRequest,
} from '../userService';

export function buildAccountDeletionActionHandlers({
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
}) {
  const handleAccountDeletionRequest = async () => {
    if (isRequestingDeletion || accountDeletionRequested) return;
    setDeletionRequestMessage('');
    setIsRequestingDeletion(true);
    try {
      const accountDeletionRequest = await requestAccountDeletion(user.uid);
      setProfile(p => ({ ...(p || {}), accountDeletionRequest }));
      onProfileUpdated?.({ ...(profile || {}), accountDeletionRequest });
      setDeletionRequestMessage('Deletion request recorded. Support will follow up before account data is removed.');
    } catch (err) {
      setDeletionRequestMessage(err?.message || 'Could not record deletion request.');
    } finally {
      setIsRequestingDeletion(false);
    }
  };

  const handleAccountDeletionReview = async (uid, status) => {
    if (reviewingAccountDeletionRequestId) return;
    setReviewingAccountDeletionRequestId(uid);
    try {
      await reviewAccountDeletionRequest(uid, {
        status,
        reviewNote: accountDeletionReviewNotes[uid] || '',
        reviewedBy: profile?.displayName || user.email || 'admin',
      });
      setReviewMessage(`Account deletion request marked ${status}. Review note saved without deleting the account, erasing data, cancelling purchases, processing refunds, or bypassing marketplace policy.`);
      const queue = await getAccountDeletionReviewQueue();
      setAccountDeletionReviewQueue(queue);
    } catch (err) {
      setReviewMessage(err?.message || 'Could not review account deletion request.');
    } finally {
      setReviewingAccountDeletionRequestId('');
    }
  };

  return {
    handleAccountDeletionRequest,
    handleAccountDeletionReview,
  };
}
