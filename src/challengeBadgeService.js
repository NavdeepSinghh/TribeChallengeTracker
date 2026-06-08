import {
  collection,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';
import { deriveChallengeBadgeStats } from './challengeStats';

export async function getUserChallengeBadgeStats(uid, challenges = []) {
  if (!uid || !challenges.length) return { completed: 0, top1: 0 };

  const entries = await Promise.all(challenges.map(async (challenge) => {
    if (!challenge?.id) return null;
    const [membersSnap, progressSnap] = await Promise.all([
      getDocs(collection(db, 'challenges', challenge.id, 'members')),
      getDocs(collection(db, 'challenges', challenge.id, 'members', uid, 'dailyLogs')),
    ]);
    return [
      challenge.id,
      membersSnap.docs.map(d => ({ uid: d.id, ...d.data() })),
      progressSnap.docs.reduce((acc, d) => ({ ...acc, [d.id]: d.data() }), {}),
    ];
  }));

  const membersByChallenge = {};
  const progressByChallenge = {};
  entries.filter(Boolean).forEach(([challengeId, members, progress]) => {
    membersByChallenge[challengeId] = members;
    progressByChallenge[challengeId] = progress;
  });

  return deriveChallengeBadgeStats({
    uid,
    challenges,
    membersByChallenge,
    progressByChallenge,
  });
}
