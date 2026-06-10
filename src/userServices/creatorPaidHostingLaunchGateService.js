import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getUserProfile, sortByCreatedAtDesc } from './firestoreServiceUtils';

function countOwned(rows, uid, status) {
  return rows.filter(row => row.uid === uid && row.status === status).length;
}

async function buildCreatorPaidHostingLaunchGatePayload(uid) {
  const [
    profile,
    challengeSnap,
    hostingApplicationSnap,
    templateSnap,
    brandedPageSnap,
    privateInviteSnap,
  ] = await Promise.all([
    getUserProfile(uid),
    getDocs(query(collection(db, 'challenges'), where('createdBy', '==', uid))),
    getDoc(doc(db, 'creatorHostingApplications', uid)),
    getDocs(query(collection(db, 'creatorChallengeTemplates'), where('status', '==', 'published'))),
    getDocs(query(collection(db, 'creatorBrandedPages'), where('uid', '==', uid))),
    getDocs(query(collection(db, 'creatorPrivateInviteLaunches'), where('uid', '==', uid))),
  ]);
  const creatorProfile = profile?.creatorProfile || {};
  if (!creatorProfile.enabled) {
    throw new Error('Enable Creator / Coach Mode before saving launch gate evidence.');
  }
  const hostedChallenges = challengeSnap.docs.map(challengeDoc => ({
    id: challengeDoc.id,
    ...challengeDoc.data(),
  }));
  const templates = templateSnap.docs.map(templateDoc => ({ id: templateDoc.id, ...templateDoc.data() }));
  const brandedPages = brandedPageSnap.docs.map(pageDoc => ({ id: pageDoc.id, ...pageDoc.data() }));
  const privateInvites = privateInviteSnap.docs.map(launchDoc => ({ id: launchDoc.id, ...launchDoc.data() }));
  const hostingApplication = hostingApplicationSnap.exists() ? hostingApplicationSnap.data() : {};
  const profileReady = Boolean(String(creatorProfile.specialty || '').trim() && String(creatorProfile.bio || '').trim());
  const hostedChallengeCount = hostedChallenges.length;
  const activeHostedChallengeCount = hostedChallenges.filter(challenge => challenge.status === 'active').length;
  const memberReach = hostedChallenges.reduce((sum, challenge) => sum + (Number(challenge.memberCount) || 0), 0);
  const revenueReadyCount = hostedChallenges.filter(challenge => challenge.isPremium || (Number(challenge.memberCount) || 0) >= 5).length;
  const hostingApplicationStatus = hostingApplication.status || 'missing';
  const hostingApplicationApproved = hostingApplicationStatus === 'approved';
  const publishedTemplateCount = countOwned(templates, uid, 'published');
  const publishedBrandedPageCount = countOwned(brandedPages, uid, 'published');
  const approvedPrivateInviteLaunchCount = countOwned(privateInvites, uid, 'approved');
  const launchGateReady = profileReady
    && hostedChallengeCount > 0
    && revenueReadyCount > 0
    && hostingApplicationApproved
    && publishedTemplateCount > 0
    && publishedBrandedPageCount > 0
    && approvedPrivateInviteLaunchCount > 0;
  const gateId = `${uid}_${Date.now()}`;
  return {
    id: gateId,
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    creatorSpecialty: String(creatorProfile.specialty || '').trim().slice(0, 60),
    creatorBio: String(creatorProfile.bio || '').trim().slice(0, 240),
    creatorCtaUrl: String(creatorProfile.ctaUrl || '').trim().slice(0, 160),
    revenueShareInterest: Boolean(creatorProfile.revenueShareInterest),
    profileReady,
    hostedChallengeCount,
    activeHostedChallengeCount,
    memberReach,
    revenueReadyCount,
    hostingApplicationStatus,
    hostingApplicationApproved,
    publishedTemplateCount,
    publishedBrandedPageCount,
    approvedPrivateInviteLaunchCount,
    launchGateReady,
    status: 'open',
    isPaidHostingLive: false,
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export async function submitCreatorPaidHostingLaunchGateEvidence(uid) {
  const payload = await buildCreatorPaidHostingLaunchGatePayload(uid);
  await setDoc(doc(db, 'creatorPaidHostingLaunchGateReviews', payload.id), payload);
  return payload;
}

export async function getCreatorPaidHostingLaunchGateReviewQueue() {
  const snap = await getDocs(query(collection(db, 'creatorPaidHostingLaunchGateReviews'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(gateDoc => ({
    id: gateDoc.id,
    ...gateDoc.data(),
  })));
}

export async function getApprovedCreatorPaidHostingLaunchGateReviews() {
  const snap = await getDocs(query(collection(db, 'creatorPaidHostingLaunchGateReviews'), where('status', '==', 'approved')));
  return sortByCreatedAtDesc(snap.docs.map(gateDoc => ({
    id: gateDoc.id,
    ...gateDoc.data(),
  })));
}

export async function reviewCreatorPaidHostingLaunchGateEvidence(gateId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanGateId = String(gateId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'approved', 'waiting', 'not_ready', 'declined']);
  if (!cleanGateId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid creator paid hosting launch gate status.');
  }
  const payload = {
    status: cleanStatus,
    isPaidHostingLive: false,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (cleanStatus === 'approved') {
    payload.approvedAt = serverTimestamp();
  }
  await updateDoc(doc(db, 'creatorPaidHostingLaunchGateReviews', cleanGateId), payload);
  return payload;
}
