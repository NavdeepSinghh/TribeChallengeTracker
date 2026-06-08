import { collection, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { sanitizeCommunityEventInterestIds } from '../communityEvents';
import { sanitizePartnerPerkIds, summarizePartnerPerkInterest } from '../partnerPerks';

const PRO_TRIAL_INTEREST_IDS = ['reports', 'challenge_packs', 'creator_tools'];

export async function savePartnerPerkInterest(uid, selectedIds = []) {
  const cleanSelectedIds = sanitizePartnerPerkIds(selectedIds);
  const payload = {
    partnerPerkInterest: {
      selectedIds: cleanSelectedIds,
      updatedAt: serverTimestamp(),
    },
  };
  await setDoc(doc(db, 'users', uid), payload, { merge: true });
  return payload.partnerPerkInterest;
}

export async function saveProTrialInterest(uid, selectedIds = []) {
  const allowed = new Set(PRO_TRIAL_INTEREST_IDS);
  const cleanSelectedIds = [...new Set(selectedIds)].filter(id => allowed.has(id)).sort();
  const payload = {
    proTrialInterest: {
      selectedIds: cleanSelectedIds,
      updatedAt: serverTimestamp(),
    },
  };
  await setDoc(doc(db, 'users', uid), payload, { merge: true });
  return payload.proTrialInterest;
}

export async function saveCommunityEventInterest(uid, selectedIds = []) {
  const cleanSelectedIds = sanitizeCommunityEventInterestIds(selectedIds);
  const payload = {
    communityEventInterest: {
      selectedIds: cleanSelectedIds,
      updatedAt: serverTimestamp(),
    },
  };
  await setDoc(doc(db, 'users', uid), payload, { merge: true });
  return payload.communityEventInterest;
}

export async function getProTrialInterestSummary() {
  const allowed = new Set(PRO_TRIAL_INTEREST_IDS);
  const counts = { reports: 0, challenge_packs: 0, creator_tools: 0 };
  const snap = await getDocs(collection(db, 'users'));
  snap.docs.forEach(userDoc => {
    const selectedIds = userDoc.data()?.proTrialInterest?.selectedIds || [];
    selectedIds.forEach(id => {
      if (allowed.has(id)) counts[id] += 1;
    });
  });
  return counts;
}

export async function getCommunityEventInterestSummary() {
  const counts = { local_meetup: 0, milestone_merch: 0, studio_popup: 0, finisher_moment: 0 };
  const allowed = new Set(Object.keys(counts));
  const snap = await getDocs(collection(db, 'users'));
  snap.docs.forEach(userDoc => {
    const selectedIds = userDoc.data()?.communityEventInterest?.selectedIds || [];
    selectedIds.forEach(id => {
      if (allowed.has(id)) counts[id] += 1;
    });
  });
  return counts;
}

export async function getPartnerPerkInterestSummary() {
  const snap = await getDocs(collection(db, 'users'));
  return summarizePartnerPerkInterest(snap.docs.map(userDoc => userDoc.data()));
}
