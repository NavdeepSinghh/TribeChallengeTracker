# Milestone 5.5 Test Report: Native Workouts Test Coverage

## iOS

Command:

```bash
cd /Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS
xcodebuild test -project TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 16,OS=18.2' -derivedDataPath /tmp/tribelog-ios-tests
```

Result:

```text
Test Suite 'WorkoutCatalogTests' passed.
Executed 10 tests, with 0 failures.
** TEST SUCCEEDED **
```

Coverage:

- `WorkoutExerciseMapper` valid payload.
- `WorkoutExerciseMapper` missing required fields.
- `WorkoutAssetPreviewViewModel.lottieFrameCount` valid Lottie JSON.
- `WorkoutAssetPreviewViewModel.lottieFrameCount` invalid JSON.
- `WorkoutCatalogViewModel` loaded state and filter options.
- `WorkoutCatalogViewModel` local search filtering.
- `WorkoutCatalogViewModel` server filter reload.
- `WorkoutCatalogViewModel` empty state.
- `WorkoutCatalogViewModel` failed then retry loaded.
- `WorkoutCatalogViewModel` loading state while fetch is in flight.

## Android

Command:

```bash
cd /Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid
JAVA_HOME='/Applications/Android Studio.app/Contents/jbr/Contents/Home' ./gradlew :app:testDebugUnitTest
```

Result:

```text
BUILD SUCCESSFUL
```

JUnit report:

```text
tests=10 skipped=0 failures=0 errors=0
```

Coverage:

- `workoutExerciseFrom` valid payload.
- `workoutExerciseFrom` missing required fields.
- `WorkoutAssetCache.lottieFrameCount` valid Lottie JSON.
- `WorkoutAssetCache.lottieFrameCount` invalid JSON.
- `WorkoutCatalogViewModel` loaded state and filter options.
- `WorkoutCatalogViewModel` local search filtering.
- `WorkoutCatalogViewModel` server filter reload.
- `WorkoutCatalogViewModel` empty state.
- `WorkoutCatalogViewModel` failed then retry loaded.
- `WorkoutCatalogViewModel` loading state while fetch is in flight.

## Additional Verification After M5.5

Web guided/session tests:

```bash
cd /Users/navdeepsmacbook/Documents/TribeChallengeTracker
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/workoutsBackendFoundation.test.js src/__tests__/workoutsWebLibrary.test.js src/__tests__/workoutsGuidedSession.test.js --watchAll=false --runInBand
```

Result:

```text
Test Suites: 3 passed, 3 total
Tests: 17 passed, 17 total
```

Web production build:

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run build
```

Result:

```text
Compiled successfully.
```

iOS generic build:

```bash
cd /Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS
xcodebuild -project TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination generic/platform=iOS build
```

Result:

```text
** BUILD SUCCEEDED **
```

Android debug build:

```bash
cd /Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid
JAVA_HOME='/Applications/Android Studio.app/Contents/jbr/Contents/Home' ./gradlew :app:assembleDebug
```

Result:

```text
BUILD SUCCESSFUL
```

