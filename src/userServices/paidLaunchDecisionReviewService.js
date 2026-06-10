import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { STORE_PRODUCT_IDS } from '../proFeatures';
import { db } from '../firebase';
import { getEntitlementRecoveryReviewQueue } from './entitlementRecoveryService';
import { getUserProfile, sortByCreatedAtDesc } from './firestoreServiceUtils';
import { getStoreTestPurchaseEvidenceLog } from './storeTestEvidenceService';
import { getSupportReviewQueue } from './supportRequestService';

function scorePaidLaunchDecision({ productCount, storeEvidenceCount, failedStoreEvidenceCount, needsReviewEvidenceCount, openSupportCount, entitlementRecoveryCount }) {
  return Math.min(
    100,
    Math.min(20, productCount * 5)
      + Math.min(30, storeEvidenceCount * 5)
      + Math.max(0, 20 - failedStoreEvidenceCount * 5)
      + Math.max(0, 15 - needsReviewEvidenceCount * 3)
      + Math.max(0, 10 - openSupportCount * 2)
      + Math.max(0, 5 - entitlementRecoveryCount),
  );
}

async function buildPaidLaunchDecisionReviewPayload(uid) {
  const [profile, supportQueue, entitlementRecoveryQueue, storeEvidenceLog] = await Promise.all([
    getUserProfile(uid),
    getSupportReviewQueue(),
    getEntitlementRecoveryReviewQueue(),
    getStoreTestPurchaseEvidenceLog(),
  ]);
  const failedStoreEvidenceCount = storeEvidenceLog.filter(item => item.result === 'failed').length;
  const needsReviewEvidenceCount = storeEvidenceLog.filter(item => item.result === 'needs_review').length;
  const passedStoreEvidenceCount = storeEvidenceLog.filter(item => item.result === 'passed' || item.result === 'verified').length;
  const reviewScore = scorePaidLaunchDecision({
    productCount: STORE_PRODUCT_IDS.length,
    storeEvidenceCount: storeEvidenceLog.length,
    failedStoreEvidenceCount,
    needsReviewEvidenceCount,
    openSupportCount: supportQueue.length,
    entitlementRecoveryCount: entitlementRecoveryQueue.length,
  });
  const reviewId = `${uid}_${Date.now()}`;

  return {
    id: reviewId,
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    productCount: STORE_PRODUCT_IDS.length,
    storeEvidenceCount: storeEvidenceLog.length,
    passedStoreEvidenceCount,
    failedStoreEvidenceCount,
    needsReviewEvidenceCount,
    openSupportCount: supportQueue.length,
    entitlementRecoveryCount: entitlementRecoveryQueue.length,
    readyCheckCount: reviewScore >= 80 ? 6 : reviewScore >= 50 ? 3 : 1,
    totalCheckCount: 6,
    reviewScore,
    reviewScoreLabel: reviewScore >= 80 ? 'READY' : reviewScore >= 50 ? 'HOLD' : 'BLOCKED',
    status: 'open',
    manualReviewOnly: true,
    flipsPaidAccessLive: false,
    writesEntitlements: false,
    createsPurchases: false,
    processesPayments: false,
    processesRefunds: false,
    cancelsSubscriptions: false,
    collectsPaymentDetails: false,
    submitsStoreReview: false,
    bypassesMarketplacePolicy: false,
    claimsLaunchReadiness: false,
    claimsSandboxProof: false,
    isPaidAccessLive: false,
    hasTrackingPixels: false,
    scrapesMessages: false,
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export async function submitPaidLaunchDecisionReview(uid) {
  const payload = await buildPaidLaunchDecisionReviewPayload(uid);
  await setDoc(doc(db, 'paidLaunchDecisionReviews', payload.id), payload);
  return payload;
}

export async function getPaidLaunchDecisionReviewQueue() {
  const snap = await getDocs(query(collection(db, 'paidLaunchDecisionReviews'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({ id: reviewDoc.id, ...reviewDoc.data() })));
}

export async function getApprovedPaidLaunchDecisionReviews() {
  const snap = await getDocs(query(collection(db, 'paidLaunchDecisionReviews'), where('status', '==', 'approved')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({ id: reviewDoc.id, ...reviewDoc.data() })));
}

export async function reviewPaidLaunchDecisionReview(reviewId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanReviewId = String(reviewId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'approved', 'waiting', 'not_ready', 'declined']);
  if (!cleanReviewId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid paid launch decision status.');
  }
  const payload = {
    status: cleanStatus,
    manualReviewOnly: true,
    flipsPaidAccessLive: false,
    writesEntitlements: false,
    createsPurchases: false,
    processesPayments: false,
    processesRefunds: false,
    cancelsSubscriptions: false,
    collectsPaymentDetails: false,
    submitsStoreReview: false,
    bypassesMarketplacePolicy: false,
    claimsLaunchReadiness: false,
    claimsSandboxProof: false,
    isPaidAccessLive: false,
    hasTrackingPixels: false,
    scrapesMessages: false,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (cleanStatus === 'approved') payload.approvedAt = serverTimestamp();
  await updateDoc(doc(db, 'paidLaunchDecisionReviews', cleanReviewId), payload);
  return payload;
}
