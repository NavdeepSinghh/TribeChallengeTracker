import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';

export async function saveActivity(uid, dateStr, entry) {
  await setDoc(doc(db, 'users', uid, 'activityLog', dateStr), {
    ...entry,
    savedAt: serverTimestamp(),
  });
}

export async function deleteActivity(uid, dateStr, activityId, activityIndex) {
  const ref = doc(db, 'users', uid, 'activityLog', dateStr);
  const snap = await getDoc(ref);
  const existing = snap.exists() ? snap.data() : {};
  const activities = existing.activities || (existing.type ? [existing] : []);
  const nextActivities = activities.filter((activity, index) => {
    if (activityId) return activity.id !== activityId;
    return index !== activityIndex;
  });
  const totalPoints = nextActivities.reduce((sum, activity) => sum + (activity.points || 0), 0);
  await setDoc(ref, {
    activities: nextActivities,
    points: totalPoints,
    totalPoints,
    date: dateStr,
    savedAt: serverTimestamp(),
  });

  if (activityId) {
    const feedSnap = await getDocs(query(
      collection(db, 'tribeFeed'),
      where('uid', '==', uid),
      where('activityLogId', '==', activityId)
    ));
    await Promise.all(feedSnap.docs.map(feedDoc => deleteDoc(feedDoc.ref)));
  }
}

export async function saveStreakRecovery(uid, dateStr) {
  const ref = doc(db, 'users', uid, 'activityLog', dateStr);
  const snap = await getDoc(ref);
  const existing = snap.exists() ? snap.data() : {};
  const activities = existing.activities || (existing.type ? [existing] : []);
  if (activities.some(activity => activity.id === `streak_recovery_${dateStr}` || activity.activityId === 'streak_recovery')) {
    return { ...(existing || {}), activities };
  }
  const nextActivities = [
    ...activities,
    {
      id: `streak_recovery_${dateStr}`,
      type: 'streak_recovery',
      activityId: 'streak_recovery',
      value: 1,
      note: 'Pro streak recovery credit',
      points: 0,
      loggedAt: dateStr,
    },
  ];
  const next = {
    activities: nextActivities,
    points: nextActivities.reduce((sum, activity) => sum + (activity.points || 0), 0),
    totalPoints: nextActivities.reduce((sum, activity) => sum + (activity.points || 0), 0),
    date: dateStr,
    recoveredByPro: true,
    savedAt: serverTimestamp(),
  };
  await setDoc(ref, next, { merge: true });
  await setDoc(doc(db, 'users', uid), {
    streakRecovery: {
      lastRecoveredDate: dateStr,
      updatedAt: serverTimestamp(),
    },
  }, { merge: true });
  return next;
}

export async function getActivityLog(uid) {
  const snap = await getDocs(collection(db, 'users', uid, 'activityLog'));
  return snap.docs.reduce((acc, d) => ({ ...acc, [d.id]: d.data() }), {});
}

export async function getUserChallengePoints(uid, challengeIds) {
  if (!challengeIds?.length) return [];
  const results = await Promise.all(
    challengeIds.map(async (id) => {
      const [memberSnap, challengeSnap] = await Promise.all([
        getDoc(doc(db, 'challenges', id, 'members', uid)),
        getDoc(doc(db, 'challenges', id)),
      ]);
      if (!memberSnap.exists() || !challengeSnap.exists()) return null;
      const m = memberSnap.data();
      const c = challengeSnap.data();
      return {
        challengeId: id,
        name: c.name || 'Unknown Challenge',
        emoji: c.emoji || '🎯',
        color: c.color || '#FF6B35',
        totalPoints: m.totalPoints || 0,
        daysCompleted: m.daysCompleted || 0,
        currentStreak: m.currentStreak || 0,
      };
    })
  );
  return results.filter(Boolean);
}
