import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Called on every sign-in — creates the doc if new, leaves existing data intact
export async function createUserIfNew(user) {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid:         user.uid,
      email:       user.email,
      displayName: user.displayName || '',
      createdAt:   serverTimestamp(),
    });
  }
}

// Persists onboarding answers under users/{uid}/onboarding
export async function saveOnboarding(uid, answers) {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, {
    onboarding: { ...answers, completedAt: serverTimestamp() },
  }, { merge: true });
}

// Returns the full user profile document, or null if it doesn't exist
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}
