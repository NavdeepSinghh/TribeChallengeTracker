import { useState } from 'react';

export default function usePartnerRevenueState() {
  const [selectedPartnerPerkIds, setSelectedPartnerPerkIds] = useState([]);
  const [partnerPerkMessage, setPartnerPerkMessage] = useState('');
  const [isSavingPartnerPerks, setIsSavingPartnerPerks] = useState(false);
  const [partnerPerkSummary, setPartnerPerkSummary] = useState({});
  const [partnerCampaignApplicationReviewQueue, setPartnerCampaignApplicationReviewQueue] = useState([]);
  const [partnerCampaignApplicationMessage, setPartnerCampaignApplicationMessage] = useState('');
  const [isSubmittingPartnerCampaignApplication, setIsSubmittingPartnerCampaignApplication] = useState(false);
  const [partnerCampaignApplicationReviewNotes, setPartnerCampaignApplicationReviewNotes] = useState({});
  const [reviewingPartnerCampaignApplicationId, setReviewingPartnerCampaignApplicationId] = useState('');
  const [partnerPerkClaimReviewQueue, setPartnerPerkClaimReviewQueue] = useState([]);
  const [partnerPerkClaims, setPartnerPerkClaims] = useState([]);
  const [partnerPerkClaimMessage, setPartnerPerkClaimMessage] = useState('');
  const [claimingPartnerPerkId, setClaimingPartnerPerkId] = useState('');
  const [partnerPerkReviewNotes, setPartnerPerkReviewNotes] = useState({});
  const [reviewingPartnerPerkClaimId, setReviewingPartnerPerkClaimId] = useState('');

  return {
    claimingPartnerPerkId,
    isSavingPartnerPerks,
    isSubmittingPartnerCampaignApplication,
    partnerCampaignApplicationMessage,
    partnerCampaignApplicationReviewNotes,
    partnerCampaignApplicationReviewQueue,
    partnerPerkClaimMessage,
    partnerPerkClaimReviewQueue,
    partnerPerkClaims,
    partnerPerkMessage,
    partnerPerkReviewNotes,
    partnerPerkSummary,
    reviewingPartnerCampaignApplicationId,
    reviewingPartnerPerkClaimId,
    selectedPartnerPerkIds,
    setClaimingPartnerPerkId,
    setIsSavingPartnerPerks,
    setIsSubmittingPartnerCampaignApplication,
    setPartnerCampaignApplicationMessage,
    setPartnerCampaignApplicationReviewNotes,
    setPartnerCampaignApplicationReviewQueue,
    setPartnerPerkClaimMessage,
    setPartnerPerkClaimReviewQueue,
    setPartnerPerkClaims,
    setPartnerPerkMessage,
    setPartnerPerkReviewNotes,
    setPartnerPerkSummary,
    setReviewingPartnerCampaignApplicationId,
    setReviewingPartnerPerkClaimId,
    setSelectedPartnerPerkIds,
  };
}
