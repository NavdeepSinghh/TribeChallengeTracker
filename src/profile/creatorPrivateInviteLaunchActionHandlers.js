import {
  getApprovedCreatorPrivateInviteLaunches,
  getCreatorPrivateInviteLaunchReviewQueue,
  reviewCreatorPrivateInviteLaunch,
  submitCreatorPrivateInviteLaunch,
} from '../userService';

export function buildCreatorPrivateInviteLaunchActionHandlers({
  creatorEnabled,
  creatorPrivateInviteLaunchReviewNotes,
  isAdmin,
  isSubmittingCreatorPrivateInviteLaunch,
  proActive,
  reviewingCreatorPrivateInviteLaunchId,
  setApprovedCreatorPrivateInviteLaunches,
  setCreatorPrivateInviteLaunchMessage,
  setCreatorPrivateInviteLaunchReviewQueue,
  setIsSubmittingCreatorPrivateInviteLaunch,
  setReviewingCreatorPrivateInviteLaunchId,
  user,
}) {
  const handleCreatorPrivateInviteLaunchSubmit = async () => {
    if (!user?.uid || !proActive || !creatorEnabled || isSubmittingCreatorPrivateInviteLaunch) {
      setCreatorPrivateInviteLaunchMessage('Enable Pro Creator / Coach Mode before saving a private invite launch.');
      return;
    }
    setIsSubmittingCreatorPrivateInviteLaunch(true);
    try {
      await submitCreatorPrivateInviteLaunch(user.uid);
      setCreatorPrivateInviteLaunchMessage('Private creator invite launch saved for admin review. This records app-first private challenge readiness only, without auto-messaging, link-open tracking, payments, purchases, entitlements, or paid-hosting claims.');
      if (isAdmin) {
        getCreatorPrivateInviteLaunchReviewQueue().then(setCreatorPrivateInviteLaunchReviewQueue).catch(() => {});
      }
    } catch (err) {
      setCreatorPrivateInviteLaunchMessage(err?.message || 'Could not save private creator invite launch.');
    } finally {
      setIsSubmittingCreatorPrivateInviteLaunch(false);
    }
  };

  const handleCreatorPrivateInviteLaunchReview = async (launch, status) => {
    if (!isAdmin || !launch?.id || reviewingCreatorPrivateInviteLaunchId) return;
    setReviewingCreatorPrivateInviteLaunchId(launch.id);
    try {
      await reviewCreatorPrivateInviteLaunch(launch.id, {
        status,
        reviewNote: creatorPrivateInviteLaunchReviewNotes[launch.id] || '',
        reviewedBy: user?.email || user?.uid || 'admin',
      });
      setCreatorPrivateInviteLaunchMessage(`Private creator invite launch marked ${status}. Manual review note saved without auto-messaging, link-open tracking, payments, purchases, entitlements, revenue-share, or paid-hosting claims.`);
      getCreatorPrivateInviteLaunchReviewQueue().then(setCreatorPrivateInviteLaunchReviewQueue).catch(() => {});
      getApprovedCreatorPrivateInviteLaunches().then(setApprovedCreatorPrivateInviteLaunches).catch(() => {});
    } catch (err) {
      setCreatorPrivateInviteLaunchMessage(err?.message || 'Could not update private creator invite launch review.');
    } finally {
      setReviewingCreatorPrivateInviteLaunchId('');
    }
  };

  return {
    handleCreatorPrivateInviteLaunchReview,
    handleCreatorPrivateInviteLaunchSubmit,
  };
}
