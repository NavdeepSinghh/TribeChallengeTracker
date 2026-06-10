import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { COMMUNITY_EVENT_INTEREST_OPTIONS } from '../communityEvents';
import { db } from '../firebase';
import { getUserProfile, sortByCreatedAtDesc } from './firestoreServiceUtils';
import { getCommunityEventInterestSummary } from './interestSignalService';

function topEventFromSummary(summary = {}) {
  return COMMUNITY_EVENT_INTEREST_OPTIONS
    .map(option => ({ ...option, demand: Number(summary[option.id]) || 0 }))
    .sort((a, b) => b.demand - a.demand)[0] || COMMUNITY_EVENT_INTEREST_OPTIONS[0];
}

async function buildCommunityEventReviewPayload(uid) {
  const [profile, summary] = await Promise.all([
    getUserProfile(uid),
    getCommunityEventInterestSummary(),
  ]);
  const selectedIds = profile?.communityEventInterest?.selectedIds || [];
  const topEvent = topEventFromSummary(summary);
  const demandTotal = COMMUNITY_EVENT_INTEREST_OPTIONS.reduce((sum, option) => sum + (Number(summary[option.id]) || 0), 0);
  const reviewScore = Math.min(100, (selectedIds.length * 20) + Math.min(60, demandTotal * 6));
  const reviewId = `${uid}_${Date.now()}`;
  return {
    id: reviewId,
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    selectedEventIds: selectedIds,
    selectedEventCount: selectedIds.length,
    demandTotal,
    topEventId: topEvent.id,
    topEventLabel: topEvent.label,
    topEventDemand: topEvent.demand,
    reviewScore,
    reviewScoreLabel: reviewScore >= 70 ? 'READY' : reviewScore >= 35 ? 'BUILD' : 'SEED',
    status: 'open',
    manualReviewOnly: true,
    createsTickets: false,
    createsOrders: false,
    collectsPayments: false,
    booksVenues: false,
    promisesMerch: false,
    createsPartnerLinks: false,
    createsPayouts: false,
    writesEntitlements: false,
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export async function submitCommunityEventReview(uid) {
  const payload = await buildCommunityEventReviewPayload(uid);
  await setDoc(doc(db, 'communityEventReviews', payload.id), payload);
  return payload;
}

export async function getCommunityEventReviewQueue() {
  const snap = await getDocs(query(collection(db, 'communityEventReviews'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({ id: reviewDoc.id, ...reviewDoc.data() })));
}

export async function getApprovedCommunityEventReviews() {
  const snap = await getDocs(query(collection(db, 'communityEventReviews'), where('status', '==', 'approved')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({ id: reviewDoc.id, ...reviewDoc.data() })));
}

export async function reviewCommunityEventReview(reviewId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanReviewId = String(reviewId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'approved', 'waiting', 'not_ready', 'declined']);
  if (!cleanReviewId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid community event review status.');
  }
  const payload = {
    status: cleanStatus,
    manualReviewOnly: true,
    createsTickets: false,
    createsOrders: false,
    collectsPayments: false,
    booksVenues: false,
    promisesMerch: false,
    createsPartnerLinks: false,
    createsPayouts: false,
    writesEntitlements: false,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (cleanStatus === 'approved') payload.approvedAt = serverTimestamp();
  await updateDoc(doc(db, 'communityEventReviews', cleanReviewId), payload);
  return payload;
}
