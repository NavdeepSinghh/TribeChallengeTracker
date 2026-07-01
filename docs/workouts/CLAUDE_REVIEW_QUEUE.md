# Claude Review Queue: Workouts

Status date: 2026-07-01  
Current next reviews:

1. Coach Mode v1
2. Full Cue Draft v1
3. High-Fidelity Animation Design Spec + POC Manifest
4. High-Fidelity Client Video Playback Prep

## Next Review Item

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/coach-mode-v1-claude-checkpoint-2026-07-01.md
```

Then review:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/coach-mode-full-cues-claude-checkpoint-2026-07-01.md
```

Then review:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/high-fidelity-animation-claude-design-spec-2026-07-01.md
```

Then review the POC manifest checklist:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-animation-poc-checklist-2026-07-01.html
```

Then review:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/high-fidelity-client-video-playback-checkpoint-2026-07-01.md
```

Optional zip pack:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/coach-mode-v1-review-pack-2026-07-01.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/coach-mode-plus-full-cues-review-pack-2026-07-01.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-animation-design-pack-2026-07-01.zip
```

Full cue draft files:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/generate-workout-coaching-cues-draft.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/render-workout-coaching-cues-review-board.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/workout-coaching-cues-full-draft.json
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/coach-mode-full-cues-review-board-2026-07-01.html
```

High-fidelity POC manifest files:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/workout-high-fidelity-media-poc.json
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/validate-workout-high-fidelity-media.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/apply-workout-high-fidelity-media.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/render-workout-high-fidelity-poc-checklist.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-animation-poc-checklist-2026-07-01.html
```

## Why This Needs Review

Navdeep wants the exercise detail experience to feel more like an interactive coach:

- animation remains visible
- selected text explains how to move
- static instructions move lower in priority
- cue content can be backend-driven over time
- selected cue behavior is now consistent: cues may auto-advance before interaction, but tapping a cue locks that selected text for the current exercise

Navdeep also wants future workout animations to move toward a more realistic 3D/high-fidelity style. That design work is separated from the current working Lottie pipeline and requires Claude Design approval before Codex scales it to all 50 exercises.

This checkpoint implements that direction across Web, iOS, and Android with a small pilot cue content path.

## Files To Review

### Web

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/domain/workoutCatalogModels.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/presentation/WorkoutsLibrarySection.jsx
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/__tests__/workoutsWebLibrary.test.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/package.json
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/package-lock.json
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/workout-coaching-cues-pilot.json
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/apply-workout-coaching-cues.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/workout-high-fidelity-media-poc.json
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/validate-workout-high-fidelity-media.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/apply-workout-high-fidelity-media.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/render-workout-high-fidelity-poc-checklist.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/high-fidelity-animation-claude-design-spec-2026-07-01.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/high-fidelity-client-video-playback-checkpoint-2026-07-01.md
```

### iOS

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/WorkoutCatalogModels.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/FirestoreWorkoutCatalogRepository.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/WorkoutAssetCache.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Views/WorkoutCatalogSection.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeLogTests/WorkoutCatalogTests.swift
```

### Android

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/WorkoutCatalogModels.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/data/FirestoreWorkoutCatalogRepository.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/WorkoutCatalogSection.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/test/java/com/risewiththetribe/challengetracker/workouts/WorkoutCatalogTest.kt
```

## Verification Already Run

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/workoutsWebLibrary.test.js --watchAll=false --runInBand
```

Result: `PASS, 10 tests`

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/apply-workout-coaching-cues.js
```

Result: `Validated 5 workout coaching cue records`

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/generate-workout-coaching-cues-draft.js
```

Result: `Generated 50 coaching cue records`

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/apply-workout-coaching-cues.js --file scripts/workout-coaching-cues-full-draft.json
```

Result: `Validated 50 workout coaching cue records`

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/render-workout-coaching-cues-review-board.js
```

Result: `Rendered cue review board`

```text
xcodebuild -project TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination 'generic/platform=iOS' -derivedDataPath build/DerivedDataCoachModeVerify build
```

Result: `BUILD SUCCEEDED`

```text
xcodebuild -project TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination 'id=227132E2-D637-4C61-AA8D-A32F61EB0105' -derivedDataPath build/DerivedDataCoachModeTest test -only-testing:TribeLogTests/WorkoutCatalogTests
```

Result: `TEST SUCCEEDED, 12 tests`

The same iOS test target was rerun after removing technical cache/status copy from the motion preview.

```text
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew :app:testDebugUnitTest --tests '*WorkoutCatalogTest'
```

Result: `BUILD SUCCESSFUL`

Latest polish verification:

```text
No remaining matches for PLAYING/FRAMES, frames cached, Cached, Manifest ready, Fallback active, Storage path, asset hash, or Loading asset in the Web/iOS/Android workout preview UI files.
```

High-fidelity animation prep verification:

```text
Web WorkoutCatalog tests pass with mediaManifest parsing and video-source selection coverage.
Web WorkoutCatalog tests pass with future video rendering coverage.
iOS WorkoutCatalog tests pass with native AVKit video branch compiled.
Android WorkoutCatalog tests pass with native VideoView branch compiled.
iOS WorkoutCatalog tests pass with mediaManifest parsing coverage.
Android WorkoutCatalog tests pass with mediaManifest parsing coverage.
Planned high-fidelity POC manifest validates locally.
High-fidelity media apply script rejects planned records as expected.
High-fidelity POC checklist HTML renders locally.
No live Firestore media records were applied.
```

## Paste Prompt For Claude

```text
You are reviewing three TribeLog Workouts checkpoints:

1. Coach Mode v1
2. Full Cue Draft v1
3. High-Fidelity Animation Design Spec + POC Manifest
4. High-Fidelity Client Video Playback Prep

Context:
- TribeLog is a fitness challenge tracker app.
- Workouts is backend-driven across Web, iOS, and Android.
- Brand lock: #FF6B35 orange, #040404 near-black, Syne 900 headlines, Space Grotesk body.
- Architecture lock: MVVM + Clean Architecture inside the Workouts feature boundary.
- Product goal for this checkpoint: make exercise detail feel like a guided movement coach instead of animation + static instructions.
- Cue contract requires startPercent/endPercent and now accepts optional startFrame/endFrame for later exact Lottie sync. UI still uses percent/timed cue selection until frame-aware player progress is wired.
- Web/iOS no longer keep auto-rotating after the user manually selects a cue; Android already behaved this way.
- Motion preview fallback/status copy was scrubbed to avoid raw frame counts, cache details, Firebase Storage paths, or asset hashes in user-facing UI.

Review this file first:
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/coach-mode-v1-claude-checkpoint-2026-07-01.md

Then review this file:
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/coach-mode-full-cues-claude-checkpoint-2026-07-01.md

Then review this file:
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/high-fidelity-animation-claude-design-spec-2026-07-01.md

Then review this checklist:
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-animation-poc-checklist-2026-07-01.html

Then review this file:
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/high-fidelity-client-video-playback-checkpoint-2026-07-01.md

Then review the changed files listed in the checkpoints.

Please answer:
1. Verdict: APPROVED, APPROVED WITH FIXES, BLOCKED, or REVIEW INCONCLUSIVE.
2. Does the detail screen now feel like guided coaching?
3. Is the optional backend `coachingCues` contract acceptable?
4. Is fallback from `formCues + instructions` acceptable for all 50 exercises while real cue data is authored in batches?
5. Should cues auto-rotate now, or only change on tap until exact Lottie frame sync exists?
6. Is the pilot cue copy safe and free from unsupported health or medical claims?
7. Is the apply script scoped safely enough for live Firestore use after approval?
8. Should any cues require authored startFrame/endFrame before live Firestore apply, or is percent-only acceptable for the first content pass?
9. Does the iOS motion preview copy feel user-facing now that technical cache/frame language is removed?
10. Is the selected-cue behavior right: auto-advance before interaction, then lock the user's tapped cue for that exercise?
11. Is all remaining motion-preview copy user-facing enough for release?
12. What must Codex fix before applying pilot cues to live Firestore?
13. Is the generated 50-exercise cue draft acceptable as a content base?
14. Which exercise families need custom copy before live Firestore apply?
15. Should we apply only the five pilot cues first, or wait and apply all 50 after full cue review?
16. Is the high-fidelity animation spec safe, distinct from competitor references, and suitable for a five-exercise POC?
17. Is the planned five-exercise media manifest/checklist acceptable?
18. Are the render briefs specific enough for Claude Design or an asset pipeline to produce realistic motion?
19. Does the validator correctly keep planned media out of release-ready/live Firestore paths until real hashes exist?
20. Is the client video playback prep acceptable and still safe with current Lottie fallback?
21. Is lightweight native playback through AVKit/VideoView enough for the five-asset POC, or should we move to a richer player later?
22. Is the high-fidelity media apply script strict enough for later live Firestore rollout?
23. Should Codex proceed with only schema/pipeline prep, or start generating the five high-fidelity POC assets?

Separate blockers from nice-to-haves. Include a copy-paste response for Codex at the end.
```

## Pending After Claude Approval

1. Apply the 5 pilot cue records to Firestore with:

```text
node scripts/apply-workout-coaching-cues.js --apply --admin-uid <uid>
```

2. Capture Web, iOS, and Android screenshots of the five pilot details.
3. Review and refine the generated full 50-exercise cue draft.
4. Later: make cue changes frame-aware using real Lottie progress instead of timed auto-rotation.
