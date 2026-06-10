import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { PRO_TRIAL_REASONS } from '../profile/profileConstants';
import { getUserProfile, sortByCreatedAtDesc } from './firestoreServiceUtils';
import { getProTrialInterestSummary } from './interestSignalService';

function topReasonFromSummary(summary = {}) {
  return PRO_TRIAL_REASONS
    .map(reason => ({ ...reason, demand: Number(summary[reason.id]) || 0 }))
    .sort((a, b) => b.demand - a.demand)[0] || PRO_TRIAL_REASONS[0];
}

async function buildProTrialReviewPayload(uid) {
  const [profile, summary] = await Promise.all([
    getUserProfile(uid),
    getProTrialInterestSummary(),
  ]);
  const selectedIds = profile?.proTrialInterest?.selectedIds || [];
  const topReason = topReasonFromSummary(summary);
  const demandTotal = PRO_TRIAL_REASONS.reduce((sum, reason) => sum + (Number(summary[reason.id]) || 0), 0);
  const reviewScore = Math.min(100, (selectedIds.length * 20) + Math.min(60, demandTotal * 6));
  const reviewScoreLabel = reviewScore >= 70 ? 'READY' : reviewScore >= 35 ? 'BUILD' : 'SEED';
  const reviewId = `${uid}_${Date.now()}`;

  return {
    id: reviewId,
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    selectedReasonIds: selectedIds,
    selectedReasonCount: selectedIds.length,
    demandTotal,
    topReasonId: topReason?.id || 'reports',
    topReasonLabel: topReason?.label || 'Reports',
    topReasonDemand: topReason?.demand || 0,
    reviewScore,
    reviewScoreLabel,
    status: 'open',
    manualReviewOnly: true,
    startsTrial: false,
    createsPurchase: false,
    writesEntitlements: false,
    isPaidAccessLive: false,
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export async function submitProTrialReview(uid) {
  const payload = await buildProTrialReviewPayload(uid);
  await setDoc(doc(db, 'proTrialReviews', payload.id), payload);
  return payload;
}

export async function getProTrialReviewQueue() {
  const snap = await getDocs(query(collection(db, 'proTrialReviews'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({
    id: reviewDoc.id,
    ...reviewDoc.data(),
  })));
}

export async function getApprovedProTrialReviews() {
  const snap = await getDocs(query(collection(db, 'proTrialReviews'), where('status', '==', 'approved')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({
    id: reviewDoc.id,
    ...reviewDoc.data(),
  })));
}

export async function reviewProTrialReview(reviewId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanReviewId = String(reviewId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'approved', 'waiting', 'not_ready', 'declined']);
  if (!cleanReviewId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid Pro trial review status.');
  }
  const payload = {
    status: cleanStatus,
    manualReviewOnly: true,
    startsTrial: false,
    createsPurchase: false,
    writesEntitlements: false,
    isPaidAccessLive: false,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (cleanStatus === 'approved') {
    payload.approvedAt = serverTimestamp();
  }
  await updateDoc(doc(db, 'proTrialReviews', cleanReviewId), payload);
  return payload;
}
