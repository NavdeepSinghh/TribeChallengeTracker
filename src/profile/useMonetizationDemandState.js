import { useState } from 'react';

export default function useMonetizationDemandState() {
  const [campaignPerformanceSummary, setCampaignPerformanceSummary] = useState({});
  const [selectedCommunityEventInterestIds, setSelectedCommunityEventInterestIds] = useState([]);
  const [communityEventInterestMessage, setCommunityEventInterestMessage] = useState('');
  const [isSavingCommunityEventInterest, setIsSavingCommunityEventInterest] = useState(false);
  const [communityEventInterestSummary, setCommunityEventInterestSummary] = useState({});
  const [selectedProTrialReasonIds, setSelectedProTrialReasonIds] = useState([]);
  const [proTrialMessage, setProTrialMessage] = useState('');
  const [isSavingProTrialInterest, setIsSavingProTrialInterest] = useState(false);
  const [proTrialSummary, setProTrialSummary] = useState({});
  const [launchExperimentReviewQueue, setLaunchExperimentReviewQueue] = useState([]);
  const [approvedLaunchExperimentReviews, setApprovedLaunchExperimentReviews] = useState([]);
  const [launchExperimentReviewMessage, setLaunchExperimentReviewMessage] = useState('');
  const [isSubmittingLaunchExperimentReview, setIsSubmittingLaunchExperimentReview] = useState(false);
  const [launchExperimentReviewNotes, setLaunchExperimentReviewNotes] = useState({});
  const [reviewingLaunchExperimentReviewId, setReviewingLaunchExperimentReviewId] = useState('');

  return {
    approvedLaunchExperimentReviews,
    campaignPerformanceSummary,
    communityEventInterestMessage,
    communityEventInterestSummary,
    isSubmittingLaunchExperimentReview,
    isSavingCommunityEventInterest,
    isSavingProTrialInterest,
    launchExperimentReviewMessage,
    launchExperimentReviewNotes,
    launchExperimentReviewQueue,
    proTrialMessage,
    proTrialSummary,
    reviewingLaunchExperimentReviewId,
    selectedCommunityEventInterestIds,
    selectedProTrialReasonIds,
    setApprovedLaunchExperimentReviews,
    setCampaignPerformanceSummary,
    setCommunityEventInterestMessage,
    setCommunityEventInterestSummary,
    setIsSubmittingLaunchExperimentReview,
    setIsSavingCommunityEventInterest,
    setIsSavingProTrialInterest,
    setLaunchExperimentReviewMessage,
    setLaunchExperimentReviewNotes,
    setLaunchExperimentReviewQueue,
    setProTrialMessage,
    setProTrialSummary,
    setReviewingLaunchExperimentReviewId,
    setSelectedCommunityEventInterestIds,
    setSelectedProTrialReasonIds,
  };
}
