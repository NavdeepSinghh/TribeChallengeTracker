import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getCampaignPerformanceSummary } from './campaignPerformanceService';
import { getPartnerCampaignApplicationReviewQueue } from './partnerCampaignApplicationService';
import { getPartnerPerkClaimReviewQueue } from './partnerPerkClaimService';
import { getPartnerPerkInterestSummary } from './interestSignalService';
import { sortByCreatedAtDesc } from './firestoreServiceUtils';

async function buildPartnerCampaignRetrospectiveReviewPayload(uid) {
  const [applicationQueue, claimQueue, perkSummary, campaignSummary] = await Promise.all([
    getPartnerCampaignApplicationReviewQueue(),
    getPartnerPerkClaimReviewQueue(),
    getPartnerPerkInterestSummary(),
    getCampaignPerformanceSummary(),
  ]);
  const top = Object.entries(perkSummary || {}).sort((a, b) => b[1] - a[1])[0] || ['gear', 0];
  const retrospectiveScore = Math.min(
    100,
    Math.min(30, Number(campaignSummary.memberReach || 0) * 2) +
      Math.min(20, Number(campaignSummary.referralJoins || 0) * 5) +
      Math.min(25, applicationQueue.length * 8) +
      Math.min(25, claimQueue.length * 8)
  );
  const reviewId = `${uid}_${Date.now()}`;
  return {
    id: reviewId,
    uid,
    topPerkId: top[0],
    topPerkDemand: Number(top[1] || 0),
    campaignReach: Number(campaignSummary.memberReach || 0),
    referralJoins: Number(campaignSummary.referralJoins || 0),
    openPartnerApplicationCount: applicationQueue.length,
    openPerkClaimCount: claimQueue.length,
    retrospectiveScore,
    retrospectiveScoreLabel: retrospectiveScore >= 70 ? 'REPEAT' : retrospectiveScore >= 35 ? 'REVIEW' : 'PAUSE',
    status: 'open',
    manualReviewOnly: true,
    aggregateOnly: true,
    createsPartnerLinks: false,
    hasTrackingPixels: false,
    usesAdTargeting: false,
    createsAffiliatePayouts: false,
    createsCommissions: false,
    createsCoupons: false,
    createsDiscounts: false,
    createsPurchases: false,
    writesEntitlements: false,
    startsRevenueShare: false,
    makesPaidAccessClaims: false,
    exportsThirdPartyData: false,
    collectsPayment: false,
    promisesFulfillment: false,
    promisesOutcomes: false,
    impliesMedicalResults: false,
    autoMessagesUsers: false,
    scrapesMessages: false,
    pressuresPartnersOrMembers: false,
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export async function submitPartnerCampaignRetrospectiveReview(uid) {
  const payload = await buildPartnerCampaignRetrospectiveReviewPayload(uid);
  await setDoc(doc(db, 'partnerCampaignRetrospectiveReviews', payload.id), payload);
  return payload;
}

export async function getPartnerCampaignRetrospectiveReviewQueue() {
  const snap = await getDocs(query(collection(db, 'partnerCampaignRetrospectiveReviews'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({ id: reviewDoc.id, ...reviewDoc.data() })));
}

export async function getApprovedPartnerCampaignRetrospectiveReviews() {
  const snap = await getDocs(query(collection(db, 'partnerCampaignRetrospectiveReviews'), where('status', '==', 'approved')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({ id: reviewDoc.id, ...reviewDoc.data() })));
}

export async function reviewPartnerCampaignRetrospectiveReview(reviewId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanReviewId = String(reviewId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'approved', 'waiting', 'not_ready', 'declined']);
  if (!cleanReviewId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid partner campaign retrospective review status.');
  }
  const payload = {
    status: cleanStatus,
    manualReviewOnly: true,
    aggregateOnly: true,
    createsPartnerLinks: false,
    hasTrackingPixels: false,
    usesAdTargeting: false,
    createsAffiliatePayouts: false,
    createsCommissions: false,
    createsCoupons: false,
    createsDiscounts: false,
    createsPurchases: false,
    writesEntitlements: false,
    startsRevenueShare: false,
    makesPaidAccessClaims: false,
    exportsThirdPartyData: false,
    collectsPayment: false,
    promisesFulfillment: false,
    promisesOutcomes: false,
    impliesMedicalResults: false,
    autoMessagesUsers: false,
    scrapesMessages: false,
    pressuresPartnersOrMembers: false,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (cleanStatus === 'approved') payload.approvedAt = serverTimestamp();
  await updateDoc(doc(db, 'partnerCampaignRetrospectiveReviews', cleanReviewId), payload);
  return payload;
}
