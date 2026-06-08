import { buildFeatureMediaActionHandlers } from './featureMediaActionHandlers';
import { buildFeatureReviewActionHandlers } from './featureReviewActionHandlers';
import { buildFeatureSubmissionActionHandlers } from './featureSubmissionActionHandlers';

export default function useFeatureSubmissionActions({
  featureCategory,
  featureConsent,
  featureMediaData,
  featureReviewNotes,
  featureStory,
  setFeatureConsent,
  setFeatureMediaData,
  setFeatureMessage,
  setFeatureReviewQueue,
  setFeatureStory,
  setFeatureSubmissions,
  setIsSubmittingFeature,
  setReviewMessage,
  user,
}) {
  const mediaHandlers = buildFeatureMediaActionHandlers({
    setFeatureMediaData,
    setFeatureMessage,
  });
  const submissionHandlers = buildFeatureSubmissionActionHandlers({
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
  });
  const reviewHandlers = buildFeatureReviewActionHandlers({
    featureReviewNotes,
    setFeatureReviewQueue,
    setReviewMessage,
    user,
  });

  return {
    ...mediaHandlers,
    ...submissionHandlers,
    ...reviewHandlers,
  };
}
