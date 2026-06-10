import {
  saveCommunityEventInterest,
  saveProTrialInterest,
} from '../userService';
import { buildLaunchExperimentReviewActionHandlers } from './launchExperimentReviewActionHandlers';
import { buildProTrialReviewActionHandlers } from './proTrialReviewActionHandlers';
import { buildWeeklyCampaignReviewActionHandlers } from './weeklyCampaignReviewActionHandlers';

export default function useMonetizationInterestActions({
  approvedLaunchExperimentReviews,
  approvedProTrialReviews,
  approvedWeeklyCampaignReviews,
  campaignPerformanceSummary,
  featureReviewQueue,
  isAdmin,
  isSubmittingLaunchExperimentReview,
  isSubmittingProTrialReview,
  isSubmittingWeeklyCampaignReview,
  launchExperimentReviewNotes,
  profile,
  proTrialReviewNotes,
  recommendedLaunchExperiment,
  referralJoins,
  reviewingLaunchExperimentReviewId,
  reviewingProTrialReviewId,
  reviewingWeeklyCampaignReviewId,
  selectedCommunityEventInterestIds,
  selectedProTrialReasonIds,
  setApprovedLaunchExperimentReviews,
  setApprovedProTrialReviews,
  setApprovedWeeklyCampaignReviews,
  setCommunityEventInterestMessage,
  setIsSubmittingLaunchExperimentReview,
  setIsSubmittingProTrialReview,
  setIsSubmittingWeeklyCampaignReview,
  setIsSavingCommunityEventInterest,
  setIsSavingProTrialInterest,
  setLaunchExperimentReviewMessage,
  setLaunchExperimentReviewQueue,
  setProfile,
  setProTrialMessage,
  setProTrialReviewMessage,
  setProTrialReviewQueue,
  setReviewingLaunchExperimentReviewId,
  setReviewingProTrialReviewId,
  setReviewingWeeklyCampaignReviewId,
  setSelectedCommunityEventInterestIds,
  setSelectedProTrialReasonIds,
  setWeeklyCampaignReviewMessage,
  setWeeklyCampaignReviewQueue,
  supportReviewQueue,
  user,
  weeklyCampaignPrompt,
  weeklyCampaignReviewNotes,
  onProfileUpdated,
}) {
  const handleCommunityEventInterestToggle = async eventId => {
    const nextSelectedIds = selectedCommunityEventInterestIds.includes(eventId)
      ? selectedCommunityEventInterestIds.filter(id => id !== eventId)
      : [...selectedCommunityEventInterestIds, eventId];
    setSelectedCommunityEventInterestIds(nextSelectedIds);
    setIsSavingCommunityEventInterest(true);
    setCommunityEventInterestMessage('');
    try {
      const communityEventInterest = await saveCommunityEventInterest(user.uid, nextSelectedIds);
      setSelectedCommunityEventInterestIds(communityEventInterest.selectedIds || []);
      setProfile(p => ({ ...(p || {}), communityEventInterest }));
      onProfileUpdated?.({ ...(profile || {}), communityEventInterest });
      setCommunityEventInterestMessage(communityEventInterest.selectedIds?.length ? 'Community event interest saved.' : 'Community event interest cleared.');
    } catch (err) {
      setSelectedCommunityEventInterestIds(selectedCommunityEventInterestIds);
      setCommunityEventInterestMessage(err?.message || 'Could not save community event interest.');
    } finally {
      setIsSavingCommunityEventInterest(false);
    }
  };

  const handleProTrialReasonToggle = async reasonId => {
    const nextSelectedIds = selectedProTrialReasonIds.includes(reasonId)
      ? selectedProTrialReasonIds.filter(id => id !== reasonId)
      : [...selectedProTrialReasonIds, reasonId];
    setSelectedProTrialReasonIds(nextSelectedIds);
    setIsSavingProTrialInterest(true);
    setProTrialMessage('');
    try {
      const proTrialInterest = await saveProTrialInterest(user.uid, nextSelectedIds);
      setSelectedProTrialReasonIds(proTrialInterest.selectedIds || []);
      setProfile(p => ({ ...(p || {}), proTrialInterest }));
      onProfileUpdated?.({ ...(profile || {}), proTrialInterest });
      setProTrialMessage(proTrialInterest.selectedIds?.length ? 'Pro trial interest saved.' : 'Pro trial interest cleared.');
    } catch (err) {
      setSelectedProTrialReasonIds(selectedProTrialReasonIds);
      setProTrialMessage(err?.message || 'Could not save Pro trial interest.');
    } finally {
      setIsSavingProTrialInterest(false);
    }
  };

  const launchExperimentReviewHandlers = buildLaunchExperimentReviewActionHandlers({
    approvedLaunchExperimentReviews,
    isAdmin,
    isSubmittingLaunchExperimentReview,
    launchExperimentReviewNotes,
    reviewingLaunchExperimentReviewId,
    setApprovedLaunchExperimentReviews,
    setIsSubmittingLaunchExperimentReview,
    setLaunchExperimentReviewMessage,
    setLaunchExperimentReviewQueue,
    setReviewingLaunchExperimentReviewId,
    user,
  });

  const proTrialReviewHandlers = buildProTrialReviewActionHandlers({
    approvedProTrialReviews,
    isAdmin,
    isSubmittingProTrialReview,
    proTrialReviewNotes,
    reviewingProTrialReviewId,
    setApprovedProTrialReviews,
    setIsSubmittingProTrialReview,
    setProTrialReviewMessage,
    setProTrialReviewQueue,
    setReviewingProTrialReviewId,
    user,
  });

  const weeklyCampaignReviewHandlers = buildWeeklyCampaignReviewActionHandlers({
    approvedWeeklyCampaignReviews,
    campaignPerformanceSummary,
    featureReviewQueue,
    isAdmin,
    isSubmittingWeeklyCampaignReview,
    recommendedLaunchExperiment,
    referralJoins,
    reviewingWeeklyCampaignReviewId,
    setApprovedWeeklyCampaignReviews,
    setIsSubmittingWeeklyCampaignReview,
    setReviewingWeeklyCampaignReviewId,
    setWeeklyCampaignReviewMessage,
    setWeeklyCampaignReviewQueue,
    supportReviewQueue,
    user,
    weeklyCampaignPrompt,
    weeklyCampaignReviewNotes,
  });

  return {
    handleCommunityEventInterestToggle,
    ...launchExperimentReviewHandlers,
    ...proTrialReviewHandlers,
    ...weeklyCampaignReviewHandlers,
    handleProTrialReasonToggle,
  };
}
