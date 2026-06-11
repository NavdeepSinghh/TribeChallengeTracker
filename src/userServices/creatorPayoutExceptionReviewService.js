import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getUserProfile, sortByCreatedAtDesc } from './firestoreServiceUtils';

async function getCount(collectionName, field, value) {
  const snap = await getDocs(query(collection(db, collectionName), where(field, '==', value)));
  return snap.size;
}

async function buildCreatorPayoutExceptionReviewPayload(uid) {
  const [
    profile,
    hostingApplicationSnap,
    launchGateSnap,
    storeEvidenceCount,
    entitlementRecoveryCount,
    supportCount,
    paidLaunchDecisionCount,
  ] = await Promise.all([
    getUserProfile(uid),
    getDoc(doc(db, 'creatorHostingApplications', uid)),
    getDocs(query(collection(db, 'creatorPaidHostingLaunchGateReviews'), where('uid', '==', uid))),
    getCount('storeTestPurchaseEvidence', 'status', 'recorded'),
    getCount('entitlementRecoveryRequests', 'status', 'open'),
    getCount('supportRequests', 'status', 'open'),
    getCount('paidLaunchDecisionReviews', 'status', 'open'),
  ]);
  const creatorProfile = profile?.creatorProfile || {};
  if (!creatorProfile.enabled) {
    throw new Error('Enable Creator / Coach Mode before saving payout exception review evidence.');
  }
  const hostingApplication = hostingApplicationSnap.exists() ? hostingApplicationSnap.data() : {};
  const launchGateReviews = launchGateSnap.docs.map(gateDoc => ({ id: gateDoc.id, ...gateDoc.data() }));
  const approvedLaunchGateCount = launchGateReviews.filter(gate => gate.status === 'approved').length;
  const openLaunchGateCount = launchGateReviews.filter(gate => gate.status === 'open').length;
  const hostingApplicationStatus = hostingApplication.status || 'missing';
  const exceptionScore = Math.min(
    100,
    Math.min(25, approvedLaunchGateCount * 12)
      + Math.min(20, storeEvidenceCount * 5)
      + Math.min(20, entitlementRecoveryCount * 4)
      + Math.min(20, supportCount * 4)
      + Math.min(15, paidLaunchDecisionCount * 5),
  );
  const exceptionScoreLabel = exceptionScore >= 70 ? 'READY' : (exceptionScore >= 35 ? 'REVIEW' : 'HOLD');
  const reviewId = `${uid}_${Date.now()}`;
  return {
    id: reviewId,
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    creatorSpecialty: String(creatorProfile.specialty || '').trim().slice(0, 60),
    hostingApplicationStatus,
    approvedLaunchGateCount,
    openLaunchGateCount,
    storeEvidenceCount,
    entitlementRecoveryCount,
    supportCount,
    paidLaunchDecisionCount,
    exceptionScore,
    exceptionScoreLabel,
    status: 'open',
    manualReviewOnly: true,
    aggregateOnly: true,
    resolvesPayoutDisputes: false,
    processesRefunds: false,
    collectsTaxDetails: false,
    collectsTaxForms: false,
    collectsGovernmentIds: false,
    collectsBankDetails: false,
    collectsPayoutDetails: false,
    verifiesIdentities: false,
    createsPayoutAccounts: false,
    accessesPayoutProviders: false,
    storesProviderCredentials: false,
    storesTaxForms: false,
    createsContracts: false,
    collectsSignatures: false,
    startsRevenueShare: false,
    createsPayouts: false,
    movesMoney: false,
    processesPayments: false,
    createsPurchases: false,
    writesEntitlements: false,
    givesTaxAdvice: false,
    bypassesMarketplacePolicy: false,
    promisesEarnings: false,
    impliesPaidCreatorHostingLive: false,
    exposesPrivateMemberLogs: false,
    scrapesMessages: false,
    storesMessages: false,
    hasTrackingPixels: false,
    promisesOutcomes: false,
    impliesMedicalResults: false,
    pressuresCreators: false,
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export async function submitCreatorPayoutExceptionReview(uid) {
  const payload = await buildCreatorPayoutExceptionReviewPayload(uid);
  await setDoc(doc(db, 'creatorPayoutExceptionReviews', payload.id), payload);
  return payload;
}

export async function getCreatorPayoutExceptionReviewQueue() {
  const snap = await getDocs(query(collection(db, 'creatorPayoutExceptionReviews'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({
    id: reviewDoc.id,
    ...reviewDoc.data(),
  })));
}

export async function getApprovedCreatorPayoutExceptionReviews() {
  const snap = await getDocs(query(collection(db, 'creatorPayoutExceptionReviews'), where('status', '==', 'approved')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({
    id: reviewDoc.id,
    ...reviewDoc.data(),
  })));
}

export async function reviewCreatorPayoutExceptionReview(reviewId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanReviewId = String(reviewId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'approved', 'waiting', 'not_ready', 'declined']);
  if (!cleanReviewId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid creator payout exception review status.');
  }
  const payload = {
    status: cleanStatus,
    manualReviewOnly: true,
    aggregateOnly: true,
    resolvesPayoutDisputes: false,
    processesRefunds: false,
    collectsTaxDetails: false,
    collectsTaxForms: false,
    collectsGovernmentIds: false,
    collectsBankDetails: false,
    collectsPayoutDetails: false,
    verifiesIdentities: false,
    createsPayoutAccounts: false,
    accessesPayoutProviders: false,
    storesProviderCredentials: false,
    storesTaxForms: false,
    createsContracts: false,
    collectsSignatures: false,
    startsRevenueShare: false,
    createsPayouts: false,
    movesMoney: false,
    processesPayments: false,
    createsPurchases: false,
    writesEntitlements: false,
    givesTaxAdvice: false,
    bypassesMarketplacePolicy: false,
    promisesEarnings: false,
    impliesPaidCreatorHostingLive: false,
    exposesPrivateMemberLogs: false,
    scrapesMessages: false,
    storesMessages: false,
    hasTrackingPixels: false,
    promisesOutcomes: false,
    impliesMedicalResults: false,
    pressuresCreators: false,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (cleanStatus === 'approved') {
    payload.approvedAt = serverTimestamp();
  }
  await updateDoc(doc(db, 'creatorPayoutExceptionReviews', cleanReviewId), payload);
  return payload;
}
