# Claude Checkpoint: Plan Badges And Adherence

Status date: 2026-07-01
Checkpoint: 16
Scope: Server-trusted training plan progress, adherence dashboard, and plan badge foundation
Verdict requested: Trust-boundary and product-copy review before native parity / release pack

## Summary

This checkpoint adds the trusted backend foundation for training plan adherence and plan badges, plus a Web progress panel inside the plan detail view.

The important architecture decision: plan preferences remain private user-owned enrollment state, but completed plan days, adherence summaries, and plan badges are now written by Cloud Functions/Admin SDK paths, not by direct client writes.

## What Changed

### Cloud Functions

Added:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/functions/trainingPlanProgressCallableHandlers.js
```

Exports:

- `syncTrainingPlanProgress`
- `buildTrainingPlanAdherenceSummary`
- `trainingPlanBadgeAwards`
- `buildCompletedPlanDayPatch`
- `trainingPlanBadgeDocId`
- `dayKeysDueThroughToday`
- `totalPlanWorkoutDays`

New callable:

```text
syncTrainingPlanProgress
```

Region:

```text
australia-southeast1
```

It reads:

```text
trainingPlans/{planId}
users/{uid}/trainingPlanEnrollments/{planId}
```

It writes:

```text
users/{uid}/trainingPlanAdherence/{planId}
users/{uid}/trainingPlanBadges/{planId}_{badgeId}
```

### Guided Workout Finish Integration

`finishWorkoutSession` now preserves optional training plan metadata:

- `trainingPlanId`
- `trainingPlanDayKey`
- `trainingPlanWeekIndex`
- `trainingPlanDayIndex`

If a completed guided workout includes `trainingPlanId` and `trainingPlanDayKey`, the same transaction:

- writes the completed workout session
- writes activity/feed/PR mirrors as before
- marks that plan day completed on the enrollment
- removes that same day from skipped state
- updates trusted adherence summary
- writes deterministic plan badge docs

Normal non-plan guided workouts are unchanged.

### Firestore Rules

Updated training plan enrollment rules so clients cannot directly mutate `completedDayKeys`.

Clients can still manage private preference state:

- `status`
- `skippedDayKeys`
- `customFrequencyDaysPerWeek`
- `exerciseSwaps`
- `currentDayIndex`

Trusted collections added:

```text
users/{uid}/trainingPlanAdherence/{planId}
users/{uid}/trainingPlanBadges/{badgeId}
```

Rules:

- Owner/admin can read.
- Only admin/Cloud Functions can write.

### Web UI

Added `PLAN PROGRESS` inside selected plan detail.

Shows:

- Completed plan workouts.
- Due workouts.
- Flow/adherence percentage.
- Supportive comeback copy if sessions are waiting.
- Plan badge progress for:
  - Plan Starter
  - Week One Locked
  - Plan Finisher

Copy explicitly avoids shame language:

```text
{n} plan sessions waiting. Pick one back up when you are ready.
```

## Files Changed

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/functions/index.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/functions/trainingPlanProgressCallableHandlers.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/functions/workoutSessionCallableHandlers.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/firestore.rules
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/domain/trainingPlanModels.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/presentation/TrainingPlansSection.jsx
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/__tests__/trainingPlanProgress.test.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/__tests__/trainingPlansFoundation.test.js
```

## Architecture Review

| Area | Decision | Status |
|---|---|---|
| Badge awards | Server/Admin SDK writes deterministic docs | Pass |
| Adherence summary | Server/Admin SDK writes trusted summary | Pass |
| Plan preferences | User-owned private enrollment state | Pass |
| Firestore rules | Clients cannot write `completedDayKeys` after create | Pass |
| UI copy | Comeback framing, no shame/dark patterns | Pass |

## Verification

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/trainingPlanProgress.test.js src/__tests__/trainingPlansFoundation.test.js src/__tests__/todayTrainingPlanCard.test.js --watchAll=false --runInBand
```

Result:

```text
PASS src/__tests__/trainingPlanProgress.test.js
PASS src/__tests__/todayTrainingPlanCard.test.js
PASS src/__tests__/trainingPlansFoundation.test.js
Test Suites: 3 passed, 3 total
Tests: 20 passed, 20 total
```

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run build
```

Result:

```text
Compiled successfully.
```

```text
git diff --check
```

Result: no whitespace errors.

## Test Coverage Added

- Adherence summary derives due, completed, skipped, missed, and percent values.
- Plan badge awards are deterministic and threshold-based.
- Completed day patch removes skip state for the same day.
- Sanitized guided sessions preserve training plan metadata.
- Rules expose trusted plan badge/adherence paths and callable export is present.
- Web plan detail renders the progress panel and plan badge progress.

## Known Gaps

- Web UI only for the dashboard in this checkpoint. Native parity should follow once Claude approves the trust model.
- `syncTrainingPlanProgress` is wired but not deployed in this side checkpoint.
- Real end-to-end signed-in smoke with a plan-tagged guided workout remains pending.
- The existing general `earnedBadges` collection remains owner-writable from older app behavior. This checkpoint intentionally uses a new trusted `trainingPlanBadges` collection instead of expanding that legacy surface.

## Questions For Claude

1. Is the trusted separation acceptable: private preferences client-owned, completed plan days and plan badges function/admin-written?
2. Should `finishWorkoutSession` be the only trusted path for completing a plan day, or is the additional `syncTrainingPlanProgress` callable useful as a repair/recompute path?
3. Are the three plan badges enough for Phase 2: Plan Starter, Week One Locked, Plan Finisher?
4. Is the adherence copy supportive enough and free of shame/dark-pattern pressure?
5. Any issue with tightening rules so clients cannot directly mutate `completedDayKeys`?
