import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  buildLeaveChallengeUserStats,
  selectReplacementChallengeAdmin,
} from './challengeMembershipLeaveHelpers';

export async function leaveChallenge(uid, challengeId) {
  const challengeRef = doc(db, 'challenges', challengeId);
  const memberRef = doc(db, 'challenges', challengeId, 'members', uid);

  const [challengeSnap, memberSnap] = await Promise.all([
    getDoc(challengeRef),
    getDoc(memberRef),
  ]);

  if (!challengeSnap.exists() || !memberSnap.exists()) return { deleted: false };

  const challenge = challengeSnap.data();
  const member = memberSnap.data();
  const isAdmin = member.role === 'admin';

  if (isAdmin && (challenge.memberCount || 1) <= 1) {
    await deleteDoc(memberRef);
    await deleteDoc(challengeRef);
    await updateDoc(doc(db, 'users', uid), buildLeaveChallengeUserStats({
      challengeId,
      isAdmin: true,
    }));
    return { deleted: true };
  }

  if (isAdmin) {
    const membersSnap = await getDocs(collection(db, 'challenges', challengeId, 'members'));
    const newAdmin = selectReplacementChallengeAdmin(membersSnap.docs, uid);

    if (newAdmin) {
      await updateDoc(doc(db, 'challenges', challengeId, 'members', newAdmin.uid), { role: 'admin' });
      await updateDoc(challengeRef, {
        createdBy: newAdmin.uid,
        creatorName: newAdmin.displayName || '',
      });
    }

    await updateDoc(doc(db, 'users', uid), buildLeaveChallengeUserStats({
      challengeId,
      isAdmin: true,
    }));
  } else {
    await updateDoc(doc(db, 'users', uid), buildLeaveChallengeUserStats({
      challengeId,
      isAdmin: false,
    }));
  }

  await deleteDoc(memberRef);
  await updateDoc(challengeRef, { memberCount: increment(-1) });

  return { deleted: false };
}
