import {
  doc, setDoc, getDoc, getDocs, updateDoc,
  collection, serverTimestamp, increment, arrayUnion,
} from 'firebase/firestore';
import { db } from './firebase';

const todayStr = () => new Date().toISOString().split('T')[0];

const TASK_POINTS       = 10;
const COMPLETION_BONUS  = 20;

export function calcPoints(completedCount, totalCount) {
  return completedCount * TASK_POINTS + (completedCount === totalCount ? COMPLETION_BONUS : 0);
}

// ── Daily log ─────────────────────────────────────────────────────────────────
export async function getTodayLog(uid, challengeId) {
  const snap = await getDoc(
    doc(db, 'challenges', challengeId, 'members', uid, 'dailyLogs', todayStr())
  );
  return snap.exists() ? snap.data() : null;
}

export async function logDay(uid, challenge, completedTaskIds, totalTaskCount) {
  const challengeId = typeof challenge === 'string' ? challenge : challenge.id;
  const today      = todayStr();
  const logRef     = doc(db, 'challenges', challengeId, 'members', uid, 'dailyLogs', today);
  const memberRef  = doc(db, 'challenges', challengeId, 'members', uid);

  const existing = await getDoc(logRef);
  if (existing.exists()) return { alreadyLogged: true, ...existing.data() };

  const allComplete = completedTaskIds.length === totalTaskCount;
  const points      = calcPoints(completedTaskIds.length, totalTaskCount);

  // Save the day's log
  await setDoc(logRef, {
    date: today, completedTasks: completedTaskIds,
    allComplete, points, loggedAt: serverTimestamp(),
  });

  // Recalculate streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr       = yesterday.toISOString().split('T')[0];
  const prevLogSnap = await getDoc(
    doc(db, 'challenges', challengeId, 'members', uid, 'dailyLogs', yStr)
  );
  const memberSnap  = await getDoc(memberRef);
  const memberData  = memberSnap.data() || {};
  const newStreak   = prevLogSnap.exists() ? (memberData.currentStreak || 0) + 1 : 1;
  const newLongest  = Math.max(newStreak, memberData.longestStreak || 0);

  await updateDoc(memberRef, {
    totalPoints:   increment(points),
    daysCompleted: increment(allComplete ? 1 : 0),
    currentStreak: newStreak,
    longestStreak: newLongest,
    lastLogDate:   today,
  });

  const updatedMember = {
    uid,
    ...memberData,
    totalPoints: (memberData.totalPoints || 0) + points,
    daysCompleted: (memberData.daysCompleted || 0) + (allComplete ? 1 : 0),
    currentStreak: newStreak,
    longestStreak: newLongest,
  };
  const completion = typeof challenge === 'object' && allComplete
    ? await recordChallengeCompletion(uid, challenge, updatedMember)
    : null;

  return { points, allComplete, newStreak, completion };
}

export async function recordChallengeCompletion(uid, challenge, memberData) {
  if (!uid || !challenge?.id) return null;
  const duration = Math.max(1, Number(challenge.duration || 0));
  if ((memberData.daysCompleted || 0) < duration) return null;

  const completionRef = doc(db, 'users', uid, 'challengeCompletions', challenge.id);
  const existing = await getDoc(completionRef);
  if (existing.exists()) return { isNew: false, record: existing.data() };

  const membersSnap = await getDocs(collection(db, 'challenges', challenge.id, 'members'));
  const members = membersSnap.docs
    .map(d => ({ uid: d.id, ...d.data() }))
    .filter(m => (m.status || 'active') === 'active')
    .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
  const rank = Math.max(1, members.findIndex(m => m.uid === uid) + 1);
  const shareText = `I completed ${challenge.name} on TribeLog: ${memberData.totalPoints || 0} pts · ${memberData.daysCompleted || 0}/${duration} days · ${memberData.currentStreak || 0} day streak.\nTag @risewiththetribe and join the next challenge.`;
  const record = {
    challengeId: challenge.id,
    challengeName: challenge.name,
    emoji: challenge.emoji || '🏁',
    color: challenge.color || '#34D399',
    duration,
    daysCompleted: memberData.daysCompleted || 0,
    totalPoints: memberData.totalPoints || 0,
    currentStreak: memberData.currentStreak || 0,
    longestStreak: memberData.longestStreak || 0,
    rank,
    memberCount: members.length,
    badgeId: 'finisher',
    shareText,
    completedAt: serverTimestamp(),
  };

  await setDoc(completionRef, record, { merge: true });
  await updateDoc(doc(db, 'users', uid), {
    earnedBadges: arrayUnion('finisher'),
    'stats.challengesCompleted': increment(1),
  });
  return { isNew: true, record: { ...record, completedAt: new Date() } };
}

// ── Progress calendar ─────────────────────────────────────────────────────────
export async function getAllProgress(uid, challengeId) {
  const snap = await getDocs(
    collection(db, 'challenges', challengeId, 'members', uid, 'dailyLogs')
  );
  return snap.docs.reduce((acc, d) => ({ ...acc, [d.id]: d.data() }), {});
}

// ── Member data ───────────────────────────────────────────────────────────────
export async function getMemberData(uid, challengeId) {
  const snap = await getDoc(doc(db, 'challenges', challengeId, 'members', uid));
  return snap.exists() ? snap.data() : null;
}

// ── Challenge leaderboard ─────────────────────────────────────────────────────
export async function getChallengeLeaderboard(challengeId) {
  const snap = await getDocs(collection(db, 'challenges', challengeId, 'members'));
  return snap.docs
    .map(d => ({ uid: d.id, ...d.data() }))
    .filter(m => m.status === 'active')
    .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
}
