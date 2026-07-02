const {
  GLOBAL_SYNC_MAX_REQUESTS,
  GLOBAL_SYNC_WINDOW_MS,
  USER_SYNC_COOLDOWN_MS,
  cleanRateLimitKey,
  evaluateWorkoutInsightRateLimit,
} = require('../../functions/workoutInsightRateLimit');

describe('workout insight sync rate limits', () => {
  it('allows the first request and initializes user/global counters', () => {
    const result = evaluateWorkoutInsightRateLimit({ nowMs: 1000 });

    expect(result).toMatchObject({
      allowed: true,
      nextUserLimit: { lastSyncAtMs: 1000 },
      nextGlobalLimit: { requestCount: 1, windowStartMs: 1000 },
    });
  });

  it('blocks repeated user-triggered sync during cooldown', () => {
    const result = evaluateWorkoutInsightRateLimit({
      nowMs: 30 * 1000,
      userLimit: { lastSyncAtMs: 1000 },
    });

    expect(result).toMatchObject({
      allowed: false,
      reason: 'user_cooldown',
      retryAfterSeconds: 31,
    });
  });

  it('allows a user after the cooldown window', () => {
    const result = evaluateWorkoutInsightRateLimit({
      nowMs: 1000 + USER_SYNC_COOLDOWN_MS,
      userLimit: { lastSyncAtMs: 1000 },
    });

    expect(result.allowed).toBe(true);
  });

  it('blocks when the global rolling window is exhausted', () => {
    const result = evaluateWorkoutInsightRateLimit({
      globalLimit: {
        requestCount: GLOBAL_SYNC_MAX_REQUESTS,
        windowStartMs: 5000,
      },
      nowMs: 5000 + 20 * 1000,
      userLimit: { lastSyncAtMs: 0 },
    });

    expect(result).toMatchObject({
      allowed: false,
      reason: 'global_window',
      retryAfterSeconds: 40,
    });
  });

  it('resets the global window after expiry', () => {
    const result = evaluateWorkoutInsightRateLimit({
      globalLimit: {
        requestCount: GLOBAL_SYNC_MAX_REQUESTS,
        windowStartMs: 5000,
      },
      nowMs: 5000 + GLOBAL_SYNC_WINDOW_MS,
    });

    expect(result).toMatchObject({
      allowed: true,
      nextGlobalLimit: {
        requestCount: 1,
        windowStartMs: 5000 + GLOBAL_SYNC_WINDOW_MS,
      },
    });
  });

  it('cleans function names for stable rate limit docs', () => {
    expect(cleanRateLimitKey(' sync Workout Insight Aggregates!! ')).toBe('sync_workout_insight_aggregates');
  });
});
