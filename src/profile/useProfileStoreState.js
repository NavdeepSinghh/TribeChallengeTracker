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
  const [storeReviewResponseReviewQueue, setStoreReviewResponseReviewQueue] = useState([]);
  const [approvedStoreReviewResponseReviews, setApprovedStoreReviewResponseReviews] = useState([]);
  const [storeReviewResponseReviewMessage, setStoreReviewResponseReviewMessage] = useState('');
  const [isSubmittingStoreReviewResponseReview, setIsSubmittingStoreReviewResponseReview] = useState(false);
  const [storeReviewResponseReviewNotes, setStoreReviewResponseReviewNotes] = useState({});
  const [reviewingStoreReviewResponseReviewId, setReviewingStoreReviewResponseReviewId] = useState('');

  return {
    approvedStoreReviewResponseReviews,
    approvedSupportRefundReadinessReviews,
    checkoutMessage,
    checkoutProductId,
    entitlementRecoveryMessage,
    entitlementRecoveryReviewNotes,
    entitlementRecoveryReviewQueue,
    isCheckingValidationReadiness,
    isRequestingEntitlementRecovery,
    isSubmittingStoreReviewResponseReview,
    isSubmittingSupportRefundReadinessReview,
    recordingStoreTestEvidenceId,
    reviewingEntitlementRecoveryRequestId,
    reviewingStoreReviewResponseReviewId,
    reviewingSupportRefundReadinessReviewId,
    reviewingStoreTestEvidenceId,
    setApprovedStoreReviewResponseReviews,
    setApprovedSupportRefundReadinessReviews,
    setCheckoutMessage,
    setCheckoutProductId,
    setEntitlementRecoveryMessage,
    setEntitlementRecoveryReviewNotes,
    setEntitlementRecoveryReviewQueue,
    setIsCheckingValidationReadiness,
    setIsRequestingEntitlementRecovery,
    setIsSubmittingStoreReviewResponseReview,
    setIsSubmittingSupportRefundReadinessReview,
    setRecordingStoreTestEvidenceId,
    setReviewingEntitlementRecoveryRequestId,
    setReviewingStoreReviewResponseReviewId,
    setReviewingSupportRefundReadinessReviewId,
    setReviewingStoreTestEvidenceId,
    setStoreTestEvidenceLog,
    setStoreTestEvidenceMessage,
    setStoreTestEvidenceReviewNotes,
    setStoreReviewResponseReviewMessage,
    setStoreReviewResponseReviewNotes,
    setStoreReviewResponseReviewQueue,
    setSupportRefundReadinessReviewMessage,
    setSupportRefundReadinessReviewNotes,
    setSupportRefundReadinessReviewQueue,
    setValidationReadinessMessage,
    storeTestEvidenceLog,
    storeTestEvidenceMessage,
    storeTestEvidenceReviewNotes,
    storeReviewResponseReviewMessage,
    storeReviewResponseReviewNotes,
    storeReviewResponseReviewQueue,
    supportRefundReadinessReviewMessage,
    supportRefundReadinessReviewNotes,
    supportRefundReadinessReviewQueue,
    validationReadinessMessage,
  };
}
