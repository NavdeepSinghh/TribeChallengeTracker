# Claude Checkpoint: Plan Customization + Progress Native Parity

Status date: 2026-07-01
Verdict requested: architecture + parity review
Scope: iOS and Android parity for Checkpoints 15 and 16 after the Web/server implementation.

## Requested Verdict

Please return one of:

- APPROVED
- APPROVED WITH FIXES
- BLOCKED
- REVIEW INCONCLUSIVE

## Context

Claude has not yet reviewed these newer checkpoints:

- Checkpoint 14: Today Tab Training Plan Integration
- Checkpoint 15: Plan Customization And Substitutions
- Checkpoint 16: Plan Badges And Adherence

This checkpoint focuses only on native parity for the Checkpoint 15 and 16 surfaces:

- plan frequency adjustment
- skip today's plan day
- enrollment customization fields
- adherence summary
- badge progress display

It builds on the earlier Training Plan Native Parity checkpoint, which introduced base iOS/Android plan browsing and enrollment.

## What Changed

### iOS

- Added `customFrequencyDaysPerWeek` and `exerciseSwaps` to `TrainingPlanEnrollment`.
- Added pure-domain helpers for:
  - skipped-day enrollment patching
  - frequency adjustment patching
  - adherence summary calculation
  - badge progress calculation
- Added `saveEnrollmentPatch(planId:patch:)` to the repository protocol and Firestore implementation.
- Added `SkipTrainingPlanDayUseCase` and `AdjustTrainingPlanFrequencyUseCase`.
- Added ViewModel actions:
  - `skipTodayPlanDay()`
  - `adjustFrequency(_:)`
- Added plan progress and customization panels to the SwiftUI plan detail surface.
- Extended `TrainingPlanTests` with customization and progress assertions.

### Android

- Added `customFrequencyDaysPerWeek` and `exerciseSwaps` to `TrainingPlanEnrollment`.
- Added pure-domain helpers matching iOS/Web behavior for skipped days, frequency, adherence, and badge progress.
- Added `saveEnrollmentPatch(planId, patch)` to the repository contract and Firestore implementation.
- Added `SkipTrainingPlanDayUseCase` and `AdjustTrainingPlanFrequencyUseCase`.
- Added ViewModel actions:
  - `skipTodayPlanDay()`
  - `adjustFrequency(daysPerWeek)`
- Added plan progress and customization panels to the Compose plan detail surface.
- Extended `TrainingPlanTest` with customization and progress assertions.

## Key Files

### iOS

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/TrainingPlanModels.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/TrainingPlanUseCases.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/FirestoreTrainingPlanRepository.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/TrainingPlanViewModel.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Views/TrainingPlansSection.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeLogTests/TrainingPlanTests.swift
```

### Android

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/TrainingPlanModels.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/TrainingPlanUseCases.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/data/FirestoreTrainingPlanRepository.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/TrainingPlanViewModel.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/TrainingPlansSection.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/test/java/com/risewiththetribe/challengetracker/workouts/TrainingPlanTest.kt
```

### Web/Server Checkpoints This Mirrors

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/plan-customization-substitutions-claude-checkpoint-2026-07-01.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/plan-badges-adherence-claude-checkpoint-2026-07-01.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/domain/trainingPlanModels.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/domain/trainingPlanUseCases.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/presentation/TrainingPlansSection.jsx
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/functions/trainingPlanProgressCallableHandlers.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/functions/workoutSessionCallableHandlers.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/firestore.rules
```

## Architecture Review Notes

### iOS

- `TrainingPlanModels.swift` remains Foundation-only.
- `TrainingPlanUseCases.swift` owns the repository protocol and pure use cases.
- `FirestoreTrainingPlanRepository.swift` is the Firebase SDK boundary.
- `TrainingPlanViewModel.swift` imports Foundation only and depends on use cases.
- `TrainingPlansSection.swift` is SwiftUI-only presentation.

### Android

- `TrainingPlanModels.kt` and `TrainingPlanUseCases.kt` remain pure Kotlin/domain.
- `FirestoreTrainingPlanRepository.kt` is the Firebase SDK boundary.
- `TrainingPlanViewModel.kt` exposes state and depends on use cases.
- `TrainingPlansSection.kt` is Compose presentation.

## Verification

### Web/Server Verification Already Run For Checkpoints 15 And 16

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTracker
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/trainingPlansFoundation.test.js src/__tests__/todayTrainingPlanCard.test.js --watchAll=false --runInBand
```

Result: `PASS`, 15 tests.

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTracker
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/trainingPlanProgress.test.js src/__tests__/trainingPlansFoundation.test.js src/__tests__/todayTrainingPlanCard.test.js --watchAll=false --runInBand
```

Result: `PASS`, 20 tests.

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTracker
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run build
```

Result: passed.

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTracker
git diff --check
```

Result: passed.

### iOS Verification

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS
xcodebuild test -quiet -project /Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge.xcodeproj -scheme TribeLog -destination 'id=D923D710-E371-406A-9950-A34017DF4AF2' -only-testing:TribeLogTests/TrainingPlanTests
```

Result: passed.

Notes:

- Initial run found a real compile issue: assigning to computed `selectedEnrollment` / `todayPlanDay`. Fixed by only updating the stored enrollment list and letting computed properties refresh naturally.
- Second run found a test typo: Kotlin-style `error?.let { throw it }` in Swift. Fixed to `if let error { throw error }`.
- Final run exited `0`.

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS
git diff --check
```

Result: passed.

### Android Verification

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew :app:testDebugUnitTest --tests 'com.risewiththetribe.challengetracker.workouts.TrainingPlanTest'
```

Result: `BUILD SUCCESSFUL`.

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew :app:assembleDebug
```

Result: `BUILD SUCCESSFUL`.

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid
git diff --check
```

Result: passed.

## Security And Trust Notes

- Native clients still patch enrollment customization fields directly through owner-scoped Firestore rules.
- Server-trusted plan completion, adherence, and plan badges are handled by the `finishWorkoutSession` path from Checkpoint 16.
- Native UI displays local/domain adherence snapshots and badge progress; it does not award trusted badges directly.
- `completedDayKeys` remains server-owned in the hardened Firestore rules from Checkpoint 16.

## Known Gaps

Blockers for Claude to decide:

- None known from local verification.

Non-blocking gaps:

- Native parity currently covers skip day, frequency adjustment, adherence display, and badge progress display.
- Full mid-workout substitution picker is not implemented on native in this checkpoint. The data model and repository fields are ready, but the actual exercise picker interaction should be reviewed as a later UX checkpoint.
- Live native screenshots were not captured for this checkpoint.
- `syncTrainingPlanProgress` callable still needs deployment/signed-in smoke before release if Claude approves the Checkpoint 16 server path.

## Specific Questions For Claude

1. Does this preserve the Clean Architecture boundary on iOS and Android?
2. Is it acceptable that native clients patch skip/frequency customization directly while completed days and badges remain server-trusted?
3. Is the native scope enough for parity with Web Checkpoints 15 and 16, or should substitution picker UI be required before proceeding?
4. Are the progress panel and badge-progress surfaces enough for first Training Plans launch?
5. Any release blockers before moving to the next checkpoint?
