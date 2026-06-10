import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getCampaignPerformanceSummary } from './campaignPerformanceService';
import { sortByCreatedAtDesc, getUserProfile } from './firestoreServiceUtils';
import { getReferralRewardReviewQueue } from './referralRewardService';

async function buildReferralRewardHandoffAuditReviewPayload(uid) {
  const [profile, claimQueue, campaignSummary] = await Promise.all([
    getUserProfile(uid),
    getReferralRewardReviewQueue(),
    getCampaignPerformanceSummary(),
  ]);
  const openClaimCount = claimQueue.length;
  const highestTierTarget = claimQueue.reduce((max, claim) => Math.max(max, Number(claim.tierTarget || 0)), 0);
  const referralJoins = Number(campaignSummary.referralJoins || profile?.stats?.referralJoins || 0);
  const reviewScore = Math.min(100, Math.min(45, openClaimCount * 9) + Math.min(35, referralJoins * 7) + Math.min(20, highestTierTarget * 2));
  const reviewId = `${uid}_${Date.now()}`;
  return {
    id: reviewId,
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    openClaimCount,
    highestTierTarget,
    referralJoins,
    campaignReach: Number(campaignSummary.memberReach || 0),
    reviewScore,
    reviewScoreLabel: reviewScore >= 70 ? 'READY' : reviewScore >= 35 ? 'REVIEW' : 'SEED',
    status: 'open',
    manualReviewOnly: true,
    grantsPro: false,
    writesEntitlements: false,
    createsPayouts: false,
    createsPurchases: false,
    createsDiscounts: false,
    createsAffiliateRewards: false,
    writesReferralState: false,
    countsLinkOpens: false,
    claimsFulfillment: false,
    makesPaidAccessClaims: false,
    hasTrackingPixels: false,
    autoMessagesUsers: false,
    scrapesMessages: false,
    storesReplies: false,
    promisesOutcomes: false,
    impliesMedicalResults: false,
    pressuresMembers: false,
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export async function submitReferralRewardHandoffAuditReview(uid) {
  const payload = await buildReferralRewardHandoffAuditReviewPayload(uid);
  await setDoc(doc(db, 'referralRewardHandoffAuditReviews', payload.id), payload);
  return payload;
}

export async function getReferralRewardHandoffAuditReviewQueue() {
  const snap = await getDocs(query(collection(db, 'referralRewardHandoffAuditReviews'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({ id: reviewDoc.id, ...reviewDoc.data() })));
}

export async function getApprovedReferralRewardHandoffAuditReviews() {
  const snap = await getDocs(query(collection(db, 'referralRewardHandoffAuditReviews'), where('status', '==', 'approved')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({ id: reviewDoc.id, ...reviewDoc.data() })));
}

export async function reviewReferralRewardHandoffAuditReview(reviewId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanReviewId = String(reviewId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'approved', 'waiting', 'not_ready', 'declined']);
  if (!cleanReviewId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid referral reward handoff audit status.');
  }
  const payload = {
    status: cleanStatus,
    manualReviewOnly: true,
    grantsPro: false,
    writesEntitlements: false,
    createsPayouts: false,
    createsPurchases: false,
    createsDiscounts: false,
    createsAffiliateRewards: false,
    writesReferralState: false,
    countsLinkOpens: false,
    claimsFulfillment: false,
    makesPaidAccessClaims: false,
    hasTrackingPixels: false,
    autoMessagesUsers: false,
    scrapesMessages: false,
    storesReplies: false,
    promisesOutcomes: false,
    impliesMedicalResults: false,
    pressuresMembers: false,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (cleanStatus === 'approved') payload.approvedAt = serverTimestamp();
  await updateDoc(doc(db, 'referralRewardHandoffAuditReviews', cleanReviewId), payload);
  return payload;
}
