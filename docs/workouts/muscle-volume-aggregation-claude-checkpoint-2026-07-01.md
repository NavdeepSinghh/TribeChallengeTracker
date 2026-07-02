# Claude Checkpoint 19: Muscle Volume Aggregation

Status date: 2026-07-01
Verdict requested: backend trust + privacy review
Scope: owner-only weekly muscle volume aggregate foundation for Phase 3 heat maps.

Claude first-pass verdict: `APPROVED WITH ONE FIX AND ONE STRONG RECOMMENDATION`.

Applied before re-review:

- Removed raw session ID references from owner-readable aggregate documents.
- Removed per-muscle `sessionIds`.
- Removed top-level `sourceSessionIds`.
- Kept aggregate documents summary-only: counts, exercise IDs, volume, set totals, insufficient-data flag.
- Documented future public heat-map UI gates below.

Claude re-review verdict: `APPROVED`. CP19 is clean and CP20 may proceed under the same vote-independent backend-prep boundary.

## Requested Verdict

Please return one of:

- APPROVED
- APPROVED WITH FIXES
- BLOCKED
- REVIEW INCONCLUSIVE

## Context

Checkpoint 18 defined Phase 3 vote options and metric thresholds. This checkpoint implements the first backend foundation for the `muscle_volume_heat_map` option without shipping the UI yet.

The implementation keeps detailed training sessions private and writes only owner-readable weekly aggregates.

## What Changed

- Added pure Cloud Function aggregation helpers.
- Added `syncWorkoutInsightAggregates` callable export in `australia-southeast1`.
- Added owner-readable/admin-writable Firestore rules for `users/{uid}/workoutInsightAggregates/{aggregateId}`.
- Added account deletion cleanup for `workoutInsightAggregates`.
- Added focused tests for:
  - deterministic weekly aggregate ID
  - completed-session filtering
  - target-week filtering
  - set volume by muscle group
  - insufficient-data threshold
  - rule/function/deletion contract

## Key Files

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/functions/workoutInsightAggregationHandlers.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/functions/index.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/functions/accountDeletionCallableHandlers.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/firestore.rules
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/__tests__/workoutInsightAggregation.test.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/domain/workoutInsightMetrics.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/__tests__/workoutAdvancedMetricsPlan.test.js
```

## Aggregate Shape

Collection:

```text
users/{uid}/workoutInsightAggregates/{aggregateId}
```

Weekly aggregate ID:

```text
weekly_YYYY-Www
```

Example fields:

```js
{
  id: "weekly_2026-W27",
  uid: "user_123",
  periodType: "week",
  periodKey: "2026-W27",
  metricVersion: 1,
  sessionCount: 3,
  setCount: 18,
  exerciseCount: 5,
  totalVolumeKg: 4200,
  minimumSessionCount: 3,
  insufficientData: false,
  muscles: {
    chest: {
      muscle: "chest",
      volumeKg: 1200,
      setCount: 6,
      exerciseIds: ["bench_press"]
    }
  },
  updatedAt: serverTimestamp()
}
```

## Volume Calculation Decision

When an exercise has multiple primary muscles, set volume is split evenly across those primary muscles.

Reason:

- Avoids massively inflating total volume when one exercise lists multiple primary muscles.
- Keeps weekly totals easier to explain.
- Still lets each primary muscle receive credit.

Example:

```text
Bench Press, 980 kg total set volume, primary muscles chest + triceps
→ chest 490 kg, triceps 490 kg
```

## Trust And Privacy Model

- `trainingSessions` remain private detailed logs.
- Aggregates are stored under the user's own document.
- Owner can read their own aggregate.
- Admin can read/write for support/backfill.
- Normal clients cannot write aggregates.
- Cloud Function writes with Admin SDK.
- Account deletion removes aggregate docs.
- No public share card is created in this checkpoint.
- Aggregates are summary-only and do not expose raw session document IDs.

## Callable

Callable:

```text
syncWorkoutInsightAggregates
```

Region:

```text
australia-southeast1
```

Input:

```js
{
  weekKey: "2026-W27" // optional
}
```

Output:

```js
{
  aggregateId: "weekly_2026-W27",
  periodKey: "2026-W27",
  sessionCount: 3,
  insufficientData: false
}
```

## Verification

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTracker
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/workoutInsightAggregation.test.js src/__tests__/workoutAdvancedMetricsPlan.test.js --watchAll=false --runInBand
```

Result:

```text
PASS, 11 tests.
```

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTracker
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run build
```

Result:

```text
Compiled successfully.
```

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTracker
git diff --check
```

Result: passed.

## Known Gaps

Blockers for this checkpoint:

- None known from local verification.

2026-07-02 update:

- `syncWorkoutInsightAggregates` is deployed to `australia-southeast1`.
- Firestore emulator allow/deny tests now cover owner/admin reads and writes for `workoutInsightAggregates`.
- Signed-in production smoke passed with temporary workout history, and smoke-only data was cleaned after verification.

Non-blocking gaps:

- No scheduled backfill is implemented yet.
- No heat map UI is implemented yet.
- Server-side rate limiting should be added before exposing a broad user-triggered sync button.

## Future Public Heat-Map UI Gates

These do not block CP19 because this checkpoint is backend preparation only, but they must be resolved before any user-facing heat-map UI ships:

- Keep aggregate documents summary-only; do not reintroduce raw session IDs unless a concrete user-facing requirement is approved.
- Document scheduled backfill behavior for users with existing training history.
- Add server-side rate limiting for any user-invocable aggregate sync.

## Specific Questions For Claude

1. Is owner-only `workoutInsightAggregates` the right collection shape?
2. Should volume be split across primary muscles or credited in full to each primary muscle?
3. Is removing raw session IDs from owner-only aggregates enough for the minimization concern?
4. Is a callable sync enough for this checkpoint, or should scheduled backfill be required now?
5. Any privacy concerns before a heat map UI is built on top of this aggregate?
