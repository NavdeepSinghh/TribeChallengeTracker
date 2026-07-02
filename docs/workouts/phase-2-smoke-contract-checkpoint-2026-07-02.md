# Phase 2 Smoke Contract Checkpoint

Date: 2026-07-02

## Review Request

Please review the local smoke-contract coverage added for Phase 2 Training Plans launch readiness.

This checkpoint does not claim the production smoke test is complete. It proves the trusted backend contract locally before Navdeep runs the signed-in production smoke.

## New Test

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/__tests__/trainingPlanFinishSmoke.test.js
```

## New Command

```bash
npm run workouts:phase2:smoke-contract
npm run workouts:phase2:plans:validate
npm run workouts:phase2:plans:dry-run
npm run workouts:phase2:release-check
```

## What The Test Covers

The test calls the real `finishWorkoutSession` handler with:

- authenticated user
- planned workout metadata:
  - `trainingPlanId`
  - `trainingPlanDayKey`
  - `trainingPlanWeekIndex`
  - `trainingPlanDayIndex`
- private workout visibility
- completed exercise sets

It uses an in-memory Firestore/Admin mock and verifies:

- `completedDayKeys` adds the completed plan day.
- the same day is removed from `skippedDayKeys`.
- `trainingPlanAdherence` is written by the trusted function path.
- the first plan badge is awarded.
- activity log entry is written with deterministic ID.
- tribe feed mirror is written with deterministic ID.
- retrying the same finish payload does not duplicate the activity entry.
- no public workout is created for private visibility.

## Why This Matters

Claude's Phase 2 launch blocker requires a signed-in production smoke test. This local contract test makes that production run safer and more meaningful by proving the trusted handler behavior before touching live data.

## Verification

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run workouts:phase2:smoke-contract
```

Result:

```text
PASS src/__tests__/trainingPlanFinishSmoke.test.js
PASS src/__tests__/trainingPlanProgress.test.js

Test Suites: 2 passed, 2 total
Tests: 6 passed, 6 total
```

Additional seed-path verification:

```text
workouts:phase2:plans:validate: PASS, 3 official plans
workouts:phase2:plans:dry-run: PASS, validates 3 official plans and does not write without --apply
workouts:phase2:release-check: PASS, 26 total test assertions across smoke contract, plan foundation, and Today card tests
```

## Still Pending

- Signed-in production smoke test with a real/admin account.
- Production verification that the client refresh shows the badge/progress card.
- Real iPhone screenshots for Today active plan, customization panel, and badge/progress state.
- Android screenshots when a paired Android device is available.

## Claude Review Questions

1. Does this test cover the right pre-production contract for Phase 2 launch readiness?
2. Is the fake Firestore/Admin harness acceptable for local contract coverage?
3. Should any additional trusted write be asserted before the production smoke?
4. Does the checkpoint make clear that production smoke remains required?
