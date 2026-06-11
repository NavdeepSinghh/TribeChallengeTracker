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
  const [partnerCampaignRetrospectiveReviewQueue, setPartnerCampaignRetrospectiveReviewQueue] = useState([]);
  const [approvedPartnerCampaignRetrospectiveReviews, setApprovedPartnerCampaignRetrospectiveReviews] = useState([]);
  const [partnerCampaignRetrospectiveReviewMessage, setPartnerCampaignRetrospectiveReviewMessage] = useState('');
  const [isSubmittingPartnerCampaignRetrospectiveReview, setIsSubmittingPartnerCampaignRetrospectiveReview] = useState(false);
  const [partnerCampaignRetrospectiveReviewNotes, setPartnerCampaignRetrospectiveReviewNotes] = useState({});
  const [reviewingPartnerCampaignRetrospectiveReviewId, setReviewingPartnerCampaignRetrospectiveReviewId] = useState('');
  const [partnerPerkClaimReviewQueue, setPartnerPerkClaimReviewQueue] = useState([]);
  const [partnerPerkClaims, setPartnerPerkClaims] = useState([]);
  const [partnerPerkClaimMessage, setPartnerPerkClaimMessage] = useState('');
  const [claimingPartnerPerkId, setClaimingPartnerPerkId] = useState('');
  const [partnerPerkReviewNotes, setPartnerPerkReviewNotes] = useState({});
  const [reviewingPartnerPerkClaimId, setReviewingPartnerPerkClaimId] = useState('');
  const [partnerPerkHandoffAuditReviewQueue, setPartnerPerkHandoffAuditReviewQueue] = useState([]);
  const [approvedPartnerPerkHandoffAuditReviews, setApprovedPartnerPerkHandoffAuditReviews] = useState([]);
  const [partnerPerkHandoffAuditReviewMessage, setPartnerPerkHandoffAuditReviewMessage] = useState('');
  const [isSubmittingPartnerPerkHandoffAuditReview, setIsSubmittingPartnerPerkHandoffAuditReview] = useState(false);
  const [partnerPerkHandoffAuditReviewNotes, setPartnerPerkHandoffAuditReviewNotes] = useState({});
  const [reviewingPartnerPerkHandoffAuditReviewId, setReviewingPartnerPerkHandoffAuditReviewId] = useState('');

  return {
    approvedPartnerPerkHandoffAuditReviews,
    approvedPartnerCampaignRetrospectiveReviews,
    claimingPartnerPerkId,
    isSubmittingPartnerPerkHandoffAuditReview,
    isSavingPartnerPerks,
    isSubmittingPartnerCampaignApplication,
    isSubmittingPartnerCampaignRetrospectiveReview,
    partnerCampaignApplicationMessage,
    partnerCampaignApplicationReviewNotes,
    partnerCampaignApplicationReviewQueue,
    partnerCampaignRetrospectiveReviewMessage,
    partnerCampaignRetrospectiveReviewNotes,
    partnerCampaignRetrospectiveReviewQueue,
    partnerPerkClaimMessage,
    partnerPerkClaimReviewQueue,
    partnerPerkClaims,
    partnerPerkHandoffAuditReviewMessage,
    partnerPerkHandoffAuditReviewNotes,
    partnerPerkHandoffAuditReviewQueue,
    partnerPerkMessage,
    partnerPerkReviewNotes,
    partnerPerkSummary,
    reviewingPartnerCampaignApplicationId,
    reviewingPartnerCampaignRetrospectiveReviewId,
    reviewingPartnerPerkHandoffAuditReviewId,
    reviewingPartnerPerkClaimId,
    selectedPartnerPerkIds,
    setClaimingPartnerPerkId,
    setApprovedPartnerPerkHandoffAuditReviews,
    setApprovedPartnerCampaignRetrospectiveReviews,
    setIsSubmittingPartnerPerkHandoffAuditReview,
    setIsSavingPartnerPerks,
    setIsSubmittingPartnerCampaignApplication,
    setIsSubmittingPartnerCampaignRetrospectiveReview,
    setPartnerCampaignApplicationMessage,
    setPartnerCampaignApplicationReviewNotes,
    setPartnerCampaignApplicationReviewQueue,
    setPartnerCampaignRetrospectiveReviewMessage,
    setPartnerCampaignRetrospectiveReviewNotes,
    setPartnerCampaignRetrospectiveReviewQueue,
    setPartnerPerkClaimMessage,
    setPartnerPerkClaimReviewQueue,
    setPartnerPerkClaims,
    setPartnerPerkHandoffAuditReviewMessage,
    setPartnerPerkHandoffAuditReviewNotes,
    setPartnerPerkHandoffAuditReviewQueue,
    setPartnerPerkMessage,
    setPartnerPerkReviewNotes,
    setPartnerPerkSummary,
    setReviewingPartnerCampaignApplicationId,
    setReviewingPartnerCampaignRetrospectiveReviewId,
    setReviewingPartnerPerkHandoffAuditReviewId,
    setReviewingPartnerPerkClaimId,
    setSelectedPartnerPerkIds,
  };
}
