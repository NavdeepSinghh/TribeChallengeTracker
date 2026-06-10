import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getUserProfile, sortByCreatedAtDesc } from './firestoreServiceUtils';

async function buildCreatorBrandedPagePayload(uid) {
  const [profile, challengeSnap] = await Promise.all([
    getUserProfile(uid),
    getDocs(query(collection(db, 'challenges'), where('createdBy', '==', uid))),
  ]);
  const creatorProfile = profile?.creatorProfile || {};
  if (!creatorProfile.enabled) {
    throw new Error('Enable Creator / Coach Mode before saving a branded page draft.');
  }
  const hostedChallenges = challengeSnap.docs.map(challengeDoc => ({
    id: challengeDoc.id,
    ...challengeDoc.data(),
  }));
  const featuredChallenge = [...hostedChallenges].sort((a, b) => {
    const activeDelta = (b.status === 'active' ? 1 : 0) - (a.status === 'active' ? 1 : 0);
    if (activeDelta) return activeDelta;
    return (Number(b.memberCount) || 0) - (Number(a.memberCount) || 0);
  })[0];
  const pageId = `${uid}_${Date.now()}`;
  return {
    id: pageId,
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    creatorSpecialty: String(creatorProfile.specialty || '').trim().slice(0, 60),
    creatorBio: String(creatorProfile.bio || '').trim().slice(0, 240),
    creatorCtaUrl: String(creatorProfile.ctaUrl || '').trim().slice(0, 160),
    hostedChallengeCount: hostedChallenges.length,
    activeHostedChallengeCount: hostedChallenges.filter(challenge => challenge.status === 'active').length,
    memberReach: hostedChallenges.reduce((sum, challenge) => sum + (Number(challenge.memberCount) || 0), 0),
    featuredChallengeId: featuredChallenge?.id || '',
    featuredChallengeName: featuredChallenge?.name || '',
    featuredChallengeTagline: featuredChallenge?.tagline || '',
    featuredChallengeMemberCount: Number(featuredChallenge?.memberCount) || 0,
    status: 'open',
    source: 'web',
    isPublic: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export async function submitCreatorBrandedPageDraft(uid) {
  const payload = await buildCreatorBrandedPagePayload(uid);
  await setDoc(doc(db, 'creatorBrandedPages', payload.id), payload);
  return payload;
}

export async function getCreatorBrandedPageReviewQueue() {
  const snap = await getDocs(query(collection(db, 'creatorBrandedPages'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(pageDoc => ({
    id: pageDoc.id,
    ...pageDoc.data(),
  })));
}

export async function getPublishedCreatorBrandedPages() {
  const snap = await getDocs(query(collection(db, 'creatorBrandedPages'), where('status', '==', 'published')));
  return sortByCreatedAtDesc(snap.docs.map(pageDoc => ({
    id: pageDoc.id,
    ...pageDoc.data(),
  })));
}

export async function reviewCreatorBrandedPage(pageId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanPageId = String(pageId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'published', 'waiting', 'not_ready', 'declined']);
  if (!cleanPageId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid creator branded page status.');
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
  await updateDoc(doc(db, 'creatorBrandedPages', cleanPageId), payload);
  return payload;
}
