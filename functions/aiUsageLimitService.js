const {
  monthKeyForDate,
  weekKeyForDate,
} = require('./aiConfig');

function normalizeCount(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}

function normalizeCost(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function evaluateAiUsageLimit({
  config,
  globalMinute = {},
  globalMonth = {},
  nowMs = Date.now(),
  userWeek = {},
} = {}) {
  const minuteWindowMs = 60 * 1000;
  const globalWindowStartMs = Number(globalMinute.windowStartMs) || 0;
  const globalWindowActive = globalWindowStartMs > 0 && (nowMs - globalWindowStartMs) < minuteWindowMs;
  const globalWindowCount = globalWindowActive ? normalizeCount(globalMinute.requestCount) : 0;

  if (globalWindowCount >= config.maxGlobalCallsPerMinute) {
    return {
      allowed: false,
      reason: 'global_minute_limit',
      retryAfterSeconds: Math.max(1, Math.ceil((minuteWindowMs - (nowMs - globalWindowStartMs)) / 1000)),
    };
  }

  const userWeekCount = normalizeCount(userWeek.requestCount);
  if (userWeekCount >= config.maxCallsPerUserPerWeek) {
    return {
      allowed: false,
      reason: 'user_weekly_limit',
      retryAfterSeconds: 7 * 24 * 60 * 60,
    };
  }

  const globalMonthCost = normalizeCost(globalMonth.estimatedCostUsd);
  if (config.monthlyBudgetUsd > 0 && globalMonthCost >= config.monthlyBudgetUsd) {
    return {
      allowed: false,
      reason: 'monthly_budget_limit',
      retryAfterSeconds: 24 * 60 * 60,
    };
  }

  return {
    allowed: true,
    nextGlobalMinute: {
      requestCount: globalWindowCount + 1,
      windowStartMs: globalWindowActive ? globalWindowStartMs : nowMs,
    },
    nextUserWeek: {
      requestCount: userWeekCount + 1,
    },
  };
}

async function assertAiUsageAllowed({
  admin,
  config,
  db,
  feature,
  now = new Date(),
  throwRateLimitError,
  uid,
}) {
  const nowMs = now.getTime();
  const FieldValue = admin.firestore.FieldValue;
  const weekKey = weekKeyForDate(now);
  const monthKey = monthKeyForDate(now);
  const userWeekRef = db.collection('users').doc(uid).collection('aiUsage').doc(`week_${weekKey}`);
  const globalMinuteRef = db.collection('aiUsage').doc(`minute_${feature}`);
  const globalMonthRef = db.collection('aiUsage').doc(`month_${monthKey}`);

  await db.runTransaction(async (transaction) => {
    const [userWeekSnap, globalMinuteSnap, globalMonthSnap] = await Promise.all([
      transaction.get(userWeekRef),
      transaction.get(globalMinuteRef),
      transaction.get(globalMonthRef),
    ]);
    const result = evaluateAiUsageLimit({
      config,
      globalMinute: globalMinuteSnap.exists ? globalMinuteSnap.data() : {},
      globalMonth: globalMonthSnap.exists ? globalMonthSnap.data() : {},
      nowMs,
      userWeek: userWeekSnap.exists ? userWeekSnap.data() : {},
    });

    if (!result.allowed) {
      throw throwRateLimitError(result);
    }

    transaction.set(userWeekRef, {
      ...result.nextUserWeek,
      featureCounts: {
        [feature]: FieldValue.increment(1),
      },
      periodKey: weekKey,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    transaction.set(globalMinuteRef, {
      ...result.nextGlobalMinute,
      feature,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: false });
  });

  return {
    monthKey,
    weekKey,
  };
}

async function recordAiUsageResult({
  admin,
  db,
  estimatedCostUsd = 0,
  feature,
  model,
  monthKey,
  provider,
  requestId,
  uid,
  usage = {},
}) {
  const FieldValue = admin.firestore.FieldValue;
  const globalMonthRef = db.collection('aiUsage').doc(`month_${monthKey}`);
  const userMonthRef = db.collection('users').doc(uid).collection('aiUsage').doc(`month_${monthKey}`);
  const patch = {
    estimatedCostUsd: FieldValue.increment(estimatedCostUsd),
    featureCounts: {
      [feature]: FieldValue.increment(1),
    },
    requestCount: FieldValue.increment(1),
    totalTokens: FieldValue.increment(normalizeCount(usage.totalTokens)),
    promptTokens: FieldValue.increment(normalizeCount(usage.promptTokens)),
    completionTokens: FieldValue.increment(normalizeCount(usage.completionTokens)),
    lastModel: model,
    lastProvider: provider,
    lastRequestId: requestId,
    periodKey: monthKey,
    updatedAt: FieldValue.serverTimestamp(),
  };

  await Promise.all([
    globalMonthRef.set(patch, { merge: true }),
    userMonthRef.set(patch, { merge: true }),
  ]);
}

module.exports = {
  assertAiUsageAllowed,
  evaluateAiUsageLimit,
  recordAiUsageResult,
};
