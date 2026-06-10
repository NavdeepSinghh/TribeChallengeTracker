import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getUserProfile, sortByCreatedAtDesc } from './firestoreServiceUtils';

async function buildCreatorPrivateInviteLaunchPayload(uid) {
  const [profile, challengeSnap] = await Promise.all([
    getUserProfile(uid),
    getDocs(query(collection(db, 'challenges'), where('createdBy', '==', uid))),
  ]);
  const creatorProfile = profile?.creatorProfile || {};
  if (!creatorProfile.enabled) {
    throw new Error('Enable Creator / Coach Mode before saving a private invite launch.');
  }
  const hostedChallenges = challengeSnap.docs.map(challengeDoc => ({
    id: challengeDoc.id,
    ...challengeDoc.data(),
  }));
  const privateChallenges = hostedChallenges.filter(challenge => challenge.isPublic === false);
  const inviteChallenge = [...privateChallenges].sort((a, b) => {
    const activeDelta = (b.status === 'active' ? 1 : 0) - (a.status === 'active' ? 1 : 0);
    if (activeDelta) return activeDelta;
    return (Number(b.memberCount) || 0) - (Number(a.memberCount) || 0);
  })[0];
  const launchId = `${uid}_${Date.now()}`;
  return {
    id: launchId,
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    creatorSpecialty: String(creatorProfile.specialty || '').trim().slice(0, 60),
    creatorBio: String(creatorProfile.bio || '').trim().slice(0, 240),
    creatorCtaUrl: String(creatorProfile.ctaUrl || '').trim().slice(0, 160),
    hostedChallengeCount: hostedChallenges.length,
    privateChallengeCount: privateChallenges.length,
    activePrivateChallengeCount: privateChallenges.filter(challenge => challenge.status === 'active').length,
    memberReach: hostedChallenges.reduce((sum, challenge) => sum + (Number(challenge.memberCount) || 0), 0),
    inviteChallengeId: inviteChallenge?.id || '',
    inviteChallengeName: inviteChallenge?.name || '',
    inviteChallengeInviteCode: inviteChallenge?.inviteCode || '',
    inviteChallengeMemberCount: Number(inviteChallenge?.memberCount) || 0,
    inviteReady: Boolean(inviteChallenge?.inviteCode),
    status: 'open',
    source: 'web',
    isPublic: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export async function submitCreatorPrivateInviteLaunch(uid) {
  const payload = await buildCreatorPrivateInviteLaunchPayload(uid);
  await setDoc(doc(db, 'creatorPrivateInviteLaunches', payload.id), payload);
  return payload;
}

export async function getCreatorPrivateInviteLaunchReviewQueue() {
  const snap = await getDocs(query(collection(db, 'creatorPrivateInviteLaunches'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(launchDoc => ({
    id: launchDoc.id,
    ...launchDoc.data(),
  })));
}

export async function getApprovedCreatorPrivateInviteLaunches() {
  const snap = await getDocs(query(collection(db, 'creatorPrivateInviteLaunches'), where('status', '==', 'approved')));
  return sortByCreatedAtDesc(snap.docs.map(launchDoc => ({
    id: launchDoc.id,
    ...launchDoc.data(),
  })));
}

export async function reviewCreatorPrivateInviteLaunch(launchId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanLaunchId = String(launchId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'approved', 'waiting', 'not_ready', 'declined']);
  if (!cleanLaunchId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid creator private invite launch status.');
  }
  const payload = {
    status: cleanStatus,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (cleanStatus === 'approved') {
    payload.approvedAt = serverTimestamp();
  }
  await updateDoc(doc(db, 'creatorPrivateInviteLaunches', cleanLaunchId), payload);
  return payload;
}
