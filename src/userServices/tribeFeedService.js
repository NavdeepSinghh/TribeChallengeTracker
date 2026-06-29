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
import { getCachedRead, invalidateCachedRead, setCachedRead } from './readCache';

const feedCacheKey = (scope, limitCount) => `tribeFeed:${scope}:${limitCount}`;
const FEED_CACHE_TTL_MS = 60 * 1000;

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
    invalidateCachedRead('tribeFeed:');
  } catch (e) {
    // The feed mirrors activity logs; activity logging itself should never fail because of it.
  }
}

export function listenTodayTribeFeed(onChange, limitCount = 10) {
  const cacheKey = feedCacheKey('today', limitCount);
  const cached = getCachedRead(cacheKey);
  if (cached) onChange(cached);

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const q = query(
    collection(db, 'tribeFeed'),
    where('loggedAt', '>=', Timestamp.fromDate(start)),
    orderBy('loggedAt', 'desc'),
    queryLimit(limitCount)
  );

  return onSnapshot(
    q,
    snap => {
      const entries = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setCachedRead(cacheKey, entries, FEED_CACHE_TTL_MS);
      onChange(entries);
    },
    () => onChange([])
  );
}

export function listenRecentTribeFeed(onChange, limitCount = 50) {
  const cacheKey = feedCacheKey('recent', limitCount);
  const cached = getCachedRead(cacheKey);
  if (cached) onChange(cached);

  const q = query(
    collection(db, 'tribeFeed'),
    orderBy('loggedAt', 'desc'),
    queryLimit(limitCount)
  );

  return onSnapshot(
    q,
    snap => {
      const entries = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setCachedRead(cacheKey, entries, FEED_CACHE_TTL_MS);
      onChange(entries);
    },
    error => {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Tribe feed listener failed', error);
      }
      onChange([]);
    }
  );
}
