# Milestone 6 Test Report: Guided Workout MVP

## Web Commands

From `/Users/navdeepsmacbook/Documents/TribeChallengeTracker`:

```bash
npm test -- --runTestsByPath src/__tests__/workoutsBackendFoundation.test.js src/__tests__/workoutsWebLibrary.test.js src/__tests__/workoutsGuidedSession.test.js --watchAll=false --runInBand
```

Result:

```text
PASS src/__tests__/workoutsGuidedSession.test.js
PASS src/__tests__/workoutsWebLibrary.test.js
PASS src/__tests__/workoutsBackendFoundation.test.js

Test Suites: 3 passed, 3 total
Tests:       17 passed, 17 total
```

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run build
```

Result:

```text
Compiled successfully.
```

## iOS Command

From `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS`:

```bash
xcodebuild -project TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination generic/platform=iOS build
```

Result:

```text
** BUILD SUCCEEDED **
```

## iOS Unit Tests

From `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS`:

```bash
xcodebuild test -project TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 16,OS=18.2' -derivedDataPath /tmp/tribelog-ios-tests
```

Result:

```text
Test - TribeLog
Passed tests: 16
Failed tests: 0
Skipped tests: 0
Result: Passed
```

## Android Commands

From `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid`:

```bash
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew :app:assembleDebug
```

Result:

```text
BUILD SUCCESSFUL in 2s
```

```bash
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew :app:testDebugUnitTest
```

Result:

```text
BUILD SUCCESSFUL
16 tests passed, 0 failures, 0 errors
```

## Web Unit Coverage

`src/__tests__/workoutsGuidedSession.test.js` covers:

- Creating a guided workout session from catalog exercises.
- Capturing exercise names, muscle snapshots, and `assetHashSnapshot`.
- Completing sets and advancing active set/exercise pointers.
- Starting and ticking rest timer state.
- Building finish payload with completed sets only.
- Calculating workout summary values.

## Static Architecture Checks

Web command:

```bash
rg -n "firebase|Firestore|Auth|getFunctions|httpsCallable" src/workouts/domain src/workouts/presentation
```

Result:

- No hits.

iOS command:

```bash
rg -n "Firebase|Firestore|Auth|URLSession" TribeChallenge/Workouts/GuidedWorkoutModels.swift TribeChallenge/Workouts/GuidedWorkoutViewModel.swift TribeChallenge/Views/GuidedWorkoutSection.swift
```

Result:

- No hits.

Android command:

```bash
rg -n "Firebase|Firestore|FirebaseAuth|HttpURLConnection" app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation
```

Result:

- No SDK imports in guided workout domain or presentation files.
- One presentation string from the read-only library mentions "Firebase Storage pipeline ships"; this is UI copy, not an import.

Android data command:

```bash
rg -n "Firebase|Firestore|FirebaseAuth|HttpURLConnection" app/src/main/java/com/risewiththetribe/challengetracker/workouts/data
```

Result:

- Firebase SDK and direct HTTP usage are isolated to repository/data files.

## Native Unit Coverage Added In M5.5 And M6

iOS and Android now cover:

- Catalog exercise mapper happy path.
- Catalog exercise mapper missing-field path.
- Lottie frame-count parsing for valid and invalid JSON.
- Catalog ViewModel loaded, empty, failed/retry, search, server filter, and loading-in-flight states.
- Guided workout session creation with `assetHashSnapshot`.
- Guided workout set completion, set/exercise advancement, and rest timer start.
- Finish payload construction with completed sets only.
- Guided ViewModel start and local active-session persistence.
- Pending finish persistence on submit failure.
- Pending finish retry and local cleanup on success.

Native guided workout coverage was added after the initial M6 pack so the M6 hard gate raised in the M5 review is now closed.

## Manual QA Not Completed

- No live authenticated end-to-end finish call against deployed `finishWorkoutSession`.
- No real iPhone install for M6 after the generic iOS build.
- No live Android device QA for M6.
- No emulator rule tests added in this milestone; that remains the Milestone 8 gate.
