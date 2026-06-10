import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getUserProfile, sortByCreatedAtDesc } from './firestoreServiceUtils';

async function aggregateChallengePoints(challengeId) {
  const snap = await getDocs(collection(db, 'challenges', challengeId, 'members'));
  return snap.docs.reduce((sum, memberDoc) => sum + (Number(memberDoc.data()?.totalPoints) || 0), 0);
}

async function buildCreatorLeaderboardSnapshotPayload(uid) {
  const [profile, challengeSnap] = await Promise.all([
    getUserProfile(uid),
    getDocs(query(collection(db, 'challenges'), where('createdBy', '==', uid))),
  ]);
  const creatorProfile = profile?.creatorProfile || {};
  if (!creatorProfile.enabled) {
    throw new Error('Enable Creator / Coach Mode before saving a leaderboard snapshot.');
  }
  const hostedChallenges = challengeSnap.docs.map(challengeDoc => ({
    id: challengeDoc.id,
    ...challengeDoc.data(),
  }));
  const aggregateRows = await Promise.all(hostedChallenges.slice(0, 12).map(async challenge => ({
    challenge,
    aggregatePoints: await aggregateChallengePoints(challenge.id),
  })));
  const top = aggregateRows.sort((a, b) => {
    const memberDelta = (Number(b.challenge.memberCount) || 0) - (Number(a.challenge.memberCount) || 0);
    if (memberDelta) return memberDelta;
    return b.aggregatePoints - a.aggregatePoints;
  })[0];
  const snapshotId = `${uid}_${Date.now()}`;
  return {
    id: snapshotId,
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    creatorSpecialty: String(creatorProfile.specialty || '').trim().slice(0, 60),
    creatorBio: String(creatorProfile.bio || '').trim().slice(0, 240),
    hostedChallengeCount: hostedChallenges.length,
    activeHostedChallengeCount: hostedChallenges.filter(challenge => challenge.status === 'active').length,
    memberReach: hostedChallenges.reduce((sum, challenge) => sum + (Number(challenge.memberCount) || 0), 0),
    aggregatePoints: aggregateRows.reduce((sum, row) => sum + row.aggregatePoints, 0),
    topChallengeId: top?.challenge?.id || '',
    topChallengeName: top?.challenge?.name || '',
    topChallengeMemberCount: Number(top?.challenge?.memberCount) || 0,
    topChallengeAggregatePoints: Number(top?.aggregatePoints) || 0,
    status: 'open',
    source: 'web',
    isPublic: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export async function submitCreatorLeaderboardSnapshot(uid) {
  const payload = await buildCreatorLeaderboardSnapshotPayload(uid);
  await setDoc(doc(db, 'creatorLeaderboardSnapshots', payload.id), payload);
  return payload;
}

export async function getCreatorLeaderboardSnapshotReviewQueue() {
  const snap = await getDocs(query(collection(db, 'creatorLeaderboardSnapshots'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(snapshotDoc => ({
    id: snapshotDoc.id,
    ...snapshotDoc.data(),
  })));
}

export async function getPublishedCreatorLeaderboardSnapshots() {
  const snap = await getDocs(query(collection(db, 'creatorLeaderboardSnapshots'), where('status', '==', 'published')));
  return sortByCreatedAtDesc(snap.docs.map(snapshotDoc => ({
    id: snapshotDoc.id,
    ...snapshotDoc.data(),
  })));
}

export async function reviewCreatorLeaderboardSnapshot(snapshotId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanSnapshotId = String(snapshotId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'published', 'waiting', 'not_ready', 'declined']);
  if (!cleanSnapshotId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid creator leaderboard snapshot status.');
  }
  const payload = {
    status: cleanStatus,
    isPublic: cleanStatus === 'published',
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (cleanStatus === 'published') {
    payload.publishedAt = serverTimestamp();
  }
  await updateDoc(doc(db, 'creatorLeaderboardSnapshots', cleanSnapshotId), payload);
  return payload;
}
