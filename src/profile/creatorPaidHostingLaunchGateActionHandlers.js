import {
  getApprovedCreatorPaidHostingLaunchGateReviews,
  getCreatorPaidHostingLaunchGateReviewQueue,
  reviewCreatorPaidHostingLaunchGateEvidence,
  submitCreatorPaidHostingLaunchGateEvidence,
} from '../userService';

export function buildCreatorPaidHostingLaunchGateActionHandlers({
  creatorEnabled,
  creatorPaidHostingLaunchGateReviewNotes,
  isAdmin,
  isSubmittingCreatorPaidHostingLaunchGate,
  proActive,
  reviewingCreatorPaidHostingLaunchGateId,
  setApprovedCreatorPaidHostingLaunchGateReviews,
  setCreatorPaidHostingLaunchGateMessage,
  setCreatorPaidHostingLaunchGateReviewQueue,
  setIsSubmittingCreatorPaidHostingLaunchGate,
  setReviewingCreatorPaidHostingLaunchGateId,
  user,
}) {
  const handleCreatorPaidHostingLaunchGateSubmit = async () => {
    if (!user?.uid || !proActive || !creatorEnabled || isSubmittingCreatorPaidHostingLaunchGate) {
      setCreatorPaidHostingLaunchGateMessage('Enable Pro Creator / Coach Mode before saving launch gate evidence.');
      return;
    }
    setIsSubmittingCreatorPaidHostingLaunchGate(true);
    try {
      await submitCreatorPaidHostingLaunchGateEvidence(user.uid);
      setCreatorPaidHostingLaunchGateMessage('Creator paid hosting launch gate evidence saved for admin review. This records readiness only and keeps paid hosting off without contracts, payouts, purchases, entitlements, revenue-share, or paid-access claims.');
      if (isAdmin) {
        getCreatorPaidHostingLaunchGateReviewQueue().then(setCreatorPaidHostingLaunchGateReviewQueue).catch(() => {});
      }
    } catch (err) {
      setCreatorPaidHostingLaunchGateMessage(err?.message || 'Could not save creator paid hosting launch gate evidence.');
    } finally {
      setIsSubmittingCreatorPaidHostingLaunchGate(false);
    }
  };

  const handleCreatorPaidHostingLaunchGateReview = async (gate, status) => {
    if (!isAdmin || !gate?.id || reviewingCreatorPaidHostingLaunchGateId) return;
    setReviewingCreatorPaidHostingLaunchGateId(gate.id);
    try {
      await reviewCreatorPaidHostingLaunchGateEvidence(gate.id, {
        status,
        reviewNote: creatorPaidHostingLaunchGateReviewNotes[gate.id] || '',
        reviewedBy: user?.email || user?.uid || 'admin',
      });
      setCreatorPaidHostingLaunchGateMessage(`Creator paid hosting launch gate evidence marked ${status}. Paid hosting remains off; no contracts, payouts, purchases, entitlements, revenue-share, or paid-access claims were created.`);
      getCreatorPaidHostingLaunchGateReviewQueue().then(setCreatorPaidHostingLaunchGateReviewQueue).catch(() => {});
      getApprovedCreatorPaidHostingLaunchGateReviews().then(setApprovedCreatorPaidHostingLaunchGateReviews).catch(() => {});
    } catch (err) {
      setCreatorPaidHostingLaunchGateMessage(err?.message || 'Could not update creator paid hosting launch gate evidence.');
    } finally {
      setReviewingCreatorPaidHostingLaunchGateId('');
    }
  };

  return {
    handleCreatorPaidHostingLaunchGateReview,
    handleCreatorPaidHostingLaunchGateSubmit,
  };
}
