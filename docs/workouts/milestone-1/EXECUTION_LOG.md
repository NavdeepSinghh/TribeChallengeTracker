# Milestone 1 Execution Log

## Status

Implemented.

## Plan-To-Code Mapping

| Acceptance Criterion | Implementation Files |
|---|---|
| Firestore rules for catalog/templates/public workouts/PRs | `firestore.rules` |
| Deterministic finish IDs | `functions/workoutSessionCallableHandlers.js` |
| Server-side PR calculation foundation | `functions/workoutSessionCallableHandlers.js` |
| Block-list enforcement for `publicWorkouts` reads | `firestore.rules` |
| Composite index choices | `firestore.indexes.json` |
| Focused tests | `src/__tests__/workoutsBackendFoundation.test.js` |
| Dry-run official exercise seed path | `scripts/seed-workout-exercise-catalog.js`, `scripts/workout-exercise-seed.json` |

## Files Changed

- `firestore.rules`
- `firestore.indexes.json`
- `functions/index.js`
- `functions/workoutSessionCallableHandlers.js`
- `scripts/seed-workout-exercise-catalog.js`
- `scripts/workout-exercise-seed.json`
- `src/__tests__/workoutsBackendFoundation.test.js`
- `docs/workouts/milestone-1/EXECUTION_PLAN.md`
- `docs/workouts/milestone-1/EXECUTION_LOG.md`
- `docs/workouts/milestone-1/TEST_REPORT.md`
- `docs/workouts/milestone-1/ARCHITECTURE_REVIEW.md`
- `docs/workouts/milestone-1/BRAND_AUDIT.md`
- `docs/workouts/milestone-1/KNOWN_GAPS.md`

## What Was Built

### Firestore Rules

- Added reusable helper functions for signed-in checks, follower checks, bidirectional block checks, and workout owner validation.
- Added `users/{uid}/exercisePRs/{exerciseId}` with owner/admin reads and admin-only client writes. Cloud Functions write through Admin SDK.
- Added `exerciseCatalog/{exerciseId}` with signed-in reads for published records and admin-only writes.
- Added `workoutTemplates/{templateId}` with system, owner, public, and tribe/follower visibility.
- Added `publicWorkouts/{publicWorkoutId}` with public/tribe visibility and rule-level bidirectional block enforcement.
- Tightened `publicRoutines` read behavior to also respect bidirectional block checks.

### Firestore Indexes

Added composite indexes for:

- published exercise catalog browsing by name
- exercise level filtering
- muscle group filtering
- equipment filtering
- template status/visibility lists
- owner template lists
- public workout discovery
- owner public workout lists

### Cloud Function Foundation

Added callable export:

```text
finishWorkoutSession
region: australia-southeast1
```

The handler:

- validates auth
- sanitizes the final session payload
- computes deterministic `activityLogId`, `feedId`, and `publicWorkoutId`
- writes the private session
- replaces the deterministic activity-log entry
- writes the deterministic feed entry
- publishes or deletes deterministic public workout mirror based on visibility
- computes trusted PR updates in the transaction

### Seed Path

Added a dry-run-first seed script for proof exercise catalog records:

```bash
node scripts/seed-workout-exercise-catalog.js
node scripts/seed-workout-exercise-catalog.js --apply
```

Default mode validates only. `--apply` writes to Firestore using Firebase Admin credentials.

## Deviations

None from the approved Milestone 1 scope.

Implementation note: full emulator security tests were not added because the repo does not currently include `@firebase/rules-unit-testing`. Instead, Milestone 1 includes:

- Firestore emulator parse validation.
- Static rules contract tests for the required block-list and visibility clauses.
- Callable helper tests for deterministic retry behavior and PR calculation.

Full emulator allow/deny tests should be added before broad public-workout rollout if the team wants rule execution tests in CI.

## Open Questions

- Should `publicRoutines` keep the existing `followers` visibility string long-term, or migrate to the new `tribe` visibility string used by Workouts? Milestone 1 preserves existing `followers` for routines and uses `tribe` for new `publicWorkouts`.
