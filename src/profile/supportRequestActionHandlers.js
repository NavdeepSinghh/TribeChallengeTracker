import {
  getSupportReviewQueue,
  reviewSupportRequest,
  submitSupportRequest,
} from '../userService';

export function buildSupportRequestActionHandlers({
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
}) {
  const handleSupportRequest = async () => {
    if (isSubmittingSupport) return;
    setSupportStatusMessage('');
    setIsSubmittingSupport(true);
    try {
      await submitSupportRequest(user.uid, { category: supportCategory, message: supportMessage });
      setSupportMessage('');
      setSupportStatusMessage('Support request sent. We will follow up using your account email.');
      if (isAdmin) {
        getSupportReviewQueue().then(setSupportReviewQueue).catch(() => setSupportReviewQueue([]));
      }
    } catch (err) {
      setSupportStatusMessage(err?.message || 'Could not send support request.');
    } finally {
      setIsSubmittingSupport(false);
    }
  };

  const handleSupportRequestReview = async (requestId, status) => {
    if (reviewingSupportRequestId) return;
    setReviewingSupportRequestId(requestId);
    try {
      await reviewSupportRequest(requestId, {
        status,
        reviewNote: supportReviewNotes[requestId] || '',
        reviewedBy: profile?.displayName || profile?.email || 'admin',
      });
      setSupportStatusMessage(`Support request marked ${status}. Manual review note saved without resolving refunds, subscriptions, purchases, or entitlements.`);
      getSupportReviewQueue().then(setSupportReviewQueue).catch(() => setSupportReviewQueue([]));
    } catch (err) {
      setSupportStatusMessage(err?.message || 'Could not update support request review.');
    } finally {
      setReviewingSupportRequestId('');
    }
  };

  return {
    handleSupportRequest,
    handleSupportRequestReview,
  };
}
