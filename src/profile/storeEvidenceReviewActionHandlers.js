import {
  getStoreTestPurchaseEvidenceLog,
  reviewStoreTestPurchaseEvidence,
} from '../userService';

export function buildStoreEvidenceReviewActionHandlers({
  isAdmin,
  profile,
  reviewingStoreTestEvidenceId,
  setReviewingStoreTestEvidenceId,
  setStoreTestEvidenceLog,
  setStoreTestEvidenceMessage,
  storeTestEvidenceReviewNotes,
  user,
}) {
  const handleReviewStoreTestEvidence = async (evidenceId, result, status = 'reviewed') => {
    if (!isAdmin || reviewingStoreTestEvidenceId) return;
    setReviewingStoreTestEvidenceId(evidenceId);
    setStoreTestEvidenceMessage('');
    try {
      await reviewStoreTestPurchaseEvidence(evidenceId, {
        result,
        status,
        reviewNote: storeTestEvidenceReviewNotes[evidenceId] || '',
        reviewedBy: profile?.displayName || user.email || 'admin',
      });
      setStoreTestEvidenceMessage(`Store test purchase evidence marked ${result}. Review note saved without writing entitlements, creating purchases, processing refunds, bypassing marketplace policy, or marking paid access live.`);
      getStoreTestPurchaseEvidenceLog().then(setStoreTestEvidenceLog).catch(() => setStoreTestEvidenceLog([]));
    } catch (err) {
      setStoreTestEvidenceMessage(err?.message || 'Could not review store test purchase evidence.');
    } finally {
      setReviewingStoreTestEvidenceId('');
    }
  };

  return { handleReviewStoreTestEvidence };
}
