# TribeLog Frame-Aware Cue Sync Checkpoint

Status date: 2026-07-02
Owner: Navdeep
Implementation: Codex
Review partner: Claude

## Verdict Request

Please review this as a contained Phase 1.1 Coach Mode improvement.

The goal is to move the exercise detail experience closer to Navdeep's desired coaching model:

- animation remains visible
- selected cue text explains the current movement phase
- static instructions stay secondary
- users can still tap a cue to lock it for the current exercise
- users can resume automatic sync with a visible `SYNC` / `SYNC TO MOTION` control

This checkpoint wires frame/progress-aware cue sync on Web, iOS, and Android while preserving the timer fallback if playback progress is not available.

## What Changed

### Domain

Added a pure helper:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/domain/workoutCatalogModels.js
```

New export:

```js
findExerciseCueForMotionProgress(cues, progressPercent, fallbackCueId)
```

Behavior:

- Accepts backend-authored `startPercent/endPercent` cue ranges.
- Returns the cue whose range contains the current animation/video progress.
- Treats `100%` as inclusive for the final cue.
- Falls back to the current selected cue, then the first cue, when no range matches.
- Returns `null` for empty cue lists.

### Web UI

Updated:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/presentation/WorkoutsLibrarySection.jsx
```

`ExerciseMotionPreview` now emits motion progress:

- Lottie: listens to `enterFrame`, converts current frame into `0-100%` progress using `ip/op`.
- Video: listens to `timeupdate`, converts `currentTime/duration` into `0-100%`.

`ExerciseCoachMode` now:

- Selects the active cue from actual playback progress while the user has not manually selected a cue.
- Preserves existing manual lock behavior: once the user taps a cue card, auto sync stops for the current exercise.
- Shows `SYNC TO MOTION` after manual selection so users can resume playback-driven cues.
- Resets manual lock and returns to first cue when the selected exercise changes.
- Respects `prefers-reduced-motion` by pausing auto-play by default and showing an explicit `PLAY MOTION` opt-in.
- Keeps auto-synced cue changes silent for screen readers with `aria-live="off"`.
- Announces the active cue panel through `aria-live="polite"` only when cue changes are user-initiated: manual cue lock or reduced-motion pause/play state.

### iOS Domain

Added a matching pure helper:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/WorkoutCatalogModels.swift
```

New function:

```swift
workoutExerciseCueForMotionProgress(_:progressPercent:fallbackCueId:)
```

It uses the same range-boundary behavior as Web and has no Firebase or SwiftUI dependency.

### iOS UI

Updated:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Views/WorkoutCatalogSection.swift
```

`WorkoutCoachModeCard` now advances cue selection from player progress when available:

- Lottie progress is bridged from the embedded WKWebView through `motionProgress`
- high-fidelity video progress is bridged from `AVPlayer` through a periodic observer
- falls back to `mediaManifest.durationMs` or a 3.8 second loop until player progress arrives
- maps playback/loop progress through `workoutExerciseCueForMotionProgress`
- preserves tap-to-lock behavior
- shows a compact `SYNC` button after manual selection to resume automatic cue sync
- respects iOS Reduce Motion by pausing motion by default and exposing a compact `PLAY` opt-in

### Android Domain

Added a matching pure helper:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/WorkoutCatalogModels.kt
```

New function:

```kotlin
findWorkoutCueForMotionProgress(cues, progressPercent, fallbackCueId)
```

It uses the same range-boundary behavior as Web and has no Android UI or Firebase dependency.

### Android UI

Updated:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/WorkoutCatalogSection.kt
```

`WorkoutCoachMode` now advances cue selection from player progress where available:

- Lottie playback progress from `animateLottieCompositionAsState` drives cue selection after composition load
- falls back to `mediaManifest.durationMs` or a 3.8 second loop until player progress arrives
- maps playback/loop progress through `findWorkoutCueForMotionProgress`
- preserves tap-to-lock behavior
- shows a compact `SYNC` button after manual selection to resume automatic cue sync
- respects disabled system animations by pausing motion by default and exposing a compact `PLAY` opt-in

## Why This Matters

Previous Coach Mode auto-rotated cue cards on a timer. That made the detail screen feel more alive, but the cue text was not actually tied to the motion.

This checkpoint makes the text follow the animation/video phase on Web, which is the right product direction for:

- "watch the move + read what to focus on"
- future realistic video demos
- future exact `startFrame/endFrame` authoring

## Verification

Command:

```bash
npm test -- --runTestsByPath src/__tests__/workoutsWebLibrary.test.js --watchAll=false --runInBand
```

Result:

```text
PASS src/__tests__/workoutsWebLibrary.test.js
Test Suites: 1 passed, 1 total
Tests: 13 passed, 13 total
```

Command:

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run build
```

Result:

```text
Compiled successfully.
```

New test coverage:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/__tests__/workoutsWebLibrary.test.js
```

Added coverage for:

- cue selection at range boundaries
- final cue at `100%`
- empty cue list behavior
- non-finite progress fallback behavior
- reduced-motion playback mode helper
- silent auto-sync cue region
- polite manual-lock and reduced-motion cue announcement regions
- chronological `phaseTimeline` validation wording for realistic animation POCs

Command:

```bash
xcodebuild -project TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination 'id=227132E2-D637-4C61-AA8D-A32F61EB0105' -derivedDataPath build/DerivedDataCueSync test -only-testing:TribeLogTests/WorkoutCatalogTests
```

Result:

```text
TEST SUCCEEDED
Executed 13 tests, with 0 failures
```

New iOS test coverage:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeLogTests/WorkoutCatalogTests.swift
```

Command:

```bash
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew :app:testDebugUnitTest --tests '*WorkoutCatalogTest'
```

Result:

```text
BUILD SUCCESSFUL
```

Command:

```bash
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew :app:assembleDebug
```

Result:

```text
BUILD SUCCESSFUL
```

New Android test coverage:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/test/java/com/risewiththetribe/challengetracker/workouts/WorkoutCatalogTest.kt
```

## Review Questions For Claude

1. Is progress-based cue sync the right interaction model before exact frame ranges are authored?
2. Is the visible `SYNC` / `SYNC TO MOTION` control the right way to resume automatic cue sync after manual selection?
3. Should `startPercent/endPercent` remain the default authoring format, or should we require exact `startFrame/endFrame` for all official exercises before production?
4. Is native player-progress sync plus timer fallback acceptable for v1, or should every platform require exact authored `startFrame/endFrame` before public release?
5. Are there any accessibility concerns with cue text changing while animation plays, given the current `prefers-reduced-motion` pause and polite live-region behavior?

## Known Gaps

- iOS video sync uses AVPlayer progress, iOS Lottie sync uses WebView-posted runtime progress, and Android Lottie sync uses Compose Lottie progress. Android high-fidelity video still uses the timer fallback until approved real video assets are available.
- Web Lottie sync uses `enterFrame` progress from the Lottie runtime; exact visual alignment still depends on cue authoring quality.
- Existing full cue draft records use percent ranges, not exact frame ranges.
- No real-device video capture exists for this specific progress-sync behavior yet.

## Release Boundary

Do not present this as frame-perfect coaching until Claude confirms percent ranges are acceptable or approves exact `startFrame/endFrame` authoring for the official cue set.
