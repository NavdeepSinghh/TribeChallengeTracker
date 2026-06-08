import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export function sortByCreatedAtDesc(items) {
  return items.sort((a, b) => {
    const left = a.createdAt?.toMillis?.() || 0;
    const right = b.createdAt?.toMillis?.() || 0;
    return right - left;
  });
}
