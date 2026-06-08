import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';

export async function submitFeatureSubmission(uid, { category, story, mediaImageData = '' }) {
  const profileSnap = await getDoc(doc(db, 'users', uid));
  const profile = profileSnap.exists() ? profileSnap.data() : null;
  const cleanCategory = (category || 'streak_win').trim() || 'streak_win';
  const cleanStory = (story || '').trim().slice(0, 900);
  if (cleanStory.length < 20) {
    throw new Error('Tell us a little more before submitting.');
  }
  await addDoc(collection(db, 'featureSubmissions'), {
    uid,
    displayName: profile?.displayName || '',
    email: profile?.email || '',
    instagramHandle: profile?.instagramHandle || '',
    profileImageData: profile?.profileImageData || '',
    avatarEmoji: profile?.avatarEmoji || '✨',
    avatarColor: profile?.avatarColor || '#FFD700',
    category: cleanCategory,
    story: cleanStory,
    mediaImageData: mediaImageData || '',
    mediaContentType: mediaImageData ? 'image/jpeg' : '',
    consentToFeature: true,
    status: 'pending',
    source: 'web',
    createdAt: serverTimestamp(),
  });
}

export async function getFeatureSubmissions(uid) {
  const snap = await getDocs(query(collection(db, 'featureSubmissions'), where('uid', '==', uid)));
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => {
      const bt = b.createdAt?.toMillis?.() || 0;
      const at = a.createdAt?.toMillis?.() || 0;
      return bt - at;
    });
}

export async function getFeatureReviewQueue() {
  const snap = await getDocs(query(collection(db, 'featureSubmissions'), where('status', '==', 'pending')));
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => {
      const bt = b.createdAt?.toMillis?.() || 0;
      const at = a.createdAt?.toMillis?.() || 0;
      return bt - at;
    });
}

export async function getFeaturedSubmissions() {
  const snap = await getDocs(query(collection(db, 'featureSubmissions'), where('status', '==', 'featured')));
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => {
      const bt = b.reviewedAt?.toMillis?.() || b.createdAt?.toMillis?.() || 0;
      const at = a.reviewedAt?.toMillis?.() || a.createdAt?.toMillis?.() || 0;
      return bt - at;
    });
}

export async function reviewFeatureSubmission(submissionId, status, reviewerUid, reviewNote = '') {
  const allowed = new Set(['approved', 'featured', 'declined']);
  if (!allowed.has(status)) throw new Error('Invalid review status.');
  await setDoc(doc(db, 'featureSubmissions', submissionId), {
    status,
    reviewedBy: reviewerUid,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedAt: serverTimestamp(),
  }, { merge: true });
}
