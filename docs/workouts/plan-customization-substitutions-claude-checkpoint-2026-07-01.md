# Claude Checkpoint: Plan Customization And Substitutions

Status date: 2026-07-01
Checkpoint: 15
Scope: Web foundation for user-owned plan customization and safe substitution logic
Verdict requested: Architecture and product review before native parity / guided-session substitution UI

## Summary

This checkpoint adds the first customization layer for enrolled training plans. Users can adjust plan frequency and skip today's plan day from the Web training plan detail panel. The implementation keeps official TribeLog plan templates immutable and stores customization state only on the user's enrollment document.

It also adds domain-level exercise swap and substitution helpers so the guided workout flow can later offer compatible replacements without mutating the official plan.

## What Changed

### Domain

- Added enrollment customization fields:
  - `customFrequencyDaysPerWeek`
  - `exerciseSwaps`
- Added helpers:
  - `buildSkippedTrainingPlanDayEnrollment`
  - `buildTrainingPlanFrequencyAdjustment`
  - `trainingPlanExerciseSwapKey`
  - `buildTrainingPlanExerciseSwap`
  - `applyTrainingPlanExerciseSwaps`
  - `recommendExerciseSubstitutions`

Substitution recommendations are conservative:

- Candidate must be same movement pattern or overlap primary muscles.
- Candidate cannot be more than one level above the original exercise.
- If the original exercise has equipment, the candidate must share equipment or be bodyweight.
- Missing/unknown candidate equipment is not recommended as a replacement for equipment-based exercises.

### Use Cases

Added use cases:

- `SkipTrainingPlanDayUseCase`
- `AdjustTrainingPlanFrequencyUseCase`
- `SwapTrainingPlanExerciseUseCase`

All three write through repository patch methods. They do not write to official `trainingPlans`.

### Data Layer

Added `saveTrainingPlanEnrollmentPatch(planId, patch)` to `FirestoreTrainingPlanRepository`.

The repository writes only to:

```text
users/{uid}/trainingPlanEnrollments/{planId}
```

It stamps:

- `id`
- `planId`
- `uid`
- `updatedAt`

### Presentation

Added a `CUSTOMIZE YOUR COPY` panel inside the selected training plan detail view.

Current controls:

- Adjust days per week.
- Skip today.
- Disable skip once today's plan day is already skipped or completed.

Copy explicitly says:

```text
Changes apply only to your enrollment. The official TribeLog plan stays unchanged.
```

## Files Changed

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/domain/trainingPlanModels.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/domain/trainingPlanUseCases.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/data/firestoreTrainingPlanRepository.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/workoutTrainingPlanComposition.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/presentation/useTrainingPlansViewModel.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/presentation/TrainingPlansSection.jsx
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/__tests__/trainingPlansFoundation.test.js
```

## Architecture Review

| Layer | Boundary | Status |
|---|---|---|
| Domain | Pure data mapping and customization helpers | Pass |
| Use cases | Own the action semantics and call repository patch boundary | Pass |
| Data | Firestore remains isolated to repository | Pass |
| ViewModel | Depends on use cases only; no Firestore imports | Pass |
| View | Renders controls and invokes ViewModel actions | Pass |

## Verification

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/trainingPlansFoundation.test.js src/__tests__/todayTrainingPlanCard.test.js --watchAll=false --runInBand
```

Result:

```text
PASS src/__tests__/todayTrainingPlanCard.test.js
PASS src/__tests__/trainingPlansFoundation.test.js
Test Suites: 2 passed, 2 total
Tests: 15 passed, 15 total
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

- Skip day removes a completed day key and adds the skipped key.
- Frequency adjustment accepts 1-7 and rejects invalid values.
- Exercise swap keys are deterministic by `dayKey:exerciseId`.
- Applying swaps changes a copied plan-day view without mutating the original plan day.
- Substitution recommendations filter by movement/muscle, level, and equipment compatibility.
- New use cases write narrow enrollment patches.
- Enrolled plan UI renders the customization panel and skip control.

## Known Gaps

- Web only for this checkpoint. iOS/Android parity should follow after Claude approves the model.
- Mid-workout substitution UI is not implemented yet. The safe recommendation engine and swap persistence are ready for it.
- Plan customization is user-owned enrollment state, not a server-trusted badge/adherence path.
- No Cloud Function is introduced here. That is intentional because skipping/frequency/swap are private user preferences, not trusted awards or social/public writes.

## Questions For Claude

1. Is the enrollment-owned customization model acceptable, with official plan templates remaining immutable?
2. Is the `saveTrainingPlanEnrollmentPatch` repository path acceptable for private preference writes, or should any of these actions move server-side before native parity?
3. Is the substitution compatibility rule conservative enough for Phase 2?
4. Is it acceptable that mid-workout substitution UI comes next, using the helpers from this checkpoint?
5. Any copy concerns with "Skip today" or "Customize your copy" from a no-shame/no-dark-patterns standpoint?
