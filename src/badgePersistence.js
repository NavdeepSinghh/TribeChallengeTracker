import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';

export async function awardBadges(uid, badgeIds) {
  if (!badgeIds.length) return;
  await updateDoc(doc(db, 'users', uid), { earnedBadges: arrayUnion(...badgeIds) });
}

export async function loadEarnedBadges(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return new Set(snap.data()?.earnedBadges || []);
}
