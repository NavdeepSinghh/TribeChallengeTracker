import {
  doc, setDoc, getDoc, getDocs, updateDoc,
  serverTimestamp, collection,
} from 'firebase/firestore';
import { db } from './firebase';

// Called on every sign-in — creates the doc if new, leaves existing data intact
export async function createUserIfNew(user) {
  const ref  = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid:         user.uid,
      email:       user.email,
      displayName: user.displayName || '',
      createdAt:   serverTimestamp(),
    });
    return;
  }
  const data = snap.data();

  // One-time migration: established accounts missing the onboardingDone flag
  if (!data.onboardingDone && !data.onboarding && (data.joinedChallengeIds?.length > 0 || data.stats?.challengesJoined > 0)) {
    await setDoc(ref, { onboardingDone: true }, { merge: true });
  }

  // One-time migration: flat literal-dot fields → proper nested stats
  // Old setDoc calls created top-level fields named literally "stats.challengesJoined"
  // (with a dot in the key name). updateDoc interprets dots as nested-path separators,
  // so this migrates the counts into the correct nested structure on first login.
  const flatJoined = data['stats.challengesJoined'];
  const flatOwned  = data['stats.challengesOwned'];
  if ((flatJoined != null || flatOwned != null) && !data.stats?.challengesJoined) {
    await updateDoc(ref, {
      'stats.challengesJoined': flatJoined || 0,
      'stats.challengesOwned':  flatOwned  || 0,
    });
  }
}

// Persists onboarding answers under users/{uid}
export async function saveOnboarding(uid, answers) {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, {
    onboarding: { ...answers, completedAt: serverTimestamp() },
    onboardingDone: true,
  }, { merge: true });
}

// Returns the full user profile document, or null if it doesn't exist
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

// ── Activity log persistence ───────────────────────────────────────────────────

// Saves one day's general activity to users/{uid}/activityLog/{dateStr}
export async function saveActivity(uid, dateStr, entry) {
  await setDoc(doc(db, 'users', uid, 'activityLog', dateStr), {
    ...entry,
    savedAt: serverTimestamp(),
  });
}

// Loads the full activity log for a user, keyed by date string
export async function getActivityLog(uid) {
  const snap = await getDocs(collection(db, 'users', uid, 'activityLog'));
  return snap.docs.reduce((acc, d) => ({ ...acc, [d.id]: d.data() }), {});
}

// ── Per-challenge points ───────────────────────────────────────────────────────

// Returns [{ challengeId, name, emoji, color, totalPoints, daysCompleted, currentStreak }]
// for every challenge the user is a member of
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
        challengeId:   id,
        name:          c.name   || 'Unknown Challenge',
        emoji:         c.emoji  || '🎯',
        color:         c.color  || '#FF6B35',
        totalPoints:   m.totalPoints   || 0,
        daysCompleted: m.daysCompleted || 0,
        currentStreak: m.currentStreak || 0,
      };
    })
  );
  return results.filter(Boolean);
}
