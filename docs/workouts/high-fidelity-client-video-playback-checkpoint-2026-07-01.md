# TribeLog High-Fidelity Client Video Playback Checkpoint

Status date: 2026-07-01
Owner: Navdeep
Implementation: Codex
Review partner: Claude

## Verdict Request

Please review this as a local prep checkpoint for future realistic workout animations.

No live Firestore records were updated. No high-fidelity media assets were generated. Existing Lottie/SVG assets remain the production fallback.

## Product Goal

When Claude Design approves realistic workout animation assets, all clients should be able to render them inside the existing Coach Mode motion card without another UI rewrite.

The desired behavior:

- If an exercise has `mediaManifest.preferredMotion == "video"` and a `videoPath`, clients render video.
- Web prefers `demo.webm` as the first `<source>` when available.
- MP4 remains available as the universal fallback.
- Poster image is used for loading state.
- If video fails, users see a friendly "Motion preview unavailable" fallback where supported.
- If no approved video manifest exists, the current Lottie path remains unchanged.

## What Changed

### Domain

`selectExerciseMotionSource` now includes `previewPath` for video motion sources.

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/domain/workoutCatalogModels.js
```

### Web UI

`ExerciseMotionPreview` now:

- renders `<video>` for future high-fidelity media
- supports `demo.webm` and `demo.mp4` sources
- uses `poster.webp`
- shows user-facing loading/ready/error labels
- preserves current Lottie rendering for the existing catalog

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/presentation/WorkoutsLibrarySection.jsx
```

### iOS UI

`WorkoutAssetVisualPreview` now:

- uses native `AVKit.VideoPlayer` for future high-fidelity MP4 demos
- skips the Lottie fetch when `mediaManifest.preferredMotion == "video"`
- keeps the existing Lottie/WebView path for current exercise assets

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Views/WorkoutCatalogSection.swift
```

### Android UI

`WorkoutAssetPreview` now:

- uses platform `VideoView` through Compose `AndroidView` for future high-fidelity MP4 demos
- mutes and loops video playback
- keeps `lottie-compose` as the fallback for current exercise assets

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/WorkoutCatalogSection.kt
```

### Tests

The Web workout library test now verifies:

- `mediaManifest.previewPath` is preserved in the motion source
- future video demos render with WebM + MP4 sources
- Firebase Storage relative paths resolve to absolute URLs
- current Lottie fallback behavior remains covered
- planned POC media remains blocked from release-ready validation
- the live apply script rejects planned media records

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/__tests__/workoutsWebLibrary.test.js
```

### Apply Guardrail

`apply-workout-high-fidelity-media.js` is prepared for later live rollout, but it requires release-ready records. It refuses the current POC manifest because all records are intentionally `planned` with `mediaHash: pending`.

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/apply-workout-high-fidelity-media.js
```

## Verification

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/workoutsWebLibrary.test.js --watchAll=false --runInBand
```

Result:

```text
PASS, 10 tests
```

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/validate-workout-high-fidelity-media.js
```

Result:

```text
Validated 5 high-fidelity workout media POC records.
```

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/apply-workout-high-fidelity-media.js
```

Result:

```text
Expected failure: goblet_squat: --require-ready does not allow planned media.
```

```text
xcodebuild -project TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination 'id=227132E2-D637-4C61-AA8D-A32F61EB0105' -derivedDataPath build/DerivedDataCoachModeTest test -only-testing:TribeLogTests/WorkoutCatalogTests
```

Result:

```text
TEST SUCCEEDED, 12 tests
```

```text
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew :app:testDebugUnitTest --tests '*WorkoutCatalogTest'
```

Result:

```text
BUILD SUCCESSFUL
```

## What Is Still Pending

- Claude Design approval for the realistic animation visual style.
- Real five-exercise high-fidelity assets (`demo.mp4`, `demo.webm`, `poster.webp`).
- Live upload to Firebase Storage.
- Live Firestore `mediaManifest` apply.
- Real high-fidelity video QA on iOS.
- Real high-fidelity video QA on Android.
- Real device QA after actual video assets exist.

## Review Questions For Claude

1. Is client video playback prep acceptable before final asset style approval?
2. Should Web prefer `demo.webm` before `demo.mp4`, or should MP4 come first for predictability?
3. Are the user-facing labels acceptable: `LOADING REALISTIC DEMO`, `REALISTIC DEMO READY`, `MOTION UNAVAILABLE`?
4. Is it acceptable that the existing Lottie path remains the fallback until high-fidelity coverage exists?
5. Is lightweight native playback through `AVKit.VideoPlayer` and Android `VideoView` enough for the five-asset POC, or should we move to a richer video player later?
6. Is the apply script strict enough for later live Firestore rollout?
