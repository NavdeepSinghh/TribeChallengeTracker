import { useState } from 'react';

export default function useMonetizationDemandState() {
  const [campaignPerformanceSummary, setCampaignPerformanceSummary] = useState({});
  const [selectedCommunityEventInterestIds, setSelectedCommunityEventInterestIds] = useState([]);
  const [communityEventInterestMessage, setCommunityEventInterestMessage] = useState('');
  const [isSavingCommunityEventInterest, setIsSavingCommunityEventInterest] = useState(false);
  const [communityEventInterestSummary, setCommunityEventInterestSummary] = useState({});
  const [communityEventReviewQueue, setCommunityEventReviewQueue] = useState([]);
  const [approvedCommunityEventReviews, setApprovedCommunityEventReviews] = useState([]);
  const [communityEventReviewMessage, setCommunityEventReviewMessage] = useState('');
  const [isSubmittingCommunityEventReview, setIsSubmittingCommunityEventReview] = useState(false);
  const [communityEventReviewNotes, setCommunityEventReviewNotes] = useState({});
  const [reviewingCommunityEventReviewId, setReviewingCommunityEventReviewId] = useState('');
  const [customerValueReviewQueue, setCustomerValueReviewQueue] = useState([]);
  const [approvedCustomerValueReviews, setApprovedCustomerValueReviews] = useState([]);
  const [customerValueReviewMessage, setCustomerValueReviewMessage] = useState('');
  const [isSubmittingCustomerValueReview, setIsSubmittingCustomerValueReview] = useState(false);
  const [customerValueReviewNotes, setCustomerValueReviewNotes] = useState({});
  const [reviewingCustomerValueReviewId, setReviewingCustomerValueReviewId] = useState('');
  const [selectedProTrialReasonIds, setSelectedProTrialReasonIds] = useState([]);
  const [proTrialMessage, setProTrialMessage] = useState('');
  const [isSavingProTrialInterest, setIsSavingProTrialInterest] = useState(false);
  const [proTrialSummary, setProTrialSummary] = useState({});
  const [proTrialReviewQueue, setProTrialReviewQueue] = useState([]);
  const [approvedProTrialReviews, setApprovedProTrialReviews] = useState([]);
  const [proTrialReviewMessage, setProTrialReviewMessage] = useState('');
  const [isSubmittingProTrialReview, setIsSubmittingProTrialReview] = useState(false);
  const [proTrialReviewNotes, setProTrialReviewNotes] = useState({});
  const [reviewingProTrialReviewId, setReviewingProTrialReviewId] = useState('');
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
    approvedCommunityEventReviews,
    approvedCustomerValueReviews,
    approvedProTrialReviews,
    approvedWeeklyCampaignReviews,
    campaignPerformanceSummary,
    communityEventInterestMessage,
    communityEventInterestSummary,
    communityEventReviewMessage,
    communityEventReviewNotes,
    communityEventReviewQueue,
    customerValueReviewMessage,
    customerValueReviewNotes,
    customerValueReviewQueue,
    isSubmittingCommunityEventReview,
    isSubmittingCustomerValueReview,
    isSubmittingLaunchExperimentReview,
    isSubmittingWeeklyCampaignReview,
    isSavingCommunityEventInterest,
    isSavingProTrialInterest,
    isSubmittingProTrialReview,
    launchExperimentReviewMessage,
    launchExperimentReviewNotes,
    launchExperimentReviewQueue,
    proTrialMessage,
    proTrialReviewMessage,
    proTrialReviewNotes,
    proTrialReviewQueue,
    proTrialSummary,
    reviewingLaunchExperimentReviewId,
    reviewingCommunityEventReviewId,
    reviewingCustomerValueReviewId,
    reviewingProTrialReviewId,
    reviewingWeeklyCampaignReviewId,
    selectedCommunityEventInterestIds,
    selectedProTrialReasonIds,
    setApprovedLaunchExperimentReviews,
    setApprovedCommunityEventReviews,
    setApprovedCustomerValueReviews,
    setApprovedProTrialReviews,
    setApprovedWeeklyCampaignReviews,
    setCampaignPerformanceSummary,
    setCommunityEventInterestMessage,
    setCommunityEventInterestSummary,
    setCommunityEventReviewMessage,
    setCommunityEventReviewNotes,
    setCommunityEventReviewQueue,
    setIsSubmittingCommunityEventReview,
    setCustomerValueReviewMessage,
    setCustomerValueReviewNotes,
    setCustomerValueReviewQueue,
    setIsSubmittingCustomerValueReview,
    setIsSubmittingLaunchExperimentReview,
    setIsSubmittingWeeklyCampaignReview,
    setIsSavingCommunityEventInterest,
    setIsSavingProTrialInterest,
    setIsSubmittingProTrialReview,
    setLaunchExperimentReviewMessage,
    setLaunchExperimentReviewNotes,
    setLaunchExperimentReviewQueue,
    setProTrialMessage,
    setProTrialReviewMessage,
    setProTrialReviewNotes,
    setProTrialReviewQueue,
    setProTrialSummary,
    setReviewingLaunchExperimentReviewId,
    setReviewingCommunityEventReviewId,
    setReviewingCustomerValueReviewId,
    setReviewingProTrialReviewId,
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
