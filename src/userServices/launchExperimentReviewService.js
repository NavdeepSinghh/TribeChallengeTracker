import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import {
  buildLaunchExperiments,
  pickRecommendedLaunchExperiment,
  scoreLaunchExperiment,
} from '../profile/monetizationModel';
import { getCampaignPerformanceSummary } from './campaignPerformanceService';
import { getUserProfile, sortByCreatedAtDesc } from './firestoreServiceUtils';
import { getPartnerPerkInterestSummary, getProTrialInterestSummary } from './interestSignalService';

function sumValues(summary = {}) {
  return Object.values(summary).reduce((sum, value) => sum + (Number(value) || 0), 0);
}

async function countReferralJoins() {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.reduce((sum, userDoc) => {
    const profile = userDoc.data() || {};
    return sum + (Number(profile.referralJoins) || Number(profile.referrals?.joinedCount) || 0);
  }, 0);
}

async function countOpenFeatureSubmissions() {
  const snap = await getDocs(query(collection(db, 'featureSubmissions'), where('status', '==', 'pending')));
  return snap.docs.length;
}

async function countOpenSupportRequests() {
  const snap = await getDocs(query(collection(db, 'supportRequests'), where('status', '==', 'open')));
  return snap.docs.length;
}

async function buildLaunchExperimentReviewPayload(uid) {
  const [
    profile,
    campaignPerformanceSummary,
    proTrialSummary,
    partnerPerkSummary,
    referralJoins,
    featureSubmissionCount,
    supportRiskCount,
  ] = await Promise.all([
    getUserProfile(uid),
    getCampaignPerformanceSummary(),
    getProTrialInterestSummary(),
    getPartnerPerkInterestSummary(),
    countReferralJoins(),
    countOpenFeatureSubmissions(),
    countOpenSupportRequests(),
  ]);
  const proTrialDemandTotal = sumValues(proTrialSummary);
  const partnerDemandTotal = sumValues(partnerPerkSummary);
  const monetizationSignalTotal = proTrialDemandTotal + partnerDemandTotal;
  const launchExperiments = buildLaunchExperiments({
    proTrialDemandTotal,
    storePackCount: 0,
    referralJoins,
    partnerDemandTotal,
  });
  const recommendedExperiment = pickRecommendedLaunchExperiment(launchExperiments);
  const {
    score: experimentScore,
    label: experimentScoreLabel,
    scorecard,
  } = scoreLaunchExperiment({
    monetizationSignalTotal,
    referralJoins,
    campaignPerformanceSummary,
  });
  const reviewId = `${uid}_${Date.now()}`;

  return {
    id: reviewId,
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    recommendedExperimentLabel: recommendedExperiment.label,
    recommendedExperimentAction: recommendedExperiment.action,
    recommendedExperimentSignal: Number(recommendedExperiment.signal) || 0,
    experimentScore,
    experimentScoreLabel,
    demandSignal: scorecard.demandSignal,
    campaignReach: scorecard.campaignReach,
    communityLoop: scorecard.communityLoop,
    referralJoins,
    featureSubmissionCount,
    supportRiskCount,
    status: 'open',
    manualReviewOnly: true,
    createsAttribution: false,
    isPaidAccessLive: false,
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export async function submitLaunchExperimentReview(uid) {
  const payload = await buildLaunchExperimentReviewPayload(uid);
  await setDoc(doc(db, 'launchExperimentReviews', payload.id), payload);
  return payload;
}

export async function getLaunchExperimentReviewQueue() {
  const snap = await getDocs(query(collection(db, 'launchExperimentReviews'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({
    id: reviewDoc.id,
    ...reviewDoc.data(),
  })));
}

export async function getApprovedLaunchExperimentReviews() {
  const snap = await getDocs(query(collection(db, 'launchExperimentReviews'), where('status', '==', 'approved')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({
    id: reviewDoc.id,
    ...reviewDoc.data(),
  })));
}

export async function reviewLaunchExperimentReview(reviewId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanReviewId = String(reviewId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'approved', 'waiting', 'not_ready', 'declined']);
  if (!cleanReviewId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid launch experiment review status.');
  }
  const payload = {
    status: cleanStatus,
    manualReviewOnly: true,
    createsAttribution: false,
    isPaidAccessLive: false,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (cleanStatus === 'approved') {
    payload.approvedAt = serverTimestamp();
  }
  await updateDoc(doc(db, 'launchExperimentReviews', cleanReviewId), payload);
  return payload;
}
