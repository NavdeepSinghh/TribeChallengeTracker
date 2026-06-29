import {
  arrayUnion,
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { invalidateCachedRead, userProfileCacheKey } from './userServices/readCache';
import {
  buildChallengeMemberRecord,
  normalizeChallengeReferralUid,
  recordReferralChallengeJoin,
} from './challengeMembershipJoinHelpers';

export async function joinChallenge(uid, challengeId, referralUid = '') {
  const memberRef = doc(db, 'challenges', challengeId, 'members', uid);
  if ((await getDoc(memberRef)).exists()) return;

  const userSnap = await getDoc(doc(db, 'users', uid));
  const userData = userSnap.data() || {};
  const normalizedReferral = normalizeChallengeReferralUid(uid, referralUid);

  await setDoc(memberRef, buildChallengeMemberRecord({
    includeReferralFields: true,
    uid,
    userData,
    referralUid: normalizedReferral,
  }));
  await setDoc(doc(db, 'challenges', challengeId), { memberCount: increment(1) }, { merge: true });
  await updateDoc(doc(db, 'users', uid), {
    joinedChallengeIds: arrayUnion(challengeId),
    'stats.challengesJoined': increment(1),
  });
  invalidateCachedRead(userProfileCacheKey(uid));
  invalidateCachedRead(`userChallenges:`);
  invalidateCachedRead(`isMember:${challengeId}:${uid}`);
  invalidateCachedRead(`challengeLeaderboard:${challengeId}`);
  await recordReferralChallengeJoin(normalizedReferral);
}
