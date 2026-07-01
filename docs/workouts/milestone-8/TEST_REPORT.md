# Milestone 8 Test Report

Status date: 2026-07-01

## Commands Run

### Web Unit Tests

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/workoutsBackendFoundation.test.js src/__tests__/workoutsWebLibrary.test.js src/__tests__/workoutsGuidedSession.test.js src/__tests__/workoutsHistory.test.js src/__tests__/workoutsSocial.test.js --watchAll=false --runInBand
```

Result:

- 5 suites passed.
- 27 tests passed.

### Firestore Emulator Rules Tests

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run test:workouts-rules
```

Result:

- 1 suite passed.
- 6 emulator allow/deny tests passed.

Note: expected Firestore permission-denied warnings appear in the test logs for denied cases.

### Web Production Build

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run build
```

Result:

- Build passed.

### Focused Web Social / Asset Tests

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/workoutsSocial.test.js src/__tests__/workoutsAssetPipeline.test.js --watchAll=false --runInBand
```

Result:

- 2 suites passed.
- 7 tests passed.

### iOS Social Tests

```bash
xcodebuild test -project ../TribeChallengeTrackerIOS/TribeChallenge.xcodeproj -scheme TribeLog -destination 'platform=iOS Simulator,id=D923D710-E371-406A-9950-A34017DF4AF2' -only-testing:TribeLogTests/WorkoutSocialTests -derivedDataPath /private/tmp/TribeChallengeM8SocialDerivedData -clonedSourcePackagesDirPath /private/tmp/TribeChallengeM8SocialSPM
```

Result:

- `WorkoutSocialTests` passed.
- 4 tests passed.

### Android Social Tests

```bash
cd ../TribeChallengeTrackerAndroid
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew :app:testDebugUnitTest --tests "com.risewiththetribe.challengetracker.workouts.WorkoutSocialTest"
```

Result:

- Build successful.
- `WorkoutSocialTest` passed.

### Android Debug Build

```bash
cd ../TribeChallengeTrackerAndroid
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew assembleDebug
```

Result:

- Build successful.

### Callable Deploy / Smoke

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npx firebase deploy --only functions:finishWorkoutSession,functions:copyPublicWorkout --project tribechallengetracker
```

Result:

- `finishWorkoutSession(australia-southeast1)` deployed.
- `copyPublicWorkout(australia-southeast1)` deployed.

Smoke:

- Unauthenticated direct POST to each deployed endpoint returned HTTP 401 with `UNAUTHENTICATED`.

## Not Run

- Full authenticated end-to-end copy/finish flow from a signed-in Web/iOS/Android client.

## Coverage Added

- Rules emulator coverage for the M8 social safety gate.
- Pure helper coverage for copied workout attribution.
- Web mapper/use-case coverage for public workout discovery.
- iOS mapper/use-case/ViewModel coverage for public workout discovery/copy/follow.
- Android mapper/use-case/ViewModel coverage for public workout discovery/copy/follow.
