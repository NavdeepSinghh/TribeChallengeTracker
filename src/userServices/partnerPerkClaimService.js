import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { sanitizePartnerPerkIds } from '../partnerPerks';
import { getUserProfile, sortByCreatedAtDesc } from './firestoreServiceUtils';

export async function claimPartnerPerk(uid, {
  perkId = '',
  perkLabel = '',
  perkTitle = '',
  current = 0,
  target = 0,
  requirement = '',
} = {}) {
  const profile = await getUserProfile(uid);
  const cleanPerkId = sanitizePartnerPerkIds([perkId])[0] || '';
  const cleanPerkLabel = String(perkLabel || '').trim().slice(0, 80);
  const cleanPerkTitle = String(perkTitle || '').trim().slice(0, 120);
  const cleanRequirement = String(requirement || '').trim().slice(0, 120);
  const currentValue = Math.max(0, Number(current) || 0);
  const targetValue = Math.max(1, Number(target) || 1);
  if (!cleanPerkId || !cleanPerkLabel) {
    throw new Error('Choose a valid partner perk before requesting review.');
  }
  if (currentValue < targetValue) {
    throw new Error('This partner perk is not eligible yet.');
  }
  const payload = {
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    perkId: cleanPerkId,
    perkLabel: cleanPerkLabel,
    perkTitle: cleanPerkTitle,
    current: currentValue,
    target: targetValue,
    requirement: cleanRequirement,
    status: 'open',
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'partnerPerkClaims', `${uid}_${cleanPerkId}`), payload, { merge: true });
  return payload;
}

export async function getPartnerPerkClaimReviewQueue() {
  const snap = await getDocs(query(collection(db, 'partnerPerkClaims'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(claimDoc => ({
    id: claimDoc.id,
    ...claimDoc.data(),
  })));
}

export async function getPartnerPerkClaims(uid) {
  const snap = await getDocs(query(collection(db, 'partnerPerkClaims'), where('uid', '==', uid)));
  return sortByCreatedAtDesc(snap.docs.map(claimDoc => ({
    id: claimDoc.id,
    ...claimDoc.data(),
  })));
}

export async function reviewPartnerPerkClaim(claimId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanClaimId = String(claimId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'approved', 'waiting', 'not_ready', 'declined']);
  const cleanReviewNote = String(reviewNote || '').trim().slice(0, 500);
  if (!cleanClaimId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid partner perk claim status.');
  }
  const payload = {
    status: cleanStatus,
    reviewNote: cleanReviewNote,
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await updateDoc(doc(db, 'partnerPerkClaims', cleanClaimId), payload);
  return payload;
}
