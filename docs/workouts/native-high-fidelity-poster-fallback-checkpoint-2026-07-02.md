# Native High-Fidelity Poster Fallback Checkpoint

Date: 2026-07-02

## Review Request

Please review the native high-fidelity playback polish added after the iOS loop-parity checkpoint.

This checkpoint is intentionally small: it does not introduce new workout content or new backend behavior. It hardens the native playback UX so realistic workout media does not render as a blank panel while the MP4/video player prepares.

## Scope

### iOS

File:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Views/WorkoutCatalogSection.swift
```

Changes:

- `WorkoutVideoPreview` now accepts a `posterURL`.
- The poster displays through `AsyncImage` until the `AVPlayerItem` reports `.readyToPlay`.
- The video fades in once ready.
- If the poster cannot load, the card shows a branded gradient fallback with a play icon.
- The iOS loop observer from the previous checkpoint is preserved:
  - seek to `.zero` when playback ends
  - resume playback when auto-play is enabled
  - reset Coach Mode cue progress to `0%`
  - remove notification/KVO observers on disappear
- Non-video exercises preserve the existing Lottie/WebView fallback. The poster fallback is video-only.

### Android

File:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/WorkoutCatalogSection.kt
```

Changes:

- `WorkoutAssetPreview` resolves the exercise poster path alongside the video URL.
- While `VideoView` prepares, Android shows the poster via Coil `AsyncImage`.
- If no poster is available or loading fails, the card shows a branded "Preparing realistic demo" fallback.
- `VideoView` marks the player as ready in `setOnPreparedListener`.
- Error or URL changes reset the ready state so stale frames are not shown.
- Non-video exercises preserve the existing `lottie-compose` playback path. The poster fallback is video-only.
- Existing Android loop behavior remains:
  - loop video playback
  - report cue progress from playback position
  - reset progress to `0%` at loop completion

## Why This Matters

The workout detail screen is moving from static instruction lists to a coach-style motion card. If realistic video is still loading, users should see a proper poster image or branded fallback, not raw asset paths or an empty media slot.

This also keeps native behavior aligned with the Web high-fidelity playback prep:

- motion-first visual surface
- cue text synced to playback
- reduced-motion support
- poster/fallback before playable media is ready
- preserved Lottie fallback for the current approved 50-exercise asset set

## Claude Review Questions

1. Does the native poster fallback approach satisfy the UX bar for realistic workout demos while media loads?
2. Is the iOS `AVPlayerItem.status` observation acceptable, or should readiness be modeled differently?
3. Is the Android `VideoView` + poster overlay approach acceptable for this checkpoint, or should we move directly to ExoPlayer before production realistic video rollout?
4. Does the restored Lottie/SVG fallback fully satisfy the "do not lose current fallback" guardrail while high-fidelity video remains optional?
5. Does the checkpoint preserve the frame-aware cue-sync and reduced-motion decisions already approved for Web/iOS/Android?

## Verification

```text
iOS WorkoutCatalogTests: PASS
Android WorkoutCatalogTest: PASS
```

Commands run:

```bash
xcodebuild -quiet \
  -project /Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge.xcodeproj \
  -scheme TribeLog \
  -destination 'id=227132E2-D637-4C61-AA8D-A32F61EB0105' \
  -derivedDataPath /private/tmp/TribeLogWorkoutCatalogTestBuild \
  -only-testing:TribeLogTests/WorkoutCatalogTests \
  test

JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" \
  ./gradlew :app:testDebugUnitTest --tests '*WorkoutCatalogTest'
```

## Known Gaps

- Real exercise-specific MP4/WebM/poster assets are still pending.
- Real iPhone screenshots of native high-fidelity playback should be captured once real video assets are available.
- Android real-device playback should be checked with physical hardware once an Android device is available.
- High-fidelity poster fallback only applies when `mediaManifest.preferredMotion == "video"` and video media is present.
- The current approved Lottie/SVG fallback remains the production fallback for the 50-exercise library.
