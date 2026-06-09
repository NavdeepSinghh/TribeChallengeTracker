import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getUserProfile, sortByCreatedAtDesc } from './firestoreServiceUtils';

export async function submitCreatorChallengeTemplateDraft(uid, {
  activeHostedCount = 0,
  candidateChallengeName = '',
  hostedCount = 0,
  memberReach = 0,
  revenueReadyCount = 0,
} = {}) {
  const profile = await getUserProfile(uid);
  const creatorProfile = profile?.creatorProfile || {};
  const cleanSpecialty = (creatorProfile.specialty || '').trim().slice(0, 60);
  const cleanBio = (creatorProfile.bio || '').trim().slice(0, 240);
  const cleanCandidate = String(candidateChallengeName || '').trim().slice(0, 80);
  if (!creatorProfile.enabled) {
    throw new Error('Enable Creator / Coach Mode before saving a template draft.');
  }
  if (!cleanSpecialty && !cleanBio && !cleanCandidate) {
    throw new Error('Add creator specialty, bio, or choose a hosted challenge before saving a template draft.');
  }
  const draftId = `${uid}_${Date.now()}`;
  const payload = {
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    specialty: cleanSpecialty,
    bio: cleanBio,
    ctaUrl: (creatorProfile.ctaUrl || '').trim().slice(0, 160),
    candidateChallengeName: cleanCandidate || 'Hosted challenge template draft',
    hostedCount: Number(hostedCount) || 0,
    activeHostedCount: Number(activeHostedCount) || 0,
    memberReach: Number(memberReach) || 0,
    revenueReadyCount: Number(revenueReadyCount) || 0,
    status: 'open',
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'creatorChallengeTemplateDrafts', draftId), payload);
  return { id: draftId, ...payload };
}

export async function getCreatorChallengeTemplateDraftReviewQueue() {
  const snap = await getDocs(query(collection(db, 'creatorChallengeTemplateDrafts'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(draftDoc => ({
    id: draftDoc.id,
    ...draftDoc.data(),
  })));
}

export async function reviewCreatorChallengeTemplateDraft(draftId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanDraftId = String(draftId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'approved', 'waiting', 'not_ready', 'declined']);
  if (!cleanDraftId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid creator template draft status.');
  }
  const payload = {
    status: cleanStatus,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await updateDoc(doc(db, 'creatorChallengeTemplateDrafts', cleanDraftId), payload);
  return payload;
}
