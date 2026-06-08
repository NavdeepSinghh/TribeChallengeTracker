import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { getUserProfile } from './firestoreServiceUtils';

const sortByRequestedAtDesc = items => items.sort((a, b) => {
  const left = a.requestedAt?.toMillis?.() || 0;
  const right = b.requestedAt?.toMillis?.() || 0;
  return right - left;
});

export async function requestAccountDeletion(uid) {
  const profile = await getUserProfile(uid);
  const requestPayload = {
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    status: 'requested',
    source: 'web',
    requestedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const profileStatus = {
    status: 'requested',
    source: 'web',
    requestedAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'accountDeletionRequests', uid), requestPayload, { merge: true });
  await setDoc(doc(db, 'users', uid), {
    accountDeletionRequest: profileStatus,
  }, { merge: true });
  return profileStatus;
}

export async function getAccountDeletionReviewQueue() {
  const snap = await getDocs(query(collection(db, 'accountDeletionRequests'), where('status', '==', 'requested')));
  return sortByRequestedAtDesc(snap.docs.map(requestDoc => ({
    id: requestDoc.id,
    ...requestDoc.data(),
  })));
}

export async function reviewAccountDeletionRequest(uid, { status, reviewNote = '', reviewedBy = 'admin' }) {
  const allowedStatuses = ['requested', 'contacted', 'verified', 'blocked', 'closed'];
  const cleanStatus = allowedStatuses.includes(status) ? status : 'contacted';
  const cleanNote = (reviewNote || '').trim().slice(0, 500);
  const cleanReviewer = (reviewedBy || 'admin').trim().slice(0, 120) || 'admin';
  const reviewStatus = {
    status: cleanStatus,
    source: 'admin',
    reviewedAt: serverTimestamp(),
  };

  await updateDoc(doc(db, 'accountDeletionRequests', uid), {
    status: cleanStatus,
    reviewNote: cleanNote,
    reviewedBy: cleanReviewer,
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await setDoc(doc(db, 'users', uid), {
    accountDeletionRequest: reviewStatus,
  }, { merge: true });
}
