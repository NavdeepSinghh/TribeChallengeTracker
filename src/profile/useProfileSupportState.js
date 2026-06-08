import { useState } from 'react';

export default function useProfileSupportState() {
  const [deletionRequestMessage, setDeletionRequestMessage] = useState('');
  const [isRequestingDeletion, setIsRequestingDeletion] = useState(false);
  const [supportCategory, setSupportCategory] = useState('general');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportStatusMessage, setSupportStatusMessage] = useState('');
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);
  const [referralRewardClaimMessage, setReferralRewardClaimMessage] = useState('');
  const [isClaimingReferralReward, setIsClaimingReferralReward] = useState(false);

  return {
    deletionRequestMessage,
    isClaimingReferralReward,
    isRequestingDeletion,
    isSubmittingSupport,
    referralRewardClaimMessage,
    setDeletionRequestMessage,
    setIsClaimingReferralReward,
    setIsRequestingDeletion,
    setIsSubmittingSupport,
    setReferralRewardClaimMessage,
    setSupportCategory,
    setSupportMessage,
    setSupportStatusMessage,
    supportCategory,
    supportMessage,
    supportStatusMessage,
  };
}
