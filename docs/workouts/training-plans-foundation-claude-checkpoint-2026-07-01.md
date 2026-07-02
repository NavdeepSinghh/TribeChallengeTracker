# TribeLog Training Plans Foundation Checkpoint

Status date: 2026-07-01
Owner: Navdeep
Implementation: Codex
Review partner: Claude

## Verdict Request

Please review this as Checkpoint 11: backend-driven Training Plans foundation.

This checkpoint does not enroll users into plans yet. It creates the safe content foundation:

- official plan seed data
- validation/apply tooling
- Firestore read/write rules
- indexes
- Web Clean Architecture slice
- read-only Workouts tab surface
- tests and dry-run verification

No live Firestore writes were applied.

## Product Goal

Phase 2 moves Workouts from "start any workout" toward "open the app and know what to do today."

This checkpoint adds official plans as backend-driven content while keeping the product promise:

- free for users
- no medical or guaranteed outcome claims
- no hardcoded plan content as the source of truth
- admin-authored first, community/coach sources reserved for later checkpoints

## What Changed

### Seed Data

Added three official plans:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/workout-training-plans-seed.json
```

Plans:

1. `beginner_strength_foundation`
2. `upper_lower_strength_builder`
3. `run_walk_base_builder`

All plan exercises reference the approved 50-exercise library from Phase 1 batch seed files.

### Validation And Apply Tooling

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/validate-workout-training-plans.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/apply-workout-training-plans.js
```

Validation covers:

- snake_case ids
- kebab-case slugs
- enum validation for status/source/visibility/goal/level/day type
- plan duration/frequency/session length ranges
- every `exerciseId` must exist in the approved 50
- no unsupported medical/health claim language
- no apply without `--apply --admin-uid`
- apply mode verifies `/admins/{uid}` before writing

### Firestore Rules And Indexes

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/firestore.rules
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/firestore.indexes.json
```

Rules:

- signed-in users can read only `published` + `public` plans
- admins can read/write/delete
- write validation requires known enums and sane basic shape

Indexes:

- `status + visibility + updatedAt`
- `status + goal + level`

### Web Domain/Data/Presentation

Domain:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/domain/trainingPlanModels.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/domain/trainingPlanUseCases.js
```

Data:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/data/firestoreTrainingPlanRepository.js
```

Presentation:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/presentation/useTrainingPlansViewModel.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/presentation/TrainingPlansSection.jsx
```

Composition and app wiring:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/workoutTrainingPlanComposition.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/app/BoardTab.jsx
```

Architecture shape:

```text
BoardTab
  -> TrainingPlansSection
  -> useTrainingPlansViewModel
  -> LoadTrainingPlansUseCase / GetTrainingPlanFilterOptionsUseCase
  -> FirestoreTrainingPlanRepository
  -> trainingPlans collection
```

The ViewModel has no Firestore imports. Domain has no Firebase/UI imports. Firestore is isolated to the data repository.

## Verification

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/validate-workout-training-plans.js
```

Result:

```text
Validated 3 official workout training plans.
- beginner_strength_foundation: 3 days/week, 4 weeks, 3 workouts
- upper_lower_strength_builder: 4 days/week, 6 weeks, 4 workouts
- run_walk_base_builder: 4 days/week, 4 weeks, 4 workouts
```

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/apply-workout-training-plans.js
```

Result:

```text
Validated 3 official workout training plans. Use --apply to write to Firestore.
Apply mode requires --admin-uid <uid> and verifies that uid exists in /admins.
```

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/trainingPlansFoundation.test.js --watchAll=false --runInBand
```

Result:

```text
PASS, 6 tests
```

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/workoutsWebLibrary.test.js --watchAll=false --runInBand
```

Result:

```text
PASS, 10 tests
```

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run build
```

Result:

```text
Compiled successfully.
```

## Claude Review Questions

1. Is the Training Plan schema sufficient for read-only official plans before enrollment?
2. Are the validation guardrails enough before Navdeep runs live apply?
3. Are the Firestore rules strict enough for this checkpoint?
4. Does the Web slice preserve MVVM + Clean Architecture boundaries?
5. Is the Workouts tab placement correct, or should Training Plans sit above Guided Workout?

## Known Gaps

- No iOS/Android Training Plans surface yet.
- No plan enrollment or "today's workout" calculation yet.
- No user customization, skip days, substitutions, or adherence dashboard yet.
- No live Firestore apply was run.
- No emulator allow/deny tests for `trainingPlans` yet. Current tests statically check rules/index declarations only.

## Recommended Next Checkpoint

Checkpoint 12: Training Plan Enrollment Foundation.

Scope:

- user-owned `users/{uid}/trainingPlanEnrollments/{planId}` documents
- enrollment/unenrollment callable or client-owned safe write model
- "today's workout" selector derived from enrollment start date
- Web read/write enrollment UI
- native parity plan after Web review
