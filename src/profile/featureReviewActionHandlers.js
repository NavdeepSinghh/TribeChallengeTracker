import {
  getFeatureReviewQueue,
  reviewFeatureSubmission,
} from '../userService';

export function buildFeatureReviewActionHandlers({
  featureReviewNotes,
  setFeatureReviewQueue,
  setReviewMessage,
  user,
}) {
  const handleReviewSubmission = async (submissionId, status) => {
    setReviewMessage('');
    try {
      await reviewFeatureSubmission(submissionId, status, user.uid, featureReviewNotes[submissionId] || '');
      const queue = await getFeatureReviewQueue();
      setFeatureReviewQueue(queue);
      setReviewMessage(`Submission marked ${status}. Review note saved for manual UGC consent/content review.`);
    } catch (err) {
      setReviewMessage(err?.message || 'Could not update submission.');
    }
  };

  return { handleReviewSubmission };
}
