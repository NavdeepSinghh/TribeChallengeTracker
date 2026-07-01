# Milestone 10 Test Report

Status date: 2026-07-01

## Web

Command:

```bash
CI=true npm test -- --runTestsByPath src/__tests__/workoutsAssetPipeline.test.js src/__tests__/workoutsWebLibrary.test.js --runInBand
```

Result:

- 2 suites passed.
- 22 tests passed.

Coverage:

- Storage URL resolution for relative paths.
- Absolute URL pass-through.
- Local preview path pass-through.
- All five asset manifests validate.
- All generated thumbnails are real WebP files.

## iOS

Command:

```bash
xcodebuild test -project /Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge.xcodeproj -scheme TribeLog -destination 'id=D923D710-E371-406A-9950-A34017DF4AF2' -only-testing:TribeLogTests/WorkoutCatalogTests
```

Result:

- 11 tests passed.
- 0 failures.

Coverage:

- Exercise mapper.
- Lottie frame count.
- Storage URL resolution for relative and `gs://` paths.
- Catalog ViewModel states and filters.

Device build/install:

```bash
xcodebuild -project ../TribeChallengeTrackerIOS/TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination 'id=00008120-00044DA93633401E' -derivedDataPath /tmp/TribeLogM10DeviceBuild build
```

Result: passed.

Install:

```bash
xcrun devicectl device install app --device 274FB6BA-3764-5A5D-8AA3-33C3A990B3A5 /tmp/TribeLogM10DeviceBuild/Build/Products/Debug-iphoneos/TribeLog.app
```

Result: passed.

Launch:

- Blocked by iOS because the connected device was locked.
- `Navdeep’s iPhone` was offline/unavailable to Xcode at check time.

## Android

Command:

```bash
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew :app:testDebugUnitTest
```

Result:

- Build successful.

Coverage:

- Exercise mapper.
- Lottie frame count.
- Storage URL resolution for relative and `gs://` paths.
- Catalog ViewModel states and filters.
- Existing workout/social tests in the Android unit test target.

Debug build:

```bash
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew :app:assembleDebug
```

Result: passed.

Runtime:

- `adb devices -l` returned no attached Android device/emulator.

## Live Backend Smoke

Signed-in smoke used App Review credentials.

Result:

- `finishWorkoutSession` public write succeeded.
- `copyPublicWorkout` succeeded.
- Cleanup `finishWorkoutSession` private write succeeded.

## Web Browser QA

Environment:

- `http://localhost:3000`
- Chrome authenticated with the App Review/demo account.
- Live Firestore and live Firebase Storage assets.

Result:

- Reviewer/demo account sign-in passed after email verification was set in Firebase Auth.
- Onboarding completion screen showed `Welcome, App Review!`.
- Workouts tab loaded 50 live exercises.
- Bench Press detail showed `LOTTIE READY · 90 FRAMES`.
- Browser console had no CORS or asset-fetch errors.
- Screenshot saved: `docs/workouts/milestone-10/screenshots/web-workouts-loaded-storage-assets.jpg`.

## Hosted Web QA

Build:

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run build
```

Result: passed.

Deploy:

```bash
firebase deploy --only hosting --project tribechallengetracker --non-interactive
```

Result: passed.

Hosted URL:

- `https://tribechallengetracker.web.app`

Result:

- Hosted Workouts tab loaded 50 live exercises.
- Hosted Bench Press detail showed `LOTTIE READY · 90 FRAMES`.
- Hosted browser warning/error logs were empty after the Workouts detail check.
- Screenshot saved: `docs/workouts/milestone-10/screenshots/web-hosted-workouts-loaded-storage-assets.jpg`.

## Live Firestore Readback

Result:

- `exerciseCatalog` contains 50 documents.

## Storage Verification

Result:

- Default Firebase Storage bucket created.
- Storage rules deployed.
- Storage CORS applied.
- All 200 manifest entries uploaded.
- Representative unauthenticated media URL fetches returned `200`.
- Actual browser-style `GET` checks with `Origin` headers return matching `access-control-allow-origin`.

Sample checks:

```text
200 application/json 22232 workouts/exercises/v1/bench_press/demo.lottie.json
200 image/svg+xml 3847 workouts/exercises/v1/bench_press/muscle-map-front.svg
200 image/webp 11516 workouts/exercises/v1/bench_press/thumbnail.webp
200 application/json 22162 workouts/exercises/v1/rowing_machine/demo.lottie.json
200 image/svg+xml 4174 workouts/exercises/v1/worlds_greatest_stretch/muscle-map-front.svg
```

CORS checks:

```text
Origin: https://tribechallengetracker.web.app
access-control-allow-origin: https://tribechallengetracker.web.app

Origin: http://localhost:3000
access-control-allow-origin: http://localhost:3000
```

## Launch Screenshot Follow-Up

- iOS real-device guided workout screenshot.
- Android device/emulator catalog/detail/social-copy screenshot.

Claude final M10 review approved Phase 1 as ready to ship; these screenshots are launch proof tasks, not code blockers.
