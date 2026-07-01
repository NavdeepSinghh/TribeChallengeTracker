import {
  collection,
  doc,
  deleteField,
  documentId,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  where,
  writeBatch,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  FOLLOW_PROFILE_VISIBILITY,
  ROUTINE_VISIBILITY,
  buildPublicProfilePayload,
  buildPublicRoutinePayload,
  normalizeBio,
  normalizeRoutineVisibility,
  normalizeVisibility,
  shouldShowDiscoverProfile,
  shouldShowRoutine,
} from '../follow/followModel';
import { isFollowFeatureEnabledForUser } from '../featureFlags';
import { cachedRead, invalidateCachedRead, setCachedRead } from './readCache';

export { FOLLOW_PROFILE_VISIBILITY, ROUTINE_VISIBILITY };

function assertFollowFeatureEnabled(uid) {
  if (!isFollowFeatureEnabledForUser(uid)) {
    throw new Error('Follow beta is not enabled for this account yet.');
  }
}

export async function saveFollowProfileSettings(uid, profile, settings) {
  if (!uid) throw new Error('Missing user');
  assertFollowFeatureEnabled(uid);

  const profileVisibility = normalizeVisibility(settings.profileVisibility);
  const routineDefaultVisibility = normalizeRoutineVisibility(settings.routineDefaultVisibility);
  const bio = normalizeBio(settings.bio);
  const publicProfile = buildPublicProfilePayload(uid, profile, {
    bio,
    profileVisibility,
    routineDefaultVisibility,
  });

  const followProfile = {
    ...((profile && profile.followProfile) || {}),
    bio,
    profileVisibility,
    routineDefaultVisibility,
    updatedAt: serverTimestamp(),
  };

  const batch = writeBatch(db);
  batch.set(doc(db, 'users', uid), { followProfile }, { merge: true });
  batch.set(doc(db, 'publicProfiles', uid), {
    ...publicProfile,
    updatedAt: serverTimestamp(),
  }, { merge: true });
  await batch.commit();
  invalidateCachedRead(`discoverProfiles:`);
  invalidateCachedRead(`publicProfile:${uid}`);
  invalidateCachedRead(`userProfile:${uid}`);

  return followProfile;
}

export async function fetchDiscoverProfiles(currentUid, limitCount = 12) {
  assertFollowFeatureEnabled(currentUid);
  return cachedRead(`discoverProfiles:${currentUid}:${limitCount}`, async () => {
    const snap = await getDocs(query(
      collection(db, 'publicProfiles'),
      where('profileVisibility', '==', FOLLOW_PROFILE_VISIBILITY.PUBLIC),
      limit(limitCount)
    ));

    return snap.docs
      .map(profileDoc => ({ id: profileDoc.id, ...profileDoc.data() }))
      .filter(profile => shouldShowDiscoverProfile(profile, currentUid))
      .sort((left, right) => {
        const followerDelta = (right.followersCount || 0) - (left.followersCount || 0);
        if (followerDelta) return followerDelta;
        return (right.currentStreak || 0) - (left.currentStreak || 0);
      });
  }, 60 * 1000);
}

export async function getPublicProfile(uid) {
  assertFollowFeatureEnabled(uid);
  if (!uid) return null;
  return cachedRead(`publicProfile:${uid}`, async () => {
    const snap = await getDoc(doc(db, 'publicProfiles', uid));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  }, 5 * 60 * 1000);
}

export async function fetchPublicProfilesByUid(currentUid, uids = []) {
  assertFollowFeatureEnabled(currentUid);
  const uniqueUids = Array.from(new Set(uids.filter(Boolean))).slice(0, 40);
  if (!uniqueUids.length) return [];

  const cachedProfiles = await Promise.all(uniqueUids.map(uid => getPublicProfile(uid).catch(() => null)));
  const cachedByUid = new Map(cachedProfiles.filter(Boolean).map(profile => [profile.uid || profile.id, profile]));
  const missingUids = uniqueUids.filter(uid => !cachedByUid.has(uid));
  if (!missingUids.length) return Array.from(cachedByUid.values());

  const chunks = [];
  for (let index = 0; index < missingUids.length; index += 10) {
    chunks.push(missingUids.slice(index, index + 10));
  }

  const snaps = await Promise.all(chunks.map(chunk => getDocs(query(
    collection(db, 'publicProfiles'),
    where(documentId(), 'in', chunk)
  ))));

  snaps.forEach(snap => {
    snap.docs.forEach(profileDoc => {
      const profile = { id: profileDoc.id, ...profileDoc.data() };
      if (profile.profileVisibility === FOLLOW_PROFILE_VISIBILITY.PUBLIC) {
        cachedByUid.set(profile.uid || profileDoc.id, profile);
        setCachedRead(`publicProfile:${profileDoc.id}`, profile, 5 * 60 * 1000);
      }
    });
  });

  return Array.from(cachedByUid.values())
    .filter(profile => profile.profileVisibility === FOLLOW_PROFILE_VISIBILITY.PUBLIC)
    .filter(profile => shouldShowDiscoverProfile(profile, currentUid));
}

export async function publishRoutine(uid, profile, session, visibility = ROUTINE_VISIBILITY.PUBLIC) {
  if (!uid) throw new Error('Missing user');
  assertFollowFeatureEnabled(uid);
  if (!session?.id) throw new Error('Save the workout before sharing it.');

  const payload = buildPublicRoutinePayload(uid, profile, session, { visibility });
  const publicRoutineId = `${uid}_${session.id}`;
  const batch = writeBatch(db);

  batch.set(doc(db, 'publicRoutines', publicRoutineId), {
    ...payload,
    id: publicRoutineId,
    publicRoutineId,
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });

  batch.set(doc(db, 'users', uid, 'trainingSessions', session.id), {
    routineVisibility: payload.visibility,
    publicRoutineId,
    updatedAt: serverTimestamp(),
  }, { merge: true });

  await batch.commit();
  invalidateCachedRead(`publicRoutines:${uid}:`);
  return { ...payload, id: publicRoutineId, publicRoutineId };
}

export async function unpublishRoutine(uid, session) {
  assertFollowFeatureEnabled(uid);
  if (!uid || !session?.id) return;
  const publicRoutineId = session.publicRoutineId || `${uid}_${session.id}`;
  const batch = writeBatch(db);
  batch.delete(doc(db, 'publicRoutines', publicRoutineId));
  batch.set(doc(db, 'users', uid, 'trainingSessions', session.id), {
    routineVisibility: ROUTINE_VISIBILITY.PRIVATE,
    publicRoutineId: deleteField(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
  await batch.commit();
  invalidateCachedRead(`publicRoutines:${uid}:`);
}

export async function fetchPublicRoutinesForProfile(ownerUid, currentUid, limitCount = 10) {
  assertFollowFeatureEnabled(currentUid);
  if (!ownerUid) return [];
  return cachedRead(`publicRoutines:${ownerUid}:${currentUid}:${limitCount}`, async () => {
    const publicSnap = await getDocs(query(
      collection(db, 'publicRoutines'),
      where('ownerUid', '==', ownerUid),
      where('visibility', '==', ROUTINE_VISIBILITY.PUBLIC),
      limit(limitCount)
    ));

    const snaps = [publicSnap];
    let canSeeFollowerRoutines = false;
    if (currentUid && currentUid !== ownerUid) {
      const status = await getFollowStatus(currentUid, ownerUid);
      if (status === 'following') {
        canSeeFollowerRoutines = true;
        snaps.push(await getDocs(query(
          collection(db, 'publicRoutines'),
          where('ownerUid', '==', ownerUid),
          where('visibility', '==', ROUTINE_VISIBILITY.FOLLOWERS),
          limit(limitCount)
        )));
      }
    }

    const byId = new Map();
    snaps.forEach(snap => {
      snap.docs.forEach(routineDoc => {
        byId.set(routineDoc.id, { id: routineDoc.id, ...routineDoc.data() });
      });
    });

    return Array.from(byId.values())
      .filter(routine => shouldShowRoutine(routine, currentUid, { isFollowingOwner: canSeeFollowerRoutines }))
      .sort((left, right) => String(right.dateStr || '').localeCompare(String(left.dateStr || '')));
  }, 2 * 60 * 1000);
}

export async function getFollowStatus(uid, targetUid) {
  assertFollowFeatureEnabled(uid);
  if (!uid || !targetUid || uid === targetUid) return 'self';
  return cachedRead(`followStatus:${uid}:${targetUid}`, async () => {
    const snap = await getDoc(doc(db, 'users', uid, 'following', targetUid));
    return snap.exists() ? 'following' : 'none';
  }, 5 * 60 * 1000);
}

export async function followUser(uid, targetProfile) {
  assertFollowFeatureEnabled(uid);
  const targetUid = targetProfile?.uid || targetProfile?.id;
  if (!uid || !targetUid) throw new Error('Missing follow target');
  if (uid === targetUid) return 'self';

  const status = await getFollowStatus(uid, targetUid);
  if (status === 'following') return status;

  const payload = {
    uid,
    targetUid,
    targetDisplayName: targetProfile.displayName || 'Tribe Member',
    targetAvatarEmoji: targetProfile.avatarEmoji || '✨',
    targetAvatarColor: targetProfile.avatarColor || '#FFD700',
    status: 'following',
    createdAt: serverTimestamp(),
  };
  const followerPayload = {
    uid,
    followerUid: uid,
    targetUid,
    status: 'following',
    createdAt: serverTimestamp(),
  };

  const batch = writeBatch(db);
  batch.set(doc(db, 'users', uid, 'following', targetUid), payload, { merge: true });
  batch.set(doc(db, 'users', targetUid, 'followers', uid), followerPayload, { merge: true });
  await batch.commit();
  setCachedRead(`followStatus:${uid}:${targetUid}`, 'following', 5 * 60 * 1000);
  invalidateCachedRead(`discoverProfiles:`);
  invalidateCachedRead(`publicRoutines:${targetUid}:${uid}:`);
  return 'following';
}

export async function unfollowUser(uid, targetUid) {
  assertFollowFeatureEnabled(uid);
  if (!uid || !targetUid || uid === targetUid) return;
  await Promise.all([
    deleteDoc(doc(db, 'users', uid, 'following', targetUid)),
    deleteDoc(doc(db, 'users', targetUid, 'followers', uid)),
  ]);
  setCachedRead(`followStatus:${uid}:${targetUid}`, 'none', 5 * 60 * 1000);
  invalidateCachedRead(`discoverProfiles:`);
  invalidateCachedRead(`publicRoutines:${targetUid}:${uid}:`);
}
