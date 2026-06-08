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
  const [reviewMessage, setReviewMessage] = useState('');

  return {
    accountDeletionReviewNotes,
    accountDeletionReviewQueue,
    referralRewardReviewNotes,
    referralRewardReviewQueue,
    reviewMessage,
    reviewingAccountDeletionRequestId,
    reviewingReferralRewardClaimId,
    reviewingSupportRequestId,
    setAccountDeletionReviewNotes,
    setAccountDeletionReviewQueue,
    setReferralRewardReviewNotes,
    setReferralRewardReviewQueue,
    setReviewMessage,
    setReviewingAccountDeletionRequestId,
    setReviewingReferralRewardClaimId,
    setReviewingSupportRequestId,
    setSupportReviewNotes,
    setSupportReviewQueue,
    supportReviewNotes,
    supportReviewQueue,
  };
}
