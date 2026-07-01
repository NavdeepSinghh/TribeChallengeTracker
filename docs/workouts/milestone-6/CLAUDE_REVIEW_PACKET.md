# Claude Review Packet: Milestone 6 Guided Workout MVP

## Requested Verdict

Please review Milestone 6 for implementation approval and decide whether M7 can proceed before Cloud Function deployment, or whether deployment/smoke test must happen first.

Important: M4 and M5 have now been reviewed and approved. M5.5 has also been completed to close the native test gate raised in the M5 review. Review order should be:

1. Milestone 5.5 Native Workouts Test Coverage
2. Milestone 6 Guided Workout MVP

## What Changed

Guided workout MVP now exists across Web, iOS, and Android.

Users can:

- Select exercises from the backend-driven catalog.
- Start a guided workout.
- Enter reps and weight for the current set.
- Complete sets and advance through the workout.
- Use a rest timer after set completion.
- Persist active session state locally.
- Finish the workout through `finishWorkoutSession`.
- Save and retry a pending finish payload if submission fails.

## Key Files

Web:

- `src/workouts/domain/guidedWorkoutModels.js`
- `src/workouts/domain/guidedWorkoutUseCases.js`
- `src/workouts/data/webGuidedWorkoutRepository.js`
- `src/workouts/workoutGuidedComposition.js`
- `src/workouts/presentation/useGuidedWorkoutViewModel.js`
- `src/workouts/presentation/GuidedWorkoutSection.jsx`
- `src/firebase.js`
- `src/app/BoardTab.jsx`
- `src/__tests__/workoutsGuidedSession.test.js`

iOS:

- `TribeChallenge/Workouts/GuidedWorkoutModels.swift`
- `TribeChallenge/Workouts/GuidedWorkoutService.swift`
- `TribeChallenge/Workouts/GuidedWorkoutViewModel.swift`
- `TribeChallenge/Views/GuidedWorkoutSection.swift`
- `TribeChallenge/Views/LeaderboardView.swift`
- `TribeChallenge.xcodeproj/project.pbxproj`

Android:

- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/GuidedWorkoutModels.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/GuidedWorkoutUseCases.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/data/AndroidGuidedWorkoutRepository.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/data/GuidedWorkoutComposition.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/GuidedWorkoutViewModel.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/GuidedWorkoutSection.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/ui/TribeApp.kt`

Docs:

- `docs/workouts/milestone-6/EXECUTION_PLAN.md`
- `docs/workouts/milestone-6/EXECUTION_LOG.md`
- `docs/workouts/milestone-6/TEST_REPORT.md`
- `docs/workouts/milestone-6/ARCHITECTURE_REVIEW.md`
- `docs/workouts/milestone-6/BRAND_AUDIT.md`
- `docs/workouts/milestone-6/KNOWN_GAPS.md`

## Verification

M5.5 native catalog tests:

```bash
cd /Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS
xcodebuild test -project TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 16,OS=18.2' -derivedDataPath /tmp/tribelog-ios-tests
```

Result: 16 tests passed, including 6 guided workout state/persistence tests.

```bash
cd /Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew :app:testDebugUnitTest
```

Result: 16 tests passed, including 6 guided workout state/persistence tests.

Web:

```bash
npm test -- --runTestsByPath src/__tests__/workoutsBackendFoundation.test.js src/__tests__/workoutsWebLibrary.test.js src/__tests__/workoutsGuidedSession.test.js --watchAll=false --runInBand
```

Result: 3 suites passed, 17 tests passed.

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run build
```

Result: compiled successfully.

iOS:

```bash
xcodebuild -project TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination generic/platform=iOS build
```

Result: build succeeded.

Android:

```bash
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew :app:assembleDebug
```

Result: build succeeded.

```bash
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew :app:testDebugUnitTest
```

Result: build succeeded, 16 tests passed.

Updated native guided workout hardening:

- iOS added `TribeLogTests/GuidedWorkoutTests.swift`.
- Android added `GuidedWorkoutTest.kt`.
- Both platforms now test session creation with `assetHashSnapshot`, set completion/rest start, finish payload filtering, active-session persistence, pending finish on failure, and retry cleanup.

## Known Blocker

`finishWorkoutSession` has not been deployed or smoke-tested in production during M6. Clients are wired, but production release of guided workouts should remain blocked until deployment and authenticated finish smoke test pass.

## Review Focus

Please specifically review:

1. Whether M6 can be implementation-approved with deployment as a release blocker.
2. Whether iOS/Android should switch from direct HTTPS callable calls to Firebase Functions SDK before release.
3. Whether the newly-added guided workout native tests are sufficient for M7 to proceed, with live background/timer QA still tracked as release QA.
4. Whether the active-session and pending-finish persistence model is acceptable for MVP.
5. Cross-platform payload parity, especially `assetHashSnapshot`, points, duration, and completed-set filtering.
