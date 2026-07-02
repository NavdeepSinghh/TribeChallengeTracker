# TribeLog Training Plan Enrollment Foundation Checkpoint

Status date: 2026-07-01
Owner: Navdeep
Implementation: Codex
Review partner: Claude

## Verdict Request

Please review this as Checkpoint 12: Training Plan Enrollment Foundation.

This builds on Checkpoint 11. Official plans remain immutable backend-authored templates. Enrollment is private user-owned state under the signed-in user's document.

No live Firestore rules/index deploy was run from this checkpoint.

## Product Goal

Users should be able to start a plan without changing the official template. The app should then know the user's current plan day so later checkpoints can surface "today's workout" and guide them into a session.

## What Changed

### Domain

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/domain/trainingPlanModels.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/domain/trainingPlanUseCases.js
```

Added:

- `mapTrainingPlanEnrollmentDocument`
- `buildTrainingPlanEnrollment`
- `enrollmentForPlan`
- `selectTodayTrainingPlanWorkout`
- `LoadTrainingPlanEnrollmentsUseCase`
- `EnrollInTrainingPlanUseCase`
- `LeaveTrainingPlanUseCase`
- `SelectTodayTrainingPlanWorkoutUseCase`

The date model is simple and reviewable:

```text
elapsedDays = today - enrollment.startDate
scheduleIndex = elapsedDays % plan.schedule.length
weekIndex = floor(elapsedDays / schedule.length) + 1
dayKey = w{weekIndex}-d{dayIndex}
```

### Data Layer

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/data/firestoreTrainingPlanRepository.js
```

Added:

- `listTrainingPlanEnrollments`
- `saveTrainingPlanEnrollment`
- `leaveTrainingPlan`

Firestore paths:

```text
trainingPlans/{planId}
users/{uid}/trainingPlanEnrollments/{planId}
```

The repository is the only file in this slice that imports Firestore/Auth.

### Presentation

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/presentation/useTrainingPlansViewModel.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/presentation/TrainingPlansSection.jsx
```

The ViewModel now:

- loads public plans and private enrollments together
- computes active enrollment for the selected plan
- computes today's plan day
- exposes `enrollInPlan` and `leavePlan`

The UI now shows:

- Active badge on enrolled plans
- Start plan button
- Leave button
- Started date
- Today's plan day preview

### Rules And Indexes

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/firestore.rules
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/firestore.indexes.json
```

Rules:

- enrollment docs are readable by owner/admin only
- create/update requires `uid == request.auth.uid`
- create/update requires `planId == document id`
- create/update requires the referenced `trainingPlans/{planId}` to exist
- status is limited to `active`, `paused`, `completed`, `left`

Index:

- `trainingPlanEnrollments`: `uid + status + updatedAt`

## Verification

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/trainingPlansFoundation.test.js --watchAll=false --runInBand
```

Result:

```text
PASS, 8 tests
```

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/trainingPlansFoundation.test.js src/__tests__/workoutsWebLibrary.test.js --watchAll=false --runInBand
```

Result:

```text
PASS, 18 tests
```

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run build
```

Result:

```text
Compiled successfully.
```

## Claude Review Questions

1. Is client-owned enrollment state acceptable for Checkpoint 12, or should enrollment be callable-only?
2. Is the `todayWorkout` date math sufficient for v1 before skip/reschedule ships?
3. Should leaving a plan mark status `left` as implemented, or delete the enrollment doc?
4. Are the Firestore rules strict enough for private enrollment state?
5. Should the Start plan control be visible before native parity, or hidden until iOS/Android catch up?

## Known Gaps

- iOS/Android enrollment UI not built yet.
- No plan day completion marking yet.
- No skip/reschedule/customization yet.
- No integration from today's plan day into guided workout start.
- No emulator allow/deny tests for enrollment rules yet.

## Recommended Next Checkpoint

Checkpoint 13: Plan Discovery And Enrollment UI Parity.

Scope:

- iOS Training Plans read-only + enrollment surface
- Android Training Plans read-only + enrollment surface
- Web refinement if Claude requests changes
- real screenshots once native builds run
