import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getActivityLog } from './activityLogService';
import { getUserProfile, sortByCreatedAtDesc } from './firestoreServiceUtils';

function summarizeActivity(history = {}) {
  const logs = Object.values(history || {});
  const activeLogs = logs.filter(log => {
    const activities = Array.isArray(log.activities) ? log.activities : [];
    return activities.length > 0 || Number(log.totalPoints || log.points || 0) > 0;
  });
  return {
    activeDays: activeLogs.length,
    totalPoints: logs.reduce((sum, log) => sum + Number(log.totalPoints || log.points || 0), 0),
  };
}

async function buildCustomerValueReviewPayload(uid) {
  const [profile, history] = await Promise.all([
    getUserProfile(uid),
    getActivityLog(uid),
  ]);
  const activity = summarizeActivity(history);
  const earnedBadgeCount = Array.isArray(profile?.earnedBadges) ? profile.earnedBadges.length : 0;
  const joinedChallengeCount = Array.isArray(profile?.joinedChallengeIds) ? profile.joinedChallengeIds.length : 0;
  const profileComplete = Boolean(profile?.displayName && (profile?.instagramHandle || profile?.profileImageData || profile?.avatarEmoji));
  const reviewScore = Math.min(
    100,
    Math.min(40, activity.activeDays * 4)
      + Math.min(25, Math.floor(activity.totalPoints / 20))
      + Math.min(15, earnedBadgeCount * 3)
      + Math.min(10, joinedChallengeCount * 5)
      + (profileComplete ? 10 : 0),
  );
  const reviewId = `${uid}_${Date.now()}`;

  return {
    id: reviewId,
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    activeDays: activity.activeDays,
    totalPoints: activity.totalPoints,
    earnedBadgeCount,
    joinedChallengeCount,
    profileComplete,
    reviewScore,
    reviewScoreLabel: reviewScore >= 70 ? 'READY' : reviewScore >= 35 ? 'BUILD' : 'SEED',
    status: 'open',
    manualReviewOnly: true,
    chargesUsers: false,
    unlocksPaidAccess: false,
    writesEntitlements: false,
    createsDiscounts: false,
    isPaidAccessLive: false,
    promotesPaidFeatures: false,
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export async function submitCustomerValueReview(uid) {
  const payload = await buildCustomerValueReviewPayload(uid);
  await setDoc(doc(db, 'customerValueReviews', payload.id), payload);
  return payload;
}

export async function getCustomerValueReviewQueue() {
  const snap = await getDocs(query(collection(db, 'customerValueReviews'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({ id: reviewDoc.id, ...reviewDoc.data() })));
}

export async function getApprovedCustomerValueReviews() {
  const snap = await getDocs(query(collection(db, 'customerValueReviews'), where('status', '==', 'approved')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({ id: reviewDoc.id, ...reviewDoc.data() })));
}

export async function reviewCustomerValueReview(reviewId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanReviewId = String(reviewId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'approved', 'waiting', 'not_ready', 'declined']);
  if (!cleanReviewId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid customer value review status.');
  }
  const payload = {
    status: cleanStatus,
    manualReviewOnly: true,
    chargesUsers: false,
    unlocksPaidAccess: false,
    writesEntitlements: false,
    createsDiscounts: false,
    isPaidAccessLive: false,
    promotesPaidFeatures: false,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (cleanStatus === 'approved') payload.approvedAt = serverTimestamp();
  await updateDoc(doc(db, 'customerValueReviews', cleanReviewId), payload);
  return payload;
}
