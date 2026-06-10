import { useState } from 'react';

export default function useProfileReviewState() {
  const [accountDeletionReviewQueue, setAccountDeletionReviewQueue] = useState([]);
  const [accountDeletionReviewNotes, setAccountDeletionReviewNotes] = useState({});
  const [reviewingAccountDeletionRequestId, setReviewingAccountDeletionRequestId] = useState('');
  const [supportReviewQueue, setSupportReviewQueue] = useState([]);
  const [supportReviewNotes, setSupportReviewNotes] = useState({});
  const [reviewingSupportRequestId, setReviewingSupportRequestId] = useState('');
  const [referralRewardReviewQueue, setReferralRewardReviewQueue] = useState([]);
  const [referralRewardReviewNotes, setReferralRewardReviewNotes] = useState({});
  const [reviewingReferralRewardClaimId, setReviewingReferralRewardClaimId] = useState('');
  const [referralRewardHandoffAuditReviewQueue, setReferralRewardHandoffAuditReviewQueue] = useState([]);
  const [approvedReferralRewardHandoffAuditReviews, setApprovedReferralRewardHandoffAuditReviews] = useState([]);
  const [referralRewardHandoffAuditReviewMessage, setReferralRewardHandoffAuditReviewMessage] = useState('');
  const [isSubmittingReferralRewardHandoffAuditReview, setIsSubmittingReferralRewardHandoffAuditReview] = useState(false);
  const [referralRewardHandoffAuditReviewNotes, setReferralRewardHandoffAuditReviewNotes] = useState({});
  const [reviewingReferralRewardHandoffAuditReviewId, setReviewingReferralRewardHandoffAuditReviewId] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');

  return {
    accountDeletionReviewNotes,
    accountDeletionReviewQueue,
    approvedReferralRewardHandoffAuditReviews,
    isSubmittingReferralRewardHandoffAuditReview,
    referralRewardHandoffAuditReviewMessage,
    referralRewardHandoffAuditReviewNotes,
    referralRewardHandoffAuditReviewQueue,
    referralRewardReviewNotes,
    referralRewardReviewQueue,
    reviewMessage,
    reviewingAccountDeletionRequestId,
    reviewingReferralRewardHandoffAuditReviewId,
    reviewingReferralRewardClaimId,
    reviewingSupportRequestId,
    setAccountDeletionReviewNotes,
    setAccountDeletionReviewQueue,
    setApprovedReferralRewardHandoffAuditReviews,
    setIsSubmittingReferralRewardHandoffAuditReview,
    setReferralRewardHandoffAuditReviewMessage,
    setReferralRewardHandoffAuditReviewNotes,
    setReferralRewardHandoffAuditReviewQueue,
    setReferralRewardReviewNotes,
    setReferralRewardReviewQueue,
    setReviewMessage,
    setReviewingAccountDeletionRequestId,
    setReviewingReferralRewardHandoffAuditReviewId,
    setReviewingReferralRewardClaimId,
    setReviewingSupportRequestId,
    setSupportReviewNotes,
    setSupportReviewQueue,
    supportReviewNotes,
    supportReviewQueue,
  };
}
