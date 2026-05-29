import {
  doc, setDoc, getDoc, getDocs, updateDoc,
  collection, serverTimestamp, increment,
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

export async function logDay(uid, challengeId, completedTaskIds, totalTaskCount) {
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

  return { points, allComplete, newStreak };
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
