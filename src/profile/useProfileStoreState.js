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

  return {
    checkoutMessage,
    checkoutProductId,
    entitlementRecoveryMessage,
    entitlementRecoveryReviewNotes,
    entitlementRecoveryReviewQueue,
    isCheckingValidationReadiness,
    isRequestingEntitlementRecovery,
    recordingStoreTestEvidenceId,
    reviewingEntitlementRecoveryRequestId,
    reviewingStoreTestEvidenceId,
    setCheckoutMessage,
    setCheckoutProductId,
    setEntitlementRecoveryMessage,
    setEntitlementRecoveryReviewNotes,
    setEntitlementRecoveryReviewQueue,
    setIsCheckingValidationReadiness,
    setIsRequestingEntitlementRecovery,
    setRecordingStoreTestEvidenceId,
    setReviewingEntitlementRecoveryRequestId,
    setReviewingStoreTestEvidenceId,
    setStoreTestEvidenceLog,
    setStoreTestEvidenceMessage,
    setStoreTestEvidenceReviewNotes,
    setValidationReadinessMessage,
    storeTestEvidenceLog,
    storeTestEvidenceMessage,
    storeTestEvidenceReviewNotes,
    validationReadinessMessage,
  };
}
