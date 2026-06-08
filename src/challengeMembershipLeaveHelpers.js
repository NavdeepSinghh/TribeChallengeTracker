import {
  arrayRemove,
  increment,
} from 'firebase/firestore';

export function buildLeaveChallengeUserStats({
  challengeId,
  isAdmin,
}) {
  const stats = {
    joinedChallengeIds: arrayRemove(challengeId),
    'stats.challengesJoined': increment(-1),
  };

  if (isAdmin) {
    return {
      ...stats,
      'stats.challengesOwned': increment(-1),
    };
  }

  return stats;
}

export function selectReplacementChallengeAdmin(memberDocs, uid) {
  return memberDocs
    .filter(d => d.id !== uid)
    .map(d => ({ uid: d.id, ...d.data() }))
    .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))[0] || null;
}
