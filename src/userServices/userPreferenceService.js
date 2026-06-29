import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { invalidateCachedRead, userProfileCacheKey } from './readCache';

export async function saveCustomGoals(uid, goals) {
  const weeklyActiveDaysTarget = Math.min(7, Math.max(1, Number(goals.weeklyActiveDaysTarget) || 5));
  const weeklyPointsTarget = Math.min(10000, Math.max(50, Number(goals.weeklyPointsTarget) || 250));
  const streakTarget = Math.min(365, Math.max(1, Number(goals.streakTarget) || 30));
  const payload = {
    goals: {
      weeklyActiveDaysTarget,
      weeklyPointsTarget,
      streakTarget,
      updatedAt: serverTimestamp(),
    },
  };
  await setDoc(doc(db, 'users', uid), payload, { merge: true });
  invalidateCachedRead(userProfileCacheKey(uid));
  return payload.goals;
}

export async function saveSharePreferences(uid, { templateId }) {
  const allowed = ['classic', 'gold', 'neon'];
  const cleanTemplateId = allowed.includes(templateId) ? templateId : 'classic';
  const payload = {
    sharePreferences: {
      templateId: cleanTemplateId,
      updatedAt: serverTimestamp(),
    },
  };
  await setDoc(doc(db, 'users', uid), payload, { merge: true });
  invalidateCachedRead(userProfileCacheKey(uid));
  return payload.sharePreferences;
}
