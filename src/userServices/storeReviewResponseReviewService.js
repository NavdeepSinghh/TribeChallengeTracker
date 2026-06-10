import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { STORE_PRODUCT_IDS } from '../proFeatures';
import { db } from '../firebase';
import { getEntitlementRecoveryReviewQueue } from './entitlementRecoveryService';
import { getUserProfile, sortByCreatedAtDesc } from './firestoreServiceUtils';
import { getStoreTestPurchaseEvidenceLog } from './storeTestEvidenceService';
import { getSupportReviewQueue } from './supportRequestService';

const POLICY_LINK_COUNT = 4;

function scoreStoreReviewResponse({ storeEvidenceCount, failedStoreEvidenceCount, needsReviewEvidenceCount, openSupportCount, entitlementRecoveryCount }) {
  return Math.min(
    100,
    Math.min(30, storeEvidenceCount * 5)
      + Math.max(0, 20 - failedStoreEvidenceCount * 5)
      + Math.max(0, 20 - needsReviewEvidenceCount * 4)
      + Math.max(0, 15 - openSupportCount * 3)
      + Math.max(0, 15 - entitlementRecoveryCount * 3),
  );
}

async function buildStoreReviewResponseReviewPayload(uid) {
  const [profile, supportQueue, entitlementRecoveryQueue, storeEvidenceLog] = await Promise.all([
    getUserProfile(uid),
    getSupportReviewQueue(),
    getEntitlementRecoveryReviewQueue(),
    getStoreTestPurchaseEvidenceLog(),
  ]);
  const failedStoreEvidenceCount = storeEvidenceLog.filter(item => item.result === 'failed').length;
  const needsReviewEvidenceCount = storeEvidenceLog.filter(item => item.result === 'needs_review').length;
  const reviewScore = scoreStoreReviewResponse({
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
    storeEvidenceCount: storeEvidenceLog.length,
    failedStoreEvidenceCount,
    needsReviewEvidenceCount,
    openSupportCount: supportQueue.length,
    entitlementRecoveryCount: entitlementRecoveryQueue.length,
    policyLinkCount: POLICY_LINK_COUNT,
    productCount: STORE_PRODUCT_IDS.length,
    reviewScore,
    reviewScoreLabel: reviewScore >= 70 ? 'READY' : reviewScore >= 35 ? 'BUILD' : 'SEED',
    status: 'open',
    manualReviewOnly: true,
    submitsStoreReview: false,
    bypassesMarketplacePolicy: false,
    exposesPrivateUserData: false,
    includesSecrets: false,
    unlocksPaidAccess: false,
    writesEntitlements: false,
    createsPurchases: false,
    processesRefunds: false,
    claimsReviewApproval: false,
    isPaidAccessLive: false,
    hasTrackingPixels: false,
    scrapesMessages: false,
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export async function submitStoreReviewResponseReview(uid) {
  const payload = await buildStoreReviewResponseReviewPayload(uid);
  await setDoc(doc(db, 'storeReviewResponseReviews', payload.id), payload);
  return payload;
}

export async function getStoreReviewResponseReviewQueue() {
  const snap = await getDocs(query(collection(db, 'storeReviewResponseReviews'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({ id: reviewDoc.id, ...reviewDoc.data() })));
}

export async function getApprovedStoreReviewResponseReviews() {
  const snap = await getDocs(query(collection(db, 'storeReviewResponseReviews'), where('status', '==', 'approved')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({ id: reviewDoc.id, ...reviewDoc.data() })));
}

export async function reviewStoreReviewResponseReview(reviewId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanReviewId = String(reviewId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'approved', 'waiting', 'not_ready', 'declined']);
  if (!cleanReviewId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid store review response status.');
  }
  const payload = {
    status: cleanStatus,
    manualReviewOnly: true,
    submitsStoreReview: false,
    bypassesMarketplacePolicy: false,
    exposesPrivateUserData: false,
    includesSecrets: false,
    unlocksPaidAccess: false,
    writesEntitlements: false,
    createsPurchases: false,
    processesRefunds: false,
    claimsReviewApproval: false,
    isPaidAccessLive: false,
    hasTrackingPixels: false,
    scrapesMessages: false,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (cleanStatus === 'approved') payload.approvedAt = serverTimestamp();
  await updateDoc(doc(db, 'storeReviewResponseReviews', cleanReviewId), payload);
  return payload;
}
