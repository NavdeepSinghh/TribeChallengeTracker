# Milestone 7 Test Report

Status date: 2026-07-01

## Commands Run

### Web

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/workoutsBackendFoundation.test.js src/__tests__/workoutsWebLibrary.test.js src/__tests__/workoutsGuidedSession.test.js src/__tests__/workoutsHistory.test.js --watchAll=false --runInBand
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run build
```

Result:

- 4 test suites passed.
- 21 tests passed.
- Production build passed.

### iOS

```bash
cd /Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS
xcodegen generate
xcodebuild test -project TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 16,OS=18.2' -derivedDataPath /tmp/tribelog-ios-tests
xcodebuild -project TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination generic/platform=iOS build
```

Result:

- 21 XCTest cases passed.
- Generic iOS build passed.

### Android

```bash
cd /Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid
JAVA_HOME='/Applications/Android Studio.app/Contents/jbr/Contents/Home' ./gradlew :app:testDebugUnitTest
JAVA_HOME='/Applications/Android Studio.app/Contents/jbr/Contents/Home' ./gradlew :app:assembleDebug
```

Result:

- Debug unit tests passed.
- Debug APK build passed.

## New Coverage

### Web

- Workout history mapper.
- Workout history summary.
- Workout volume trend.
- History use cases.

### iOS

- `WorkoutHistoryMapper.session`.
- `WorkoutHistoryMapper.personalRecord`.
- `WorkoutHistoryModel.summary`.
- `WorkoutHistoryModel.volumeTrend`.
- `WorkoutHistoryUseCases`.
- `WorkoutHistoryViewModel` loaded and failed states.

### Android

- `workoutHistorySessionFrom`.
- `workoutPersonalRecordFrom`.
- `WorkoutHistoryModel.summary`.
- `WorkoutHistoryModel.volumeTrend`.
- `WorkoutHistoryUseCases`.
- `WorkoutHistoryViewModel` loaded and failed states.

## Notes

- Android compile reports existing Google Sign-In deprecation warnings and one unchecked map cast warning in the history mapper. These do not block the build.
- iOS generic build reports the existing orientation warning. This is not introduced by M7.
