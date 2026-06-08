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

  return {
    campaignPerformanceSummary,
    communityEventInterestMessage,
    communityEventInterestSummary,
    isSavingCommunityEventInterest,
    isSavingProTrialInterest,
    proTrialMessage,
    proTrialSummary,
    selectedCommunityEventInterestIds,
    selectedProTrialReasonIds,
    setCampaignPerformanceSummary,
    setCommunityEventInterestMessage,
    setCommunityEventInterestSummary,
    setIsSavingCommunityEventInterest,
    setIsSavingProTrialInterest,
    setProTrialMessage,
    setProTrialSummary,
    setSelectedCommunityEventInterestIds,
    setSelectedProTrialReasonIds,
  };
}
