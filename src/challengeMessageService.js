import {
  addDoc,
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const todayStr = () => new Date().toISOString().split('T')[0];

function cleanMessage(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, 280);
}

function messagesRef(challengeId) {
  return collection(db, 'challenges', challengeId, 'messages');
}

export function subscribeChallengeMessages(challengeId, onChange, limitCount = 10) {
  const q = query(messagesRef(challengeId), orderBy('createdAt', 'desc'), limit(limitCount));
  return onSnapshot(q, snap => {
    onChange(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
}

export async function fetchChallengeMessages(challengeId, limitCount = 10) {
  const q = query(messagesRef(challengeId), orderBy('createdAt', 'desc'), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function sendChallengeAnnouncement({
  challenge,
  message,
  senderUid,
  senderName,
  senderRole = 'admin',
}) {
  const cleaned = cleanMessage(message);
  if (!cleaned) return null;
  return addDoc(messagesRef(challenge.id), {
    challengeId: challenge.id,
    challengeName: challenge.name,
    senderUid,
    senderName: senderName || 'Challenge admin',
    senderRole,
    type: 'announcement',
    message: cleaned,
    targetDate: todayStr(),
    notificationRequested: true,
    notificationSent: false,
    createdAt: serverTimestamp(),
  });
}

export async function sendChallengeLogReminder({
  challenge,
  senderUid,
  senderName,
  senderRole = 'admin',
}) {
  return addDoc(messagesRef(challenge.id), {
    challengeId: challenge.id,
    challengeName: challenge.name,
    senderUid,
    senderName: senderName || 'Challenge admin',
    senderRole,
    type: 'log_reminder',
    message: `Reminder: log today's progress in ${challenge.name}.`,
    targetDate: todayStr(),
    notificationRequested: true,
    notificationSent: false,
    createdAt: serverTimestamp(),
  });
}
