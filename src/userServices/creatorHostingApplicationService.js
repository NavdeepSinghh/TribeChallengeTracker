import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getUserProfile, sortByCreatedAtDesc } from './firestoreServiceUtils';

export async function submitCreatorHostingApplication(uid, {
  hostedCount = 0,
  memberReach = 0,
  revenueReadyCount = 0,
  revenueShareInterest = false,
} = {}) {
  const profile = await getUserProfile(uid);
  const creatorProfile = profile?.creatorProfile || {};
  const cleanSpecialty = (creatorProfile.specialty || '').trim().slice(0, 60);
  const cleanBio = (creatorProfile.bio || '').trim().slice(0, 240);
  if (!creatorProfile.enabled) {
    throw new Error('Enable Creator / Coach Mode before applying for hosted review.');
  }
  if (!cleanSpecialty && !cleanBio) {
    throw new Error('Add creator specialty or bio before applying for hosted review.');
  }
  const payload = {
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    specialty: cleanSpecialty,
    bio: cleanBio,
    ctaUrl: (creatorProfile.ctaUrl || '').trim().slice(0, 160),
    hostedCount: Number(hostedCount) || 0,
    memberReach: Number(memberReach) || 0,
    revenueReadyCount: Number(revenueReadyCount) || 0,
    revenueShareInterest: Boolean(revenueShareInterest || creatorProfile.revenueShareInterest),
    status: 'open',
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'creatorHostingApplications', uid), payload, { merge: true });
  return payload;
}

export async function getCreatorHostingApplicationReviewQueue() {
  const snap = await getDocs(query(collection(db, 'creatorHostingApplications'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(applicationDoc => ({
    id: applicationDoc.id,
    ...applicationDoc.data(),
  })));
}

export async function reviewCreatorHostingApplication(applicationId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanApplicationId = String(applicationId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'approved', 'waiting', 'not_ready', 'declined']);
  if (!cleanApplicationId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid creator hosting application status.');
  }
  const payload = {
    status: cleanStatus,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await updateDoc(doc(db, 'creatorHostingApplications', cleanApplicationId), payload);
  return payload;
}
