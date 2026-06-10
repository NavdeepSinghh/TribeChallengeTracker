import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getUserProfile, sortByCreatedAtDesc } from './firestoreServiceUtils';
import { getPartnerPerkClaimReviewQueue } from './partnerPerkClaimService';
import { getPartnerPerkInterestSummary } from './interestSignalService';
import { getCampaignPerformanceSummary } from './campaignPerformanceService';

async function buildPartnerPerkHandoffAuditReviewPayload(uid) {
  const [profile, claimQueue, perkSummary, campaignSummary] = await Promise.all([
    getUserProfile(uid),
    getPartnerPerkClaimReviewQueue(),
    getPartnerPerkInterestSummary(),
    getCampaignPerformanceSummary(),
  ]);
  const top = Object.entries(perkSummary || {}).sort((a, b) => b[1] - a[1])[0] || ['gear', 0];
  const reviewScore = Math.min(100, Math.min(45, claimQueue.length * 9) + Math.min(35, Number(top[1] || 0) * 7) + Math.min(20, Number(campaignSummary.memberReach || 0) * 2));
  const reviewId = `${uid}_${Date.now()}`;
  return {
    id: reviewId,
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    openClaimCount: claimQueue.length,
    topPerkId: top[0],
    topPerkDemand: Number(top[1] || 0),
    campaignReach: Number(campaignSummary.memberReach || 0),
    referralJoins: Number(campaignSummary.referralJoins || 0),
    reviewScore,
    reviewScoreLabel: reviewScore >= 70 ? 'READY' : reviewScore >= 35 ? 'REVIEW' : 'SEED',
    status: 'open',
    manualReviewOnly: true,
    createsCoupons: false,
    createsPartnerLinks: false,
    createsPayouts: false,
    createsDiscounts: false,
    createsPurchases: false,
    writesEntitlements: false,
    createsAffiliateRewards: false,
    hasTrackingPixels: false,
    usesAdTargeting: false,
    exportsThirdPartyData: false,
    makesPaidAccessClaims: false,
    collectsPayment: false,
    processesRefunds: false,
    promisesFulfillment: false,
    promisesOutcomes: false,
    impliesMedicalResults: false,
    autoMessagesUsers: false,
    scrapesMessages: false,
    pressuresMembers: false,
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export async function submitPartnerPerkHandoffAuditReview(uid) {
  const payload = await buildPartnerPerkHandoffAuditReviewPayload(uid);
  await setDoc(doc(db, 'partnerPerkHandoffAuditReviews', payload.id), payload);
  return payload;
}

export async function getPartnerPerkHandoffAuditReviewQueue() {
  const snap = await getDocs(query(collection(db, 'partnerPerkHandoffAuditReviews'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({ id: reviewDoc.id, ...reviewDoc.data() })));
}

export async function getApprovedPartnerPerkHandoffAuditReviews() {
  const snap = await getDocs(query(collection(db, 'partnerPerkHandoffAuditReviews'), where('status', '==', 'approved')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({ id: reviewDoc.id, ...reviewDoc.data() })));
}

export async function reviewPartnerPerkHandoffAuditReview(reviewId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanReviewId = String(reviewId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'approved', 'waiting', 'not_ready', 'declined']);
  if (!cleanReviewId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid partner perk handoff audit status.');
  }
  const payload = {
    status: cleanStatus,
    manualReviewOnly: true,
    createsCoupons: false,
    createsPartnerLinks: false,
    createsPayouts: false,
    createsDiscounts: false,
    createsPurchases: false,
    writesEntitlements: false,
    createsAffiliateRewards: false,
    hasTrackingPixels: false,
    usesAdTargeting: false,
    exportsThirdPartyData: false,
    makesPaidAccessClaims: false,
    collectsPayment: false,
    processesRefunds: false,
    promisesFulfillment: false,
    promisesOutcomes: false,
    impliesMedicalResults: false,
    autoMessagesUsers: false,
    scrapesMessages: false,
    pressuresMembers: false,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (cleanStatus === 'approved') payload.approvedAt = serverTimestamp();
  await updateDoc(doc(db, 'partnerPerkHandoffAuditReviews', cleanReviewId), payload);
  return payload;
}
