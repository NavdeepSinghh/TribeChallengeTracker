import {
  Timestamp,
  addDoc,
  collection,
  limit as queryLimit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';

export async function writeTribeFeedEntry({
  uid,
  displayName,
  avatarEmoji,
  avatarColor,
  instagramHandle,
  activityType,
  activityLabel,
  activityEmoji,
  value,
  unit,
  points,
  challengeName,
  challengeId,
  currentStreak,
  activityLogId,
  activityDate,
}) {
  try {
    await addDoc(collection(db, 'tribeFeed'), {
      uid,
      displayName: displayName || 'Tribe member',
      avatarEmoji: avatarEmoji || '💪',
      avatarColor: avatarColor || '#FF6B35',
      instagramHandle: instagramHandle || null,
      activityType,
      activityLabel,
      activityEmoji,
      value,
      unit,
      points,
      challengeName: challengeName || null,
      challengeId: challengeId || null,
      currentStreak: currentStreak || 0,
      activityLogId: activityLogId || null,
      activityDate: activityDate || null,
      loggedAt: serverTimestamp(),
    });
  } catch (e) {
    // The feed mirrors activity logs; activity logging itself should never fail because of it.
  }
}

export function listenTodayTribeFeed(onChange, limitCount = 10) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const q = query(
    collection(db, 'tribeFeed'),
    where('loggedAt', '>=', Timestamp.fromDate(start)),
    orderBy('loggedAt', 'desc'),
    queryLimit(Math.max(limitCount * 3, limitCount))
  );

  return onSnapshot(
    q,
    snap => onChange(uniqueByUser(snap.docs.map(d => ({ id: d.id, ...d.data() })), limitCount)),
    () => onChange([])
  );
}

function uniqueByUser(entries, limitCount) {
  const seen = new Set();
  const unique = [];
  for (const entry of entries) {
    const key = entry.uid || entry.id;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(entry);
    if (unique.length === limitCount) break;
  }
  return unique;
}
