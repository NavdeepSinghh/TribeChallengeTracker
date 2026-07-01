# Milestone 2 Execution Log

## Status

Implemented.

## Plan-To-Code Mapping

| Acceptance Criterion | Implementation Files |
|---|---|
| Admin-only seed/update utility | `scripts/seed-workout-exercise-catalog.js` |
| Required-field validation | `scripts/seed-workout-exercise-catalog.js` |
| Asset manifest validation | `scripts/seed-workout-exercise-catalog.js` |
| Initial proof exercise records | `scripts/workout-exercise-seed.json` |
| Direct `publicWorkouts` write defense | `firestore.rules` |
| Feed/activity point consistency | `functions/workoutSessionCallableHandlers.js` |
| Milestone 8 rules-unit-testing gate | `docs/workouts/PHASE_1_PLAN.md` |
| Focused tests | `src/__tests__/workoutsBackendFoundation.test.js` |

## What Changed

### Seed Utility

The seed script now supports:

- `--apply`
- `--admin-uid <uid>`
- `--file <path>`
- dry-run validation by default
- admin document verification before live writes
- asset storage path convention validation
- positive integer `version` and `assetVersion` validation
- `updatedBy` stamping

### Public Workout Direct Write Defense

`publicWorkouts` create/update now requires:

```text
exists(/databases/$(database)/documents/users/$(request.auth.uid)/trainingSessions/$(request.resource.data.sourceSessionId))
```

This prevents a direct client write from publishing a workout that does not mirror a real session owned by that user.

### Points Consistency

`sanitizeFinalSession` preserves positive `finalSession.points`. Both activity log entries and Tribe feed entries now use the same `workoutPoints(session)` helper.

### Rules Unit Testing Gate

`docs/workouts/PHASE_1_PLAN.md` now requires `@firebase/rules-unit-testing` emulator allow/deny coverage before Milestone 8 social sharing UI launch.

## Operational Note

The proof seed records were validated locally but not written to live Firestore in this pass. Live apply intentionally requires explicit admin UID and local Firebase Admin credentials.

## Deviations

None from Milestone 2 scope.

