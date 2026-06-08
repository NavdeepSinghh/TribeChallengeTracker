import {
  deleteField, doc, getDoc, serverTimestamp, setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

async function updateJoinedChallengeMembers(uid, payload) {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  const joinedChallengeIds = snap.data()?.joinedChallengeIds || [];
  await Promise.all(joinedChallengeIds.map(challengeId =>
    setDoc(doc(db, 'challenges', challengeId, 'members', uid), payload, { merge: true })
  ));
}

export async function saveProfileAppearance(uid, { profileImageData, avatarEmoji, avatarColor }) {
  const payload = {
    avatarEmoji: avatarEmoji || '✨',
    avatarColor: avatarColor || '#FFD700',
    profileImageData: profileImageData || deleteField(),
  };
  await setDoc(doc(db, 'users', uid), payload, { merge: true });
  await updateJoinedChallengeMembers(uid, payload);
}

export async function saveProfileCosmetics(uid, { profileFrameId }) {
  const frameId = ['none', 'ember', 'gold', 'neon'].includes(profileFrameId) ? profileFrameId : 'none';
  const payload = {
    cosmetics: {
      profileFrameId: frameId,
      updatedAt: serverTimestamp(),
    },
  };
  await setDoc(doc(db, 'users', uid), payload, { merge: true });
  await updateJoinedChallengeMembers(uid, { profileFrameId: frameId });
  return payload.cosmetics;
}

export async function saveSocialProfile(uid, { instagramHandle }) {
  const normalized = (instagramHandle || '')
    .trim()
    .replace(/^@+/, '')
    .replace(/[^a-zA-Z0-9._]/g, '')
    .slice(0, 30);

  const payload = { instagramHandle: normalized };
  await setDoc(doc(db, 'users', uid), payload, { merge: true });
  await updateJoinedChallengeMembers(uid, payload);
  return normalized;
}
