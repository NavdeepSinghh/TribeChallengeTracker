import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getEntitlementRecoveryReviewQueue } from './entitlementRecoveryService';
import { getUserProfile, sortByCreatedAtDesc } from './firestoreServiceUtils';
import { getStoreTestPurchaseEvidenceLog } from './storeTestEvidenceService';
import { getSupportReviewQueue } from './supportRequestService';

function supportReadinessScore({ openSupportCount, entitlementRecoveryCount, storeEvidenceCount, failedStoreEvidenceCount }) {
  return Math.min(
    100,
    Math.max(0, 40 - openSupportCount * 8)
      + Math.max(0, 25 - entitlementRecoveryCount * 8)
      + Math.min(25, storeEvidenceCount * 5)
      + Math.max(0, 10 - failedStoreEvidenceCount * 5),
  );
}

async function buildSupportRefundReadinessReviewPayload(uid) {
  const [profile, supportQueue, entitlementRecoveryQueue, storeEvidenceLog] = await Promise.all([
    getUserProfile(uid),
    getSupportReviewQueue(),
    getEntitlementRecoveryReviewQueue(),
    getStoreTestPurchaseEvidenceLog(),
  ]);
  const failedStoreEvidenceCount = storeEvidenceLog.filter(item => item.result === 'failed').length;
  const needsReviewEvidenceCount = storeEvidenceLog.filter(item => item.result === 'needs_review').length;
  const reviewScore = supportReadinessScore({
    openSupportCount: supportQueue.length,
    entitlementRecoveryCount: entitlementRecoveryQueue.length,
    storeEvidenceCount: storeEvidenceLog.length,
    failedStoreEvidenceCount,
  });
  const reviewId = `${uid}_${Date.now()}`;

  return {
    id: reviewId,
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    openSupportCount: supportQueue.length,
    entitlementRecoveryCount: entitlementRecoveryQueue.length,
    storeEvidenceCount: storeEvidenceLog.length,
    failedStoreEvidenceCount,
    needsReviewEvidenceCount,
    reviewScore,
    reviewScoreLabel: reviewScore >= 70 ? 'READY' : reviewScore >= 35 ? 'BUILD' : 'SEED',
    status: 'open',
    manualReviewOnly: true,
    processesRefunds: false,
    cancelsSubscriptions: false,
    writesEntitlements: false,
    createsPurchases: false,
    bypassesMarketplacePolicy: false,
    collectsPaymentDetails: false,
    isPaidAccessLive: false,
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export async function submitSupportRefundReadinessReview(uid) {
  const payload = await buildSupportRefundReadinessReviewPayload(uid);
  await setDoc(doc(db, 'supportRefundReadinessReviews', payload.id), payload);
  return payload;
}

export async function getSupportRefundReadinessReviewQueue() {
  const snap = await getDocs(query(collection(db, 'supportRefundReadinessReviews'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({ id: reviewDoc.id, ...reviewDoc.data() })));
}

export async function getApprovedSupportRefundReadinessReviews() {
  const snap = await getDocs(query(collection(db, 'supportRefundReadinessReviews'), where('status', '==', 'approved')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({ id: reviewDoc.id, ...reviewDoc.data() })));
}

export async function reviewSupportRefundReadinessReview(reviewId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanReviewId = String(reviewId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'approved', 'waiting', 'not_ready', 'declined']);
  if (!cleanReviewId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid support refund readiness review status.');
  }
  const payload = {
    status: cleanStatus,
    manualReviewOnly: true,
    processesRefunds: false,
    cancelsSubscriptions: false,
    writesEntitlements: false,
    createsPurchases: false,
    bypassesMarketplacePolicy: false,
    collectsPaymentDetails: false,
    isPaidAccessLive: false,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (cleanStatus === 'approved') payload.approvedAt = serverTimestamp();
  await updateDoc(doc(db, 'supportRefundReadinessReviews', cleanReviewId), payload);
  return payload;
}
