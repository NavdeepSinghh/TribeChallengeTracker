# TribeLog Workouts Coach Mode v1 - Claude Checkpoint

Status date: 2026-07-01  
Implementation owner: Codex  
Review owner: Claude  
Product owner: Navdeep

## Verdict Requested

Please review as a UI/UX + architecture checkpoint.

Use one of:

- `APPROVED`
- `APPROVED WITH FIXES`
- `BLOCKED`
- `REVIEW INCONCLUSIVE`

## Context

Navdeep wants the exercise detail experience to feel like an interactive movement coach instead of:

- animation preview
- static instructions
- static form cues
- static mistakes

The desired direction is closer to a premium coach panel: animation visible while a selected movement cue explains what to do.

## What Changed

### Cross-platform data contract

All three clients now understand an optional backend field:

```json
{
  "coachingCues": [
    {
      "id": "descent",
      "phase": "lowering",
      "title": "Hips down, knees track",
      "body": "Sit between the knees with control. Let knees follow the toes instead of collapsing in.",
      "startPercent": 19,
      "endPercent": 55,
      "focusMuscles": ["quads", "glutes"],
      "view": "side"
    }
  ]
}
```

Clients use `coachingCues` when present.

Frame-sync readiness:

- `startPercent` / `endPercent` remain the required v1 range fields.
- Optional `startFrame` / `endFrame` are now accepted by Web, iOS, Android, and the apply validator.
- The UI does not use exact frames yet, but the data contract can accept them if Claude wants frame-aware sync before live apply.

Fallback behavior:

- If `coachingCues` is missing, clients synthesize cue cards from `formCues + instructions`.
- This means all 50 current exercises get Coach Mode immediately without a Firestore migration.

### Web

Changed files:

- `src/workouts/domain/workoutCatalogModels.js`
- `src/workouts/presentation/WorkoutsLibrarySection.jsx`
- `src/__tests__/workoutsWebLibrary.test.js`
- `package.json`
- `package-lock.json`
- `scripts/workout-coaching-cues-pilot.json`
- `scripts/apply-workout-coaching-cues.js`

The Web detail now renders:

- `MOVEMENT COACH` section
- existing animation preview
- active cue card
- cue selector cards
- focus muscle chips
- common mistakes below as secondary content

Post-checkpoint polish:

- The Web motion label now uses user-facing animated-demo language instead of frame-count copy such as `PLAYING · 90 FRAMES`.
- Web cues auto-advance only until the user taps a cue. After manual selection, the selected cue remains stable for that exercise.

### iOS

Changed files:

- `TribeChallenge/Workouts/WorkoutCatalogModels.swift`
- `TribeChallenge/Workouts/FirestoreWorkoutCatalogRepository.swift`
- `TribeChallenge/Workouts/WorkoutAssetCache.swift`
- `TribeChallenge/Views/WorkoutCatalogSection.swift`
- `TribeLogTests/WorkoutCatalogTests.swift`

The iOS exercise sheet now renders:

- hero
- `MOVEMENT COACH` card
- animation/muscle preview
- active cue
- horizontal cue selector
- common mistakes and substitutions below

Post-checkpoint polish:

- The iOS motion preview no longer exposes technical cache copy such as `Cached · 90 frames cached`, `Manifest ready`, or raw asset status language.
- The fallback/status copy is now user-facing: `Preparing animated demo`, `Loading animated demo`, `Animated demo ready`, `Animated demo syncing`, or `Animated demo unavailable`.
- iOS cues now match the Web/Android selected-cue behavior: auto-advance until the user taps a cue, then keep that cue selected for the current exercise.

Note: the iOS repo also has previously existing animation-preview changes in this local branch:

- bundled `lottie-web-5.12.2.min.js`
- build number/project file changes

Those predate this Coach Mode checkpoint and were not reverted.

### Android

Changed files:

- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/WorkoutCatalogModels.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/data/FirestoreWorkoutCatalogRepository.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/WorkoutCatalogSection.kt`
- `app/src/test/java/com/risewiththetribe/challengetracker/workouts/WorkoutCatalogTest.kt`

The Android detail dialog now renders:

- `MOVEMENT COACH`
- Lottie animation preview
- active cue card
- tappable cue selector cards
- common mistakes and substitutions below

Post-checkpoint polish:

- Android fallback copy no longer exposes Firebase Storage path/hash language.
- Android already kept manually selected cues stable; this is now the cross-platform behavior.

## Pilot Cue Content

New file:

```text
scripts/workout-coaching-cues-pilot.json
```

Pilot exercises:

1. `goblet_squat`
2. `push_up`
3. `lat_pulldown`
4. `dumbbell_biceps_curl`
5. `romanian_deadlift`

New apply utility:

```text
node scripts/apply-workout-coaching-cues.js
node scripts/apply-workout-coaching-cues.js --apply --admin-uid <uid>
```

Dry-run validates the cue file only.

Apply mode:

- requires `--admin-uid`
- verifies `/admins/{uid}` exists
- merges only `coachingCues`, `coachingCuesUpdatedAt`, and `coachingCuesUpdatedBy` onto `exerciseCatalog/{id}`
- does not reseed or overwrite exercise metadata/assets

## Verification

Commands run:

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/workoutsWebLibrary.test.js --watchAll=false --runInBand
```

Result:

```text
PASS, 10 tests
```

```text
xcodebuild -project TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination 'generic/platform=iOS' -derivedDataPath build/DerivedDataCoachModeVerify build
```

Result:

```text
BUILD SUCCEEDED
```

```text
xcodebuild -project TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination 'id=227132E2-D637-4C61-AA8D-A32F61EB0105' -derivedDataPath build/DerivedDataCoachModeTest test -only-testing:TribeLogTests/WorkoutCatalogTests
```

Result:

```text
TEST SUCCEEDED, 12 tests
```

The same iOS test target was rerun after removing the technical cache/status copy:

```text
xcodebuild -project TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination 'id=227132E2-D637-4C61-AA8D-A32F61EB0105' -derivedDataPath build/DerivedDataCoachModeTest test -only-testing:TribeLogTests/WorkoutCatalogTests
```

Result:

```text
TEST SUCCEEDED, 12 tests
```

After adding stable selected-cue behavior and scrubbing remaining developer-facing motion labels, these focused checks were rerun:

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/workoutsWebLibrary.test.js --watchAll=false --runInBand
```

Result:

```text
PASS, 10 tests
```

```text
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew :app:testDebugUnitTest --tests '*WorkoutCatalogTest'
```

Result:

```text
BUILD SUCCESSFUL
```

```text
xcodebuild -project TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination 'id=227132E2-D637-4C61-AA8D-A32F61EB0105' -derivedDataPath build/DerivedDataCoachModeTest test -only-testing:TribeLogTests/WorkoutCatalogTests
```

Result:

```text
TEST SUCCEEDED, 12 tests
```

Motion preview label scan:

```text
No remaining matches for PLAYING/FRAMES, frames cached, Cached, Manifest ready, Fallback active, Storage path, asset hash, or Loading asset in the Web/iOS/Android workout preview UI files.
```

```text
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew :app:testDebugUnitTest --tests '*WorkoutCatalogTest'
```

Result:

```text
BUILD SUCCESSFUL
```

## Review Questions For Claude

1. Does the exercise detail now feel like guided coaching rather than static instructions?
2. Is the fallback cue strategy acceptable for all 50 exercises while we add real timed cue data in batches?
3. Should active cue auto-rotation remain, or should cues change only on user tap until frame-sync exists?
4. Is the pilot cue content safe, clear, and free of unsupported health/medical claims?
5. Are `startPercent` / `endPercent` good enough for v1, or should we require exact Lottie frame ranges before applying cues to live Firestore?
6. Is the apply script scoped safely enough for live use after approval?
7. Is the selected-cue behavior right: auto-advance before interaction, but lock the user's tapped cue for the current exercise?
8. Is all remaining motion-preview copy user-facing enough for release?

## Known Gaps

- Cues are not yet frame-synced to the actual Lottie playback.
- Optional `startFrame` / `endFrame` can be parsed, but authored cue files still use percent ranges only.
- Web still uses the existing placeholder-style `ExerciseMotionPreview` instead of full lottie-web rendering in this component.
- iOS uses a WKWebView-backed preview from the prior animation fix, not native `lottie-ios`.
- Pilot cues are only authored for 5 exercises.
- No screenshots/video captured in this side checkpoint yet.

## Recommended Next Step

If Claude approves:

1. Apply the 5 pilot cues to Firestore.
2. Capture Web/iOS/Android screenshots of those 5 details.
3. Add timed cues in batches of 10 for the remaining exercises.
4. Replace percent-only cue rotation with frame-aware cue selection when the Lottie player exposes current frame/progress.

If Claude blocks:

1. Fix cue UX/content first.
2. Do not apply pilot cues to live Firestore.
3. Do not expand cue content to all 50 until the interaction model is approved.
