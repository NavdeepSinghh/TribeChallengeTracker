import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';

const REFERRAL_REWARD_CLAIM_TIERS = [
  { target: 1, label: 'Connector', reward: 'Referral badge unlock' },
  { target: 5, label: 'Tribe Builder', reward: 'Builder badge + featured queue priority' },
  { target: 10, label: 'Community Captain', reward: 'Captain badge + leaderboard shoutout' },
  { target: 25, label: 'Founder Circle', reward: 'Future Pro trial / founder perk candidate' },
];

export async function claimReferralReward(uid, { tierTarget, referralJoins = 0 }) {
  const target = Number(tierTarget);
  const tier = REFERRAL_REWARD_CLAIM_TIERS.find(item => item.target === target);
  const joinCount = Number(referralJoins) || 0;
  if (!tier) throw new Error('Choose a valid referral reward tier.');
  if (joinCount < target) throw new Error('Referral tier is not unlocked yet.');

  const profileSnap = await getDoc(doc(db, 'users', uid));
  const profile = profileSnap.exists() ? profileSnap.data() : null;
  const payload = {
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    referralJoins: joinCount,
    tierTarget: target,
    tierLabel: tier.label,
    reward: tier.reward,
    status: 'open',
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'referralRewardClaims', `${uid}_${target}`), payload, { merge: true });
  return payload;
}

export async function getReferralRewardReviewQueue() {
  const snap = await getDocs(query(collection(db, 'referralRewardClaims'), where('status', '==', 'open')));
  return snap.docs.map(requestDoc => ({
    id: requestDoc.id,
    ...requestDoc.data(),
  })).sort((a, b) => {
    const left = a.createdAt?.toMillis?.() || 0;
    const right = b.createdAt?.toMillis?.() || 0;
    return right - left;
  });
}

export async function reviewReferralRewardClaim(claimId, {
  status = 'waiting',
  reviewNote = '',
  reviewedBy = 'admin',
} = {}) {
  const allowedStatuses = ['open', 'approved', 'waiting', 'not_ready', 'declined'];
  if (!allowedStatuses.includes(status)) {
    throw new Error('Choose a valid referral reward review status.');
  }
  await updateDoc(doc(db, 'referralRewardClaims', claimId), {
    status,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || 'admin').trim().slice(0, 120) || 'admin',
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
