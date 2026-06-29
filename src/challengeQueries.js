import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from './firebase';
import { cachedRead, setCachedRead } from './userServices/readCache';

const PUBLIC_CHALLENGES_CACHE_KEY = 'publicChallenges';
const PUBLIC_CHALLENGES_TTL_MS = 5 * 60 * 1000;
const CHALLENGE_TTL_MS = 10 * 60 * 1000;

const challengeCacheKey = id => `challenge:${id}`;
const userChallengesCacheKey = ids => `userChallenges:${ids.slice().sort().join('|')}`;

export async function searchPublicChallenges(term = '') {
  try {
    const all = await cachedRead(PUBLIC_CHALLENGES_CACHE_KEY, async () => {
      const snap = await getDocs(
        query(collection(db, 'challenges'), where('isPublic', '==', true))
      );
    // Exclude only explicitly cancelled challenges; treat missing status as active.
      return snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .filter(c => c.status !== 'cancelled')
        .sort((left, right) => {
          const memberDelta = Number(right.memberCount || 0) - Number(left.memberCount || 0);
          if (memberDelta !== 0) return memberDelta;
          return String(left.name || '').localeCompare(String(right.name || ''));
        });
    }, PUBLIC_CHALLENGES_TTL_MS);
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
  return cachedRead(`isMember:${challengeId}:${uid}`, async () => (
    await getDoc(doc(db, 'challenges', challengeId, 'members', uid))
  ).exists(), 2 * 60 * 1000);
}

export async function getChallenge(challengeId) {
  return cachedRead(challengeCacheKey(challengeId), async () => {
    const snap = await getDoc(doc(db, 'challenges', challengeId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  }, CHALLENGE_TTL_MS);
}

export async function getChallengeByInviteCode(code) {
  const normalized = String(code || '').trim().toUpperCase();
  return cachedRead(`challengeInvite:${normalized}`, async () => {
    const snap = await getDocs(query(collection(db, 'challenges'), where('inviteCode', '==', normalized)));
    if (snap.empty) return null;
    const challenge = { id: snap.docs[0].id, ...snap.docs[0].data() };
    setCachedRead(challengeCacheKey(challenge.id), challenge, CHALLENGE_TTL_MS);
    return challenge;
  }, CHALLENGE_TTL_MS);
}

export async function getUserChallenges(ids = []) {
  if (!ids.length) return [];
  return cachedRead(userChallengesCacheKey(ids), async () => {
    const results = await Promise.all(ids.map(getChallenge));
    return results.filter(Boolean);
  }, CHALLENGE_TTL_MS);
}
