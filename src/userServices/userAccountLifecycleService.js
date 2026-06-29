import {
  doc, getDoc, serverTimestamp, setDoc, updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { safeSessionGet } from '../browserStorage';
import { FEATURE_FLAGS } from '../featureFlags';
import {
  DEFAULT_FOLLOW_PROFILE_VISIBILITY,
  DEFAULT_ROUTINE_VISIBILITY,
  buildPublicProfilePayload,
} from '../follow/followModel';
import { cachedRead, invalidateCachedRead, setCachedRead, userProfileCacheKey } from './readCache';
const USER_PROFILE_TTL_MS = 5 * 60 * 1000;

function userProfileFromAuth(user, data = {}) {
  return {
    ...data,
    uid: user.uid,
    email: data.email || user.email || '',
    displayName: data.displayName || user.displayName || '',
    avatarEmoji: data.avatarEmoji || '✨',
    avatarColor: data.avatarColor || '#FFD700',
  };
}

async function ensureDefaultPublicFollowProfile(user, data = {}) {
  if (!FEATURE_FLAGS.FOLLOW_FEATURE_ENABLED || !user?.uid) return;
  const existingFollowProfile = data.followProfile || {};
  if (existingFollowProfile.profileVisibility) return;

  const followProfile = {
    ...existingFollowProfile,
    bio: existingFollowProfile.bio || '',
    profileVisibility: DEFAULT_FOLLOW_PROFILE_VISIBILITY,
    routineDefaultVisibility: existingFollowProfile.routineDefaultVisibility || DEFAULT_ROUTINE_VISIBILITY,
    followersCount: existingFollowProfile.followersCount || 0,
    followingCount: existingFollowProfile.followingCount || 0,
    updatedAt: serverTimestamp(),
  };
  const profile = userProfileFromAuth(user, {
    ...data,
    followProfile,
  });
  const publicProfile = buildPublicProfilePayload(user.uid, profile, followProfile);

  await Promise.all([
    setDoc(doc(db, 'users', user.uid), { followProfile }, { merge: true }),
    setDoc(doc(db, 'publicProfiles', user.uid), {
      ...publicProfile,
      updatedAt: serverTimestamp(),
    }, { merge: true }),
  ]);
}

export async function createUserIfNew(user) {
  const ref  = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const pendingReferralUid = safeSessionGet('pendingReferralUid');
    const appReferredBy = pendingReferralUid && pendingReferralUid !== user.uid
      ? pendingReferralUid
      : '';
    const followProfile = FEATURE_FLAGS.FOLLOW_FEATURE_ENABLED ? {
      bio: '',
      profileVisibility: DEFAULT_FOLLOW_PROFILE_VISIBILITY,
      routineDefaultVisibility: DEFAULT_ROUTINE_VISIBILITY,
      followersCount: 0,
      followingCount: 0,
      updatedAt: serverTimestamp(),
    } : undefined;
    const userProfile = {
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
      ...(followProfile ? { followProfile } : {}),
    };
    await setDoc(ref, userProfile);
    setCachedRead(userProfileCacheKey(user.uid), userProfile, USER_PROFILE_TTL_MS);
    if (followProfile) {
      await setDoc(doc(db, 'publicProfiles', user.uid), {
        ...buildPublicProfilePayload(user.uid, userProfile, followProfile),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }
    return;
  }
  const data = snap.data();
  await ensureDefaultPublicFollowProfile(user, data);
  invalidateCachedRead(userProfileCacheKey(user.uid));

  if (!data.onboardingDone && !data.onboarding && (data.joinedChallengeIds?.length > 0 || data.stats?.challengesJoined > 0)) {
    await setDoc(ref, { onboardingDone: true }, { merge: true });
    invalidateCachedRead(userProfileCacheKey(user.uid));
  }

  const flatJoined = data['stats.challengesJoined'];
  const flatOwned  = data['stats.challengesOwned'];
  if ((flatJoined != null || flatOwned != null) && !data.stats?.challengesJoined) {
    await updateDoc(ref, {
      'stats.challengesJoined': flatJoined || 0,
      'stats.challengesOwned':  flatOwned  || 0,
    });
    invalidateCachedRead(userProfileCacheKey(user.uid));
  }
}

export async function saveOnboarding(uid, answers) {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, {
    onboarding: { ...answers, completedAt: serverTimestamp() },
    onboardingDone: true,
  }, { merge: true });
  invalidateCachedRead(userProfileCacheKey(uid));
}

export async function getUserProfile(uid) {
  return cachedRead(userProfileCacheKey(uid), async () => {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  }, USER_PROFILE_TTL_MS);
}
