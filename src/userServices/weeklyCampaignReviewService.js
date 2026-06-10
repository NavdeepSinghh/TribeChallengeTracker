import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getUserProfile, sortByCreatedAtDesc } from './firestoreServiceUtils';

const REVIEW_STATUSES = new Set(['open', 'approved', 'waiting', 'not_ready', 'declined']);

function cleanNumber(value) {
  return Number(value) || 0;
}

function scoreWeeklyCampaignReview({
  campaignReach = 0,
  referralJoins = 0,
  featureSubmissionCount = 0,
  supportRiskCount = 0,
} = {}) {
  const reachScore = Math.min(35, cleanNumber(campaignReach));
  const referralScore = Math.min(25, cleanNumber(referralJoins) * 5);
  const featureScore = Math.min(25, cleanNumber(featureSubmissionCount) * 5);
  const supportPenalty = Math.min(20, cleanNumber(supportRiskCount) * 4);
  const score = Math.max(0, Math.min(100, 20 + reachScore + referralScore + featureScore - supportPenalty));
  const label = score >= 70 ? 'READY' : score >= 45 ? 'REVIEW' : 'SEED';
  return { score, label };
}

export async function submitWeeklyCampaignReview(uid, input = {}) {
  const profile = await getUserProfile(uid);
  const campaignReach = cleanNumber(input.campaignReach);
  const referralJoins = cleanNumber(input.referralJoins);
  const featureSubmissionCount = cleanNumber(input.featureSubmissionCount);
  const supportRiskCount = cleanNumber(input.supportRiskCount);
  const { score: reviewScore, label: reviewScoreLabel } = scoreWeeklyCampaignReview({
    campaignReach,
    referralJoins,
    featureSubmissionCount,
    supportRiskCount,
  });
  const reviewId = `${uid}_${Date.now()}`;
  const weeklyCampaignPrompt = input.weeklyCampaignPrompt || {};

  const payload = {
    id: reviewId,
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    campaignName: weeklyCampaignPrompt.name || input.campaignName || 'This week',
    campaignWeek: cleanNumber(weeklyCampaignPrompt.week || input.campaignWeek),
    campaignLabel: weeklyCampaignPrompt.label || input.campaignLabel || 'Weekly campaign',
    campaignHashtag: weeklyCampaignPrompt.hashtag || input.campaignHashtag || '#RiseWithTheTribe',
    campaignCta: weeklyCampaignPrompt.cta || input.campaignCta || '',
    recommendedExperimentLabel: input.recommendedExperimentLabel || 'Pro Trial CTA',
    campaignReach,
    activeCampaignCount: cleanNumber(input.activeCampaignCount),
    referralJoins,
    featureSubmissionCount,
    supportRiskCount,
    reviewScore,
    reviewScoreLabel,
    status: 'open',
    manualReviewOnly: true,
    createsAttribution: false,
    hasTrackingPixels: false,
    isPaidAccessLive: false,
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'weeklyCampaignReviews', payload.id), payload);
  return payload;
}

export async function getWeeklyCampaignReviewQueue() {
  const snap = await getDocs(query(collection(db, 'weeklyCampaignReviews'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({
    id: reviewDoc.id,
    ...reviewDoc.data(),
  })));
}

export async function getApprovedWeeklyCampaignReviews() {
  const snap = await getDocs(query(collection(db, 'weeklyCampaignReviews'), where('status', '==', 'approved')));
  return sortByCreatedAtDesc(snap.docs.map(reviewDoc => ({
    id: reviewDoc.id,
    ...reviewDoc.data(),
  })));
}

export async function reviewWeeklyCampaignReview(reviewId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanReviewId = String(reviewId || '').trim();
  const cleanStatus = String(status || '').trim();
  if (!cleanReviewId || !REVIEW_STATUSES.has(cleanStatus)) {
    throw new Error('Choose a valid weekly campaign review status.');
  }
  const payload = {
    status: cleanStatus,
    manualReviewOnly: true,
    createsAttribution: false,
    hasTrackingPixels: false,
    isPaidAccessLive: false,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (cleanStatus === 'approved') {
    payload.approvedAt = serverTimestamp();
  }
  await updateDoc(doc(db, 'weeklyCampaignReviews', cleanReviewId), payload);
  return payload;
}
