import {
  getStoreTestPurchaseEvidenceLog,
  recordStoreTestPurchaseEvidence,
} from '../userService';

export function buildStoreEvidenceRecordActionHandlers({
  isAdmin,
  recordingStoreTestEvidenceId,
  setRecordingStoreTestEvidenceId,
  setStoreTestEvidenceLog,
  setStoreTestEvidenceMessage,
  user,
}) {
  const handleRecordStoreTestEvidence = async test => {
    if (!isAdmin || recordingStoreTestEvidenceId || !test?.productId) return;
    setRecordingStoreTestEvidenceId(test.id);
    setStoreTestEvidenceMessage('');
    try {
      await recordStoreTestPurchaseEvidence(user.uid, {
        platform: test.platform,
        productId: test.productId,
        testCase: test.testCase,
        result: 'needs_review',
        evidenceNote: `${test.label} evidence captured manually; verify screenshot, tester account, receipt validation log, and entitlement outcome before launch approval.`,
      });
      setStoreTestEvidenceMessage('Store test purchase evidence recorded for admin review. This does not write entitlements, create purchases, process refunds, or mark paid access live.');
      getStoreTestPurchaseEvidenceLog().then(setStoreTestEvidenceLog).catch(() => setStoreTestEvidenceLog([]));
    } catch (err) {
      setStoreTestEvidenceMessage(err?.message || 'Could not record store test purchase evidence.');
    } finally {
      setRecordingStoreTestEvidenceId('');
    }
  };

  return { handleRecordStoreTestEvidence };
}
