import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

export async function searchPublicChallenges(term = '') {
  try {
    const snap = await getDocs(
      query(collection(db, 'challenges'), where('isPublic', '==', true))
    );
    // Exclude only explicitly cancelled challenges; treat missing status as active.
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .filter(c => c.status !== 'cancelled');
    if (!term.trim()) return all.slice(0, 30);
    const t = term.toLowerCase();
    return all.filter(c =>
      c.name?.toLowerCase().includes(t) ||
      c.tagline?.toLowerCase().includes(t) ||
      c.campaignHashtag?.toLowerCase().includes(t) ||
      c.campaignLabel?.toLowerCase().includes(t) ||
      c.creatorName?.toLowerCase().includes(t) ||
      c.creatorSpecialty?.toLowerCase().includes(t) ||
      c.creatorBio?.toLowerCase().includes(t)
    );
  } catch (e) {
    console.error('searchPublicChallenges error:', e);
    return [];
  }
}

export async function isMember(uid, challengeId) {
  return (await getDoc(doc(db, 'challenges', challengeId, 'members', uid))).exists();
}

export async function getChallenge(challengeId) {
  const snap = await getDoc(doc(db, 'challenges', challengeId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getChallengeByInviteCode(code) {
  const snap = await getDocs(query(collection(db, 'challenges'), where('inviteCode', '==', code)));
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
}

export async function getUserChallenges(ids = []) {
  if (!ids.length) return [];
  const results = await Promise.all(ids.map(getChallenge));
  return results.filter(Boolean);
}
