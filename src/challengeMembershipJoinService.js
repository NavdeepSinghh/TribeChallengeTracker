import {
  arrayUnion,
  doc,
  increment,
  runTransaction,
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
  const challengeRef = doc(db, 'challenges', challengeId);
  const userRef = doc(db, 'users', uid);
  const normalizedReferral = normalizeChallengeReferralUid(uid, referralUid);

  await runTransaction(db, async transaction => {
    const [memberSnap, userSnap] = await Promise.all([
      transaction.get(memberRef),
      transaction.get(userRef),
    ]);
    const userData = userSnap.data() || {};
    const joinedIds = Array.isArray(userData.joinedChallengeIds) ? userData.joinedChallengeIds : [];
    const alreadyListed = joinedIds.includes(challengeId);
    const alreadyMember = memberSnap.exists();

    if (!alreadyMember) {
      transaction.set(memberRef, buildChallengeMemberRecord({
        includeReferralFields: true,
        uid,
        userData,
        referralUid: normalizedReferral,
      }));
      transaction.set(challengeRef, { memberCount: increment(1) }, { merge: true });
    }

    if (!alreadyListed) {
      transaction.set(userRef, {
        joinedChallengeIds: arrayUnion(challengeId),
        stats: {
          challengesJoined: increment(1),
        },
      }, { merge: true });
    }
  });
  invalidateCachedRead(userProfileCacheKey(uid));
  invalidateCachedRead(`userChallenges:`);
  invalidateCachedRead(`isMember:${challengeId}:${uid}`);
  invalidateCachedRead(`challengeLeaderboard:${challengeId}`);
  await recordReferralChallengeJoin(normalizedReferral);
}
