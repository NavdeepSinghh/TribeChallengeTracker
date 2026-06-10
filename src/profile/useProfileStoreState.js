import { useState } from 'react';

export default function useProfileStoreState() {
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [checkoutProductId, setCheckoutProductId] = useState('');
  const [entitlementRecoveryMessage, setEntitlementRecoveryMessage] = useState('');
  const [isRequestingEntitlementRecovery, setIsRequestingEntitlementRecovery] = useState(false);
  const [entitlementRecoveryReviewQueue, setEntitlementRecoveryReviewQueue] = useState([]);
  const [entitlementRecoveryReviewNotes, setEntitlementRecoveryReviewNotes] = useState({});
  const [reviewingEntitlementRecoveryRequestId, setReviewingEntitlementRecoveryRequestId] = useState('');
  const [storeTestEvidenceLog, setStoreTestEvidenceLog] = useState([]);
  const [storeTestEvidenceMessage, setStoreTestEvidenceMessage] = useState('');
  const [recordingStoreTestEvidenceId, setRecordingStoreTestEvidenceId] = useState('');
  const [storeTestEvidenceReviewNotes, setStoreTestEvidenceReviewNotes] = useState({});
  const [reviewingStoreTestEvidenceId, setReviewingStoreTestEvidenceId] = useState('');
  const [validationReadinessMessage, setValidationReadinessMessage] = useState('');
  const [isCheckingValidationReadiness, setIsCheckingValidationReadiness] = useState(false);
  const [supportRefundReadinessReviewQueue, setSupportRefundReadinessReviewQueue] = useState([]);
  const [approvedSupportRefundReadinessReviews, setApprovedSupportRefundReadinessReviews] = useState([]);
  const [supportRefundReadinessReviewMessage, setSupportRefundReadinessReviewMessage] = useState('');
  const [isSubmittingSupportRefundReadinessReview, setIsSubmittingSupportRefundReadinessReview] = useState(false);
  const [supportRefundReadinessReviewNotes, setSupportRefundReadinessReviewNotes] = useState({});
  const [reviewingSupportRefundReadinessReviewId, setReviewingSupportRefundReadinessReviewId] = useState('');

  return {
    approvedSupportRefundReadinessReviews,
    checkoutMessage,
    checkoutProductId,
    entitlementRecoveryMessage,
    entitlementRecoveryReviewNotes,
    entitlementRecoveryReviewQueue,
    isCheckingValidationReadiness,
    isRequestingEntitlementRecovery,
    isSubmittingSupportRefundReadinessReview,
    recordingStoreTestEvidenceId,
    reviewingEntitlementRecoveryRequestId,
    reviewingSupportRefundReadinessReviewId,
    reviewingStoreTestEvidenceId,
    setApprovedSupportRefundReadinessReviews,
    setCheckoutMessage,
    setCheckoutProductId,
    setEntitlementRecoveryMessage,
    setEntitlementRecoveryReviewNotes,
    setEntitlementRecoveryReviewQueue,
    setIsCheckingValidationReadiness,
    setIsRequestingEntitlementRecovery,
    setIsSubmittingSupportRefundReadinessReview,
    setRecordingStoreTestEvidenceId,
    setReviewingEntitlementRecoveryRequestId,
    setReviewingSupportRefundReadinessReviewId,
    setReviewingStoreTestEvidenceId,
    setStoreTestEvidenceLog,
    setStoreTestEvidenceMessage,
    setStoreTestEvidenceReviewNotes,
    setSupportRefundReadinessReviewMessage,
    setSupportRefundReadinessReviewNotes,
    setSupportRefundReadinessReviewQueue,
    setValidationReadinessMessage,
    storeTestEvidenceLog,
    storeTestEvidenceMessage,
    storeTestEvidenceReviewNotes,
    supportRefundReadinessReviewMessage,
    supportRefundReadinessReviewNotes,
    supportRefundReadinessReviewQueue,
    validationReadinessMessage,
  };
}
