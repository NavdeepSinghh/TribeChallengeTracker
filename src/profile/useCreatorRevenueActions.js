import { buildCreatorHostingApplicationActionHandlers } from './creatorHostingApplicationActionHandlers';
import { buildCreatorProfileActionHandlers } from './creatorProfileActionHandlers';

export default function useCreatorRevenueActions({
  creatorAnalytics,
  creatorBio,
  creatorCtaUrl,
  creatorEnabled,
  creatorHostingApplicationReviewNotes,
  creatorRevenueShareInterest,
  creatorSpecialty,
  isAdmin,
  isSubmittingCreatorHostingApplication,
  proActive,
  profile,
  reviewingCreatorHostingApplicationId,
  setCreatorHostingApplicationMessage,
  setCreatorHostingApplicationReviewQueue,
  setCreatorMessage,
  setIsSavingCreator,
  setIsSubmittingCreatorHostingApplication,
  setProfile,
  setReviewingCreatorHostingApplicationId,
  user,
  onProfileUpdated,
}) {
  const creatorProfileHandlers = buildCreatorProfileActionHandlers({
    creatorBio,
    creatorCtaUrl,
    creatorEnabled,
    creatorRevenueShareInterest,
    creatorSpecialty,
    proActive,
    profile,
    setCreatorMessage,
    setIsSavingCreator,
    setProfile,
    user,
    onProfileUpdated,
  });

  const creatorHostingApplicationHandlers = buildCreatorHostingApplicationActionHandlers({
    creatorAnalytics,
    creatorEnabled,
    creatorHostingApplicationReviewNotes,
    creatorRevenueShareInterest,
    isAdmin,
    isSubmittingCreatorHostingApplication,
    proActive,
    profile,
    reviewingCreatorHostingApplicationId,
    setCreatorHostingApplicationMessage,
    setCreatorHostingApplicationReviewQueue,
    setIsSubmittingCreatorHostingApplication,
    setReviewingCreatorHostingApplicationId,
    user,
  });

  return {
    ...creatorHostingApplicationHandlers,
    ...creatorProfileHandlers,
  };
}
