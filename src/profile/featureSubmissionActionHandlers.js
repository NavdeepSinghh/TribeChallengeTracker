import {
  getFeatureSubmissions,
  submitFeatureSubmission,
} from '../userService';

export function buildFeatureSubmissionActionHandlers({
  featureCategory,
  featureConsent,
  featureMediaData,
  featureStory,
  setFeatureConsent,
  setFeatureMediaData,
  setFeatureMessage,
  setFeatureStory,
  setFeatureSubmissions,
  setIsSubmittingFeature,
  user,
}) {
  const handleFeatureSubmit = async () => {
    setIsSubmittingFeature(true);
    setFeatureMessage('');
    try {
      if (!featureConsent) throw new Error('Please confirm consent before submitting.');
      await submitFeatureSubmission(user.uid, { category: featureCategory, story: featureStory, mediaImageData: featureMediaData });
      const submissions = await getFeatureSubmissions(user.uid);
      setFeatureSubmissions(submissions);
      setFeatureStory('');
      setFeatureMediaData('');
      setFeatureConsent(false);
      setFeatureMessage('Submitted for review. We may feature it on @risewiththetribe.');
    } catch (err) {
      setFeatureMessage(err?.message || 'Could not submit your story.');
    } finally {
      setIsSubmittingFeature(false);
    }
  };

  return { handleFeatureSubmit };
}
