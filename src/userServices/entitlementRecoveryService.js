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
import { getUserProfile, sortByCreatedAtDesc } from './firestoreServiceUtils';

export async function requestEntitlementRecovery(uid, {
  productCount = 0,
  proActive = false,
  packCount = 0,
  activePackCount = 0,
  reason = 'restore_sync_failed',
} = {}) {
  const cleanReason = ['restore_sync_failed', 'missing_pro', 'missing_pack', 'account_mismatch', 'billing_question'].includes(reason)
    ? reason
    : 'restore_sync_failed';
  const profile = await getUserProfile(uid);
  const payload = {
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    productCount: Math.max(0, Number(productCount) || 0),
    proActive: !!proActive,
    packCount: Math.max(0, Number(packCount) || 0),
    activePackCount: Math.max(0, Number(activePackCount) || 0),
    reason: cleanReason,
    status: 'open',
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'entitlementRecoveryRequests', uid), payload, { merge: true });
  return payload;
}

export async function getEntitlementRecoveryReviewQueue() {
  const snap = await getDocs(query(collection(db, 'entitlementRecoveryRequests'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(requestDoc => ({
    id: requestDoc.id,
    ...requestDoc.data(),
  })));
}

export async function reviewEntitlementRecoveryRequest(requestId, {
  status = 'waiting',
  reviewNote = '',
  reviewedBy = 'admin',
} = {}) {
  const allowedStatuses = ['open', 'waiting', 'resolved', 'closed'];
  if (!allowedStatuses.includes(status)) {
    throw new Error('Choose a valid entitlement recovery review status.');
  }
  await updateDoc(doc(db, 'entitlementRecoveryRequests', requestId), {
    status,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || 'admin').trim().slice(0, 120) || 'admin',
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
