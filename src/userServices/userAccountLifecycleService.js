import {
  doc, getDoc, setDoc, updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { safeSessionGet } from '../browserStorage';

export async function createUserIfNew(user) {
  const ref  = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const pendingReferralUid = safeSessionGet('pendingReferralUid');
    const appReferredBy = pendingReferralUid && pendingReferralUid !== user.uid
      ? pendingReferralUid
      : '';
    await setDoc(ref, {
      uid:         user.uid,
      email:       user.email,
      displayName: user.displayName || '',
      createdAt:   serverTimestamp(),
      appReferredBy,
      avatarEmoji: '✨',
      avatarColor: '#FFD700',
      instagramHandle: '',
      entitlements: {
        pro: { active: false, source: 'none' },
      },
    });
    return;
  }
  const data = snap.data();

  if (!data.onboardingDone && !data.onboarding && (data.joinedChallengeIds?.length > 0 || data.stats?.challengesJoined > 0)) {
    await setDoc(ref, { onboardingDone: true }, { merge: true });
  }

  const flatJoined = data['stats.challengesJoined'];
  const flatOwned  = data['stats.challengesOwned'];
  if ((flatJoined != null || flatOwned != null) && !data.stats?.challengesJoined) {
    await updateDoc(ref, {
      'stats.challengesJoined': flatJoined || 0,
      'stats.challengesOwned':  flatOwned  || 0,
    });
  }
}

export async function saveOnboarding(uid, answers) {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, {
    onboarding: { ...answers, completedAt: serverTimestamp() },
    onboardingDone: true,
  }, { merge: true });
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}
