const USER_SYNC_COOLDOWN_MS = 60 * 1000;
const GLOBAL_SYNC_WINDOW_MS = 60 * 1000;
const GLOBAL_SYNC_MAX_REQUESTS = 120;

function cleanRateLimitKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);
}

function normalizeMillis(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function evaluateWorkoutInsightRateLimit({
  globalLimit = {},
  globalMaxRequests = GLOBAL_SYNC_MAX_REQUESTS,
  globalWindowMs = GLOBAL_SYNC_WINDOW_MS,
  nowMs = Date.now(),
  userCooldownMs = USER_SYNC_COOLDOWN_MS,
  userLimit = {},
} = {}) {
  const lastUserSyncAtMs = normalizeMillis(userLimit.lastSyncAtMs);
  const userElapsedMs = lastUserSyncAtMs ? nowMs - lastUserSyncAtMs : userCooldownMs;
  if (userElapsedMs >= 0 && userElapsedMs < userCooldownMs) {
    return {
      allowed: false,
      reason: 'user_cooldown',
      retryAfterSeconds: Math.ceil((userCooldownMs - userElapsedMs) / 1000),
    };
  }

  const windowStartMs = normalizeMillis(globalLimit.windowStartMs);
  const windowIsActive = windowStartMs > 0 && (nowMs - windowStartMs) < globalWindowMs;
  const requestCount = windowIsActive ? normalizeMillis(globalLimit.requestCount) : 0;
  if (requestCount >= globalMaxRequests) {
    return {
      allowed: false,
      reason: 'global_window',
      retryAfterSeconds: Math.ceil((globalWindowMs - (nowMs - windowStartMs)) / 1000),
    };
  }

  return {
    allowed: true,
    nextGlobalLimit: {
      requestCount: requestCount + 1,
      windowStartMs: windowIsActive ? windowStartMs : nowMs,
    },
    nextUserLimit: {
      lastSyncAtMs: nowMs,
    },
  };
}

async function assertWorkoutInsightSyncRateLimit({
  admin,
  db,
  functionName,
  nowMs = Date.now(),
  throwRateLimitError,
  uid,
}) {
  const cleanFunctionName = cleanRateLimitKey(functionName);
  if (!cleanFunctionName) {
    throw new Error('A valid functionName is required for workout insight rate limiting.');
  }

  const userLimitRef = db
    .collection('users')
    .doc(uid)
    .collection('workoutInsightSyncRateLimits')
    .doc(cleanFunctionName);
  const globalLimitRef = db
    .collection('workoutInsightSyncRateLimits')
    .doc(cleanFunctionName);

  await db.runTransaction(async (transaction) => {
    const [userLimitSnap, globalLimitSnap] = await Promise.all([
      transaction.get(userLimitRef),
      transaction.get(globalLimitRef),
    ]);
    const result = evaluateWorkoutInsightRateLimit({
      globalLimit: globalLimitSnap.exists ? globalLimitSnap.data() : {},
      nowMs,
      userLimit: userLimitSnap.exists ? userLimitSnap.data() : {},
    });

    if (!result.allowed) {
      throw throwRateLimitError(result);
    }

    transaction.set(userLimitRef, {
      ...result.nextUserLimit,
      functionName: cleanFunctionName,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: false });
    transaction.set(globalLimitRef, {
      ...result.nextGlobalLimit,
      functionName: cleanFunctionName,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: false });
  });
}

module.exports = {
  GLOBAL_SYNC_MAX_REQUESTS,
  GLOBAL_SYNC_WINDOW_MS,
  USER_SYNC_COOLDOWN_MS,
  assertWorkoutInsightSyncRateLimit,
  cleanRateLimitKey,
  evaluateWorkoutInsightRateLimit,
};
