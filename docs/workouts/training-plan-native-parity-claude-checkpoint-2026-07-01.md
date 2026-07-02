# Claude Checkpoint 13: Training Plan Native Parity

Status date: 2026-07-01
Verdict requested: architecture + parity review
Scope: iOS and Android Training Plans UI parity for the backend-driven plans/enrollment foundation.

## Summary

Checkpoint 13 brings the Training Plans foundation from Web to native platforms.

Users can now browse official plans, search/filter by goal and level, select a plan, start/leave enrollment, and see today's plan day on iOS and Android. Both implementations follow the existing Workouts Clean Architecture boundary:

- Domain models/use cases contain no Firebase or UI imports.
- Repositories are the only Firebase SDK boundary.
- ViewModels expose observable state and depend on use cases.
- Composition roots wire Firestore repositories to use cases.

## iOS Files

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/TrainingPlanModels.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/TrainingPlanUseCases.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/FirestoreTrainingPlanRepository.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/TrainingPlanViewModel.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/TrainingPlanComposition.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Views/TrainingPlansSection.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Views/LeaderboardView.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeLogTests/TrainingPlanTests.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge.xcodeproj/project.pbxproj
```

## Android Files

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/TrainingPlanModels.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/TrainingPlanUseCases.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/data/FirestoreTrainingPlanRepository.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/data/TrainingPlanComposition.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/TrainingPlanViewModel.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/TrainingPlansSection.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/TribeApp.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/test/java/com/risewiththetribe/challengetracker/workouts/TrainingPlanTest.kt
```

## Behavior Added

- Load published `trainingPlans` from Firestore.
- Load user `trainingPlanEnrollments`.
- Search plans locally.
- Filter plans by goal and level.
- Select a plan and display summary, description, metrics, and today preview.
- Start a plan by creating/merging `users/{uid}/trainingPlanEnrollments/{planId}`.
- Leave a plan by marking the enrollment `left`.
- Keep Web/iOS/Android plan domain contracts aligned.

## Architecture Notes

### iOS

- `TrainingPlanModels.swift` is domain-only and imports Foundation.
- `TrainingPlanUseCases.swift` owns the repository protocol and use cases.
- `FirestoreTrainingPlanRepository.swift` is the only new iOS file importing Firebase Auth/Firestore.
- `TrainingPlanViewModel.swift` is `@MainActor`, imports Foundation, and depends only on `TrainingPlanUseCases`.
- `TrainingPlanComposition.swift` is the composition boundary.
- `TrainingPlansSection.swift` is SwiftUI-only and receives use cases from the composition root.

### Android

- `TrainingPlanModels.kt` and `TrainingPlanUseCases.kt` are pure Kotlin/domain.
- `FirestoreTrainingPlanRepository.kt` is the only new Firebase SDK boundary.
- `TrainingPlanViewModel.kt` exposes `StateFlow<TrainingPlanUiState>` and depends only on use cases.
- `TrainingPlanComposition.kt` wires Firestore repository to use cases.
- `TrainingPlansSection.kt` is Compose-only and receives use cases.

## Verification

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS
xcodegen generate
```

Result: succeeded.

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS
xcodebuild -project TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination 'generic/platform=iOS' -derivedDataPath build/DerivedDataTrainingPlanVerify build
```

Result: `BUILD SUCCEEDED`.

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS
xcodebuild -project TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination 'platform=iOS Simulator,id=227132E2-D637-4C61-AA8D-A32F61EB0105' -derivedDataPath build/DerivedDataTrainingPlanTests test -only-testing:TribeLogTests/TrainingPlanTests
```

Result: `TEST SUCCEEDED`, 5 tests.

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew :app:testDebugUnitTest --tests '*TrainingPlanTest'
```

Result: `BUILD SUCCESSFUL`.

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew :app:assembleDebug
```

Result: `BUILD SUCCESSFUL`.

## Known Gaps

- Live native screenshots are not captured in this checkpoint.
- Training plan content still needs live `--apply` seed before production QA if not already applied.
- Plan customization, substitutions, adherence badges, and Today-tab home integration remain later checkpoints.
- Android has pre-existing local WorkoutCatalog changes in the working tree; this checkpoint does not claim or revert them.

## Questions For Claude

1. Does iOS pass MVVM + Clean Architecture for Training Plans?
2. Does Android pass MVVM + Clean Architecture for Training Plans?
3. Is parity with Web Checkpoints 11 and 12 acceptable?
4. Should enrollment writes remain direct client writes under owner-only Firestore rules for now, or should they move behind a callable before plan customization/adherence badges?
5. Is the UI placement correct: Guided Workout, Training Plans, History, Public Discovery, Library?
