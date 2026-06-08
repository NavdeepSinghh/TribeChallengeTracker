import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getUserProfile, sortByCreatedAtDesc } from './firestoreServiceUtils';

export async function submitPartnerCampaignApplication(uid, {
  topPerkId = '',
  topPerkLabel = '',
  demandCount = 0,
  totalDemand = 0,
  campaignReach = 0,
  referralJoins = 0,
} = {}) {
  const profile = await getUserProfile(uid);
  const cleanPerkId = (topPerkId || '').trim().slice(0, 40);
  const cleanPerkLabel = (topPerkLabel || '').trim().slice(0, 80);
  if (!cleanPerkId || !cleanPerkLabel) {
    throw new Error('Save at least one partner perk signal before applying for a partner pilot review.');
  }
  const payload = {
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    topPerkId: cleanPerkId,
    topPerkLabel: cleanPerkLabel,
    demandCount: Number(demandCount) || 0,
    totalDemand: Number(totalDemand) || 0,
    campaignReach: Number(campaignReach) || 0,
    referralJoins: Number(referralJoins) || 0,
    status: 'open',
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'partnerCampaignApplications', uid), payload, { merge: true });
  return payload;
}

export async function getPartnerCampaignApplicationReviewQueue() {
  const snap = await getDocs(query(collection(db, 'partnerCampaignApplications'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(applicationDoc => ({
    id: applicationDoc.id,
    ...applicationDoc.data(),
  })));
}

export async function reviewPartnerCampaignApplication(applicationId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanApplicationId = String(applicationId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'approved', 'waiting', 'not_ready', 'declined']);
  if (!cleanApplicationId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid partner campaign application status.');
  }
  const payload = {
    status: cleanStatus,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await updateDoc(doc(db, 'partnerCampaignApplications', cleanApplicationId), payload);
  return payload;
}
