import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

export async function getTrainingSessions(uid) {
  if (!uid) return [];
  const snap = await getDocs(query(
    collection(db, 'users', uid, 'trainingSessions'),
    orderBy('dateStr', 'desc')
  ));
  return snap.docs.map(sessionDoc => ({ id: sessionDoc.id, ...sessionDoc.data() }));
}

export async function saveTrainingSession(uid, session) {
  if (!uid) throw new Error('Missing user');
  const id = session.id || `${session.dateStr}_${session.type}_${Date.now()}`;
  const ref = doc(db, 'users', uid, 'trainingSessions', id);
  await setDoc(ref, {
    ...session,
    id,
    updatedAt: serverTimestamp(),
    createdAt: session.createdAt || serverTimestamp(),
  }, { merge: true });
  return { ...session, id };
}

export async function deleteTrainingSession(uid, sessionId) {
  if (!uid || !sessionId) return;
  await deleteDoc(doc(db, 'users', uid, 'trainingSessions', sessionId));
}
