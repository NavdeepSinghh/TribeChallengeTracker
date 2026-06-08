import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { getUserProfile, sortByCreatedAtDesc } from './firestoreServiceUtils';

export async function submitSupportRequest(uid, { category = 'general', message = '' }) {
  const cleanMessage = (message || '').trim().slice(0, 1200);
  if (cleanMessage.length < 10) {
    throw new Error('Add a few more details before sending support.');
  }
  const cleanCategory = ['general', 'account', 'billing', 'bug', 'safety'].includes(category) ? category : 'general';
  const profile = await getUserProfile(uid);
  const payload = {
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    category: cleanCategory,
    message: cleanMessage,
    status: 'open',
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, 'supportRequests'), payload);
  return { id: docRef.id, ...payload };
}

export async function getSupportReviewQueue() {
  const snap = await getDocs(query(collection(db, 'supportRequests'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(requestDoc => ({
    id: requestDoc.id,
    ...requestDoc.data(),
  })));
}

export async function reviewSupportRequest(requestId, {
  status = 'waiting',
  reviewNote = '',
  reviewedBy = 'admin',
} = {}) {
  const allowedStatuses = ['open', 'waiting', 'resolved', 'closed'];
  if (!allowedStatuses.includes(status)) {
    throw new Error('Choose a valid support review status.');
  }
  await updateDoc(doc(db, 'supportRequests', requestId), {
    status,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || 'admin').trim().slice(0, 120) || 'admin',
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
