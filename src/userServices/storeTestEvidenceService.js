import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { getUserProfile, sortByCreatedAtDesc } from './firestoreServiceUtils';

export async function recordStoreTestPurchaseEvidence(uid, {
  platform = 'ios',
  productId = '',
  testCase = 'sandbox_purchase',
  result = 'passed',
  evidenceNote = '',
} = {}) {
  const cleanPlatform = ['ios', 'android'].includes(platform) ? platform : 'ios';
  const cleanTestCase = ['sandbox_purchase', 'restore_sync', 'negative_validation', 'wrong_account'].includes(testCase)
    ? testCase
    : 'sandbox_purchase';
  const cleanResult = ['passed', 'needs_review', 'failed'].includes(result) ? result : 'needs_review';
  const cleanProductId = String(productId || '').trim().slice(0, 120);
  if (!cleanProductId) {
    throw new Error('Choose a product before recording store test evidence.');
  }
  const profile = await getUserProfile(uid);
  const payload = {
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    platform: cleanPlatform,
    productId: cleanProductId,
    testCase: cleanTestCase,
    result: cleanResult,
    evidenceNote: String(evidenceNote || '').trim().slice(0, 500),
    status: 'recorded',
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, 'storeTestPurchaseEvidence'), payload);
  return { id: docRef.id, ...payload };
}

export async function getStoreTestPurchaseEvidenceLog() {
  const snap = await getDocs(collection(db, 'storeTestPurchaseEvidence'));
  return sortByCreatedAtDesc(snap.docs.map(evidenceDoc => ({
    id: evidenceDoc.id,
    ...evidenceDoc.data(),
  })));
}

export async function reviewStoreTestPurchaseEvidence(evidenceId, {
  result = 'verified',
  status = 'reviewed',
  reviewNote = '',
  reviewedBy = 'admin',
} = {}) {
  const cleanResult = ['verified', 'needs_review', 'failed'].includes(result) ? result : 'needs_review';
  const cleanStatus = ['recorded', 'reviewed', 'archived'].includes(status) ? status : 'reviewed';
  await updateDoc(doc(db, 'storeTestPurchaseEvidence', evidenceId), {
    result: cleanResult,
    status: cleanStatus,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || 'admin').trim().slice(0, 120) || 'admin',
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
