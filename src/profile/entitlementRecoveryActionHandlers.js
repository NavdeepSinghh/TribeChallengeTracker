import {
  getEntitlementRecoveryReviewQueue,
  requestEntitlementRecovery,
  reviewEntitlementRecoveryRequest,
} from '../userService';
import { STORE_CATALOG } from './profileConstants';

export function buildEntitlementRecoveryActionHandlers({
  activeChallengePackCount,
  challengePackProducts,
  entitlementRecoveryReviewNotes,
  isAdmin,
  isRequestingEntitlementRecovery,
  profile,
  proActive,
  reviewingEntitlementRecoveryRequestId,
  setEntitlementRecoveryMessage,
  setEntitlementRecoveryReviewQueue,
  setIsRequestingEntitlementRecovery,
  setReviewingEntitlementRecoveryRequestId,
  user,
}) {
  const handleEntitlementRecoveryRequest = async () => {
    if (isRequestingEntitlementRecovery) return;
    setIsRequestingEntitlementRecovery(true);
    setEntitlementRecoveryMessage('');
    try {
      await requestEntitlementRecovery(user.uid, {
        productCount: STORE_CATALOG.length,
        proActive,
        packCount: challengePackProducts.length,
        activePackCount: activeChallengePackCount,
        reason: proActive || activeChallengePackCount > 0 ? 'billing_question' : 'restore_sync_failed',
      });
      setEntitlementRecoveryMessage('Entitlement recovery request sent for manual review. This does not write entitlements, process refunds, cancel subscriptions, create purchases, or bypass marketplace policy.');
      if (isAdmin) {
        getEntitlementRecoveryReviewQueue().then(setEntitlementRecoveryReviewQueue).catch(() => setEntitlementRecoveryReviewQueue([]));
      }
    } catch (err) {
      setEntitlementRecoveryMessage(err?.message || 'Could not send entitlement recovery request.');
    } finally {
      setIsRequestingEntitlementRecovery(false);
    }
  };

  const handleEntitlementRecoveryReview = async (requestId, status) => {
    if (reviewingEntitlementRecoveryRequestId) return;
    setReviewingEntitlementRecoveryRequestId(requestId);
    try {
      await reviewEntitlementRecoveryRequest(requestId, {
        status,
        reviewNote: entitlementRecoveryReviewNotes[requestId] || '',
        reviewedBy: profile?.displayName || profile?.email || 'admin',
      });
      setEntitlementRecoveryMessage(`Entitlement recovery request marked ${status}. Manual review note saved without writing entitlements, processing refunds, cancelling subscriptions, creating purchases, or bypassing marketplace policy.`);
      getEntitlementRecoveryReviewQueue().then(setEntitlementRecoveryReviewQueue).catch(() => setEntitlementRecoveryReviewQueue([]));
    } catch (err) {
      setEntitlementRecoveryMessage(err?.message || 'Could not update entitlement recovery review.');
    } finally {
      setReviewingEntitlementRecoveryRequestId('');
    }
  };

  return {
    handleEntitlementRecoveryRequest,
    handleEntitlementRecoveryReview,
  };
}
