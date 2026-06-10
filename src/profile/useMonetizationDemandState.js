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
  const [weeklyCampaignReviewQueue, setWeeklyCampaignReviewQueue] = useState([]);
  const [approvedWeeklyCampaignReviews, setApprovedWeeklyCampaignReviews] = useState([]);
  const [weeklyCampaignReviewMessage, setWeeklyCampaignReviewMessage] = useState('');
  const [isSubmittingWeeklyCampaignReview, setIsSubmittingWeeklyCampaignReview] = useState(false);
  const [weeklyCampaignReviewNotes, setWeeklyCampaignReviewNotes] = useState({});
  const [reviewingWeeklyCampaignReviewId, setReviewingWeeklyCampaignReviewId] = useState('');

  return {
    approvedLaunchExperimentReviews,
    approvedWeeklyCampaignReviews,
    campaignPerformanceSummary,
    communityEventInterestMessage,
    communityEventInterestSummary,
    isSubmittingLaunchExperimentReview,
    isSubmittingWeeklyCampaignReview,
    isSavingCommunityEventInterest,
    isSavingProTrialInterest,
    launchExperimentReviewMessage,
    launchExperimentReviewNotes,
    launchExperimentReviewQueue,
    proTrialMessage,
    proTrialSummary,
    reviewingLaunchExperimentReviewId,
    reviewingWeeklyCampaignReviewId,
    selectedCommunityEventInterestIds,
    selectedProTrialReasonIds,
    setApprovedLaunchExperimentReviews,
    setApprovedWeeklyCampaignReviews,
    setCampaignPerformanceSummary,
    setCommunityEventInterestMessage,
    setCommunityEventInterestSummary,
    setIsSubmittingLaunchExperimentReview,
    setIsSubmittingWeeklyCampaignReview,
    setIsSavingCommunityEventInterest,
    setIsSavingProTrialInterest,
    setLaunchExperimentReviewMessage,
    setLaunchExperimentReviewNotes,
    setLaunchExperimentReviewQueue,
    setProTrialMessage,
    setProTrialSummary,
    setReviewingLaunchExperimentReviewId,
    setReviewingWeeklyCampaignReviewId,
    setSelectedCommunityEventInterestIds,
    setSelectedProTrialReasonIds,
    setWeeklyCampaignReviewMessage,
    setWeeklyCampaignReviewNotes,
    setWeeklyCampaignReviewQueue,
    weeklyCampaignReviewMessage,
    weeklyCampaignReviewNotes,
    weeklyCampaignReviewQueue,
  };
}
