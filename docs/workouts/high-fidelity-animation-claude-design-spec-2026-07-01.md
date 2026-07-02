# TribeLog High-Fidelity Workout Animation Design Spec

Status date: 2026-07-01
Owner: Navdeep
Design review: Claude Design
Implementation: Codex

## Purpose

Navdeep wants TribeLog workout animations to move beyond simple vector demos toward a premium, realistic trainer experience: a human body performing the exercise, relevant equipment, highlighted target muscles, and selected coaching text explaining the movement.

This spec is for Claude Design to define the visual direction before Codex generates or replaces the full 50-exercise animation set.

## Important Constraint

Do not copy MyFitCoach, Hevy, Strong, or any competitor's exact art direction, model, labels, layouts, colors, or animation poses.

Use the reference only to understand the quality bar:

- realistic body form
- visible exercise motion
- highlighted target muscles
- relevant equipment
- strong mobile-first composition

TribeLog should feel like its own product: dark, focused, community-driven, orange brand energy, less ad-like, more useful during a workout.

## TribeLog Visual Direction

Recommended style:

- Premium 3D or 2.5D rendered human figure
- Athletic but non-sexualized body proportions
- Gender-neutral default where possible, or matched male/female variants later
- Target muscles highlighted with translucent TribeLog orange/cyan overlays
- Secondary muscles shown with softer salmon/teal overlays
- Equipment included only when it clarifies the exercise
- Dark near-black background with subtle depth lighting
- Brand accent: `#FF6B35`
- Base dark: `#040404`
- Typography in UI remains Syne/Space Grotesk; animation assets should not bake in app UI text unless used only as marketing posters

Avoid:

- medical anatomy gore
- hypersexualized bodies
- unrealistic bodybuilding proportions
- fake transformation claims
- aggressive injury/rehab language
- cluttered gym backgrounds
- baked-in competitor-style text labels

## Product Experience Goal

The animation should answer three user questions immediately:

1. What movement am I doing?
2. Which muscles should I feel?
3. What should I focus on during this phase?

The animation pairs with Coach Mode cue cards:

- setup cue
- lowering/loading cue
- working/pressing/pulling cue
- finish/reset cue

Each POC brief now includes a `phaseTimeline` that maps those cues to `0-100%` motion progress. Claude Design should verify that the visible motion supports those cue ranges before Codex generates final assets. Text should still live in Coach Mode UI, not be baked into the video.

The manifest validator now locks each POC exercise's `phaseTimeline.cueId` sequence to the approved Coach Mode cue draft. This prevents design handoff drift where a realistic animation is approved against labels that no longer match the selected cue text shown in the app.

## Proof Of Concept Scope

Design and review only five exercises first:

1. `goblet_squat`
2. `push_up`
3. `lat_pulldown`
4. `romanian_deadlift`
5. `bulgarian_split_squat`

These cover:

- bodyweight movement
- loaded free-weight movement
- cable/machine equipment
- hinge pattern
- single-leg pattern
- front/side/back muscle highlight needs

Do not scale to all 50 until these five are approved.

## Required POC Outputs

For each of the five exercises, Claude Design should provide:

1. One still frame/poster direction
2. One short loop direction, 2-4 seconds
3. Primary and secondary muscle highlight notes
4. Camera angle recommendation: front, side, three-quarter, or back
5. Equipment requirements
6. Form cue overlay recommendation
7. What not to show
8. Cue timeline review against the Coach Mode text phases

## Asset Format Recommendation

Use rendered video for the high-fidelity animation layer:

- `demo.mp4` for iOS/Android compatibility
- `demo.webm` optional for Web
- `poster.webp` for loading state and exercise cards
- existing Lottie remains fallback
- existing SVG muscle maps remain fallback/reference

Do not force Lottie for realistic 3D bodies. Lottie remains useful for lightweight vector fallback, but realistic body/equipment motion should be video or rendered image sequence.

## Proposed Storage Convention

```text
workouts/exercises/v2/{exerciseId}/demo.mp4
workouts/exercises/v2/{exerciseId}/demo.webm
workouts/exercises/v2/{exerciseId}/poster.webp
```

## Proposed Backend Contract

Keep existing `assetManifest` untouched. Add optional `mediaManifest`:

```json
{
  "mediaManifest": {
    "preferredMotion": "video",
    "videoPath": "workouts/exercises/v2/goblet_squat/demo.mp4",
    "posterPath": "workouts/exercises/v2/goblet_squat/poster.webp",
    "previewPath": "workouts/exercises/v2/goblet_squat/demo.webm",
    "styleVersion": "tribelog-3d-v1",
    "mediaVersion": 1,
    "mediaHash": "sha256:...",
    "durationMs": 3200,
    "frameRate": 30
  }
}
```

Fallback rule:

- If `mediaManifest.preferredMotion == "video"` and `videoPath` exists, clients may render video.
- Otherwise, clients render current `assetManifest.lottiePath`.
- Existing `assetManifest` remains required until high-fidelity media coverage is complete.

The POC render brief also carries non-release `phaseTimeline` metadata for design review:

```json
{
  "renderBrief": {
    "phaseTimeline": [
      { "cueId": "setup", "label": "Set stance and brace", "startPercent": 0, "endPercent": 22 },
      { "cueId": "lower", "label": "Hips descend under control", "startPercent": 22, "endPercent": 54 },
      { "cueId": "drive", "label": "Drive through mid-foot", "startPercent": 54, "endPercent": 84 },
      { "cueId": "reset", "label": "Stand tall and reset", "startPercent": 84, "endPercent": 100 }
    ]
  }
}
```

This timeline helps Claude Design check whether the animation loop supports the selected text experience. It should not replace backend `coachingCues`; it is a render brief constraint.

## Motion Guidelines

Each exercise loop should show:

- clean start position
- working phase
- end position
- controlled return
- no unsafe range exaggeration
- no speed that encourages rushing

Loop should feel smooth at 30 fps.

Recommended durations:

- strength reps: 2.8-4.0 seconds
- holds/planks: 2.0-3.0 seconds with subtle breathing/tension
- cardio: 1.5-2.5 seconds
- mobility: 3.0-5.0 seconds

## Muscle Highlight Guidelines

Primary muscles:

- TribeLog orange/cyan glow overlay
- visible during the working phase
- not so bright that anatomy becomes cartoonish

Secondary muscles:

- softer salmon/teal overlay
- lower opacity

Inactive muscles:

- natural skin/body material
- no heavy labels baked into the animation

Coach Mode should carry text labels; animation should carry visual clarity.

## Five POC Exercise Directions

### Goblet Squat

- Camera: side + slight three-quarter
- Equipment: kettlebell or dumbbell held at chest
- Primary: quads, glutes
- Secondary: core
- Key motion: hips descend, knees track over toes, chest tall
- Avoid: knees collapsing, torso folding forward too much

### Push-Up

- Camera: side
- Equipment: bodyweight only
- Primary: chest, triceps
- Secondary: core, shoulders
- Key motion: body in one line, elbows controlled, chest lowers toward floor
- Avoid: sagging hips, head craning forward

### Lat Pulldown

- Camera: front or three-quarter
- Equipment: lat pulldown machine/cable
- Primary: lats
- Secondary: biceps, upper back
- Key motion: elbows drive down, shoulders stay away from ears
- Avoid: leaning too far back, yanking the bar

### Romanian Deadlift

- Camera: side
- Equipment: barbell or dumbbells
- Primary: hamstrings, glutes
- Secondary: lower back/core
- Key motion: hips hinge back, spine neutral, soft knees
- Avoid: rounded back, squat-like knee bend

### Bulgarian Split Squat

- Camera: side or three-quarter
- Equipment: bench and optional dumbbells
- Primary: quads, glutes
- Secondary: hamstrings, core
- Key motion: front knee tracks, back foot elevated, controlled descent
- Avoid: front heel lifting, knee collapse, excessive forward lean

## Claude Design Review Questions

Please answer:

1. Is the proposed high-fidelity style direction distinct enough from competitor references?
2. Should TribeLog use a realistic 3D model, stylized 3D model, or 2.5D illustrated render?
3. Should the body model be gender-neutral, alternate male/female, or use a simplified athletic figure?
4. Are orange/cyan muscle highlights acceptable, or should we use brand orange plus salmon only?
5. Should equipment be realistic, simplified, or only shown when necessary?
6. Should the animation include any baked-in labels, or should all text remain in Coach Mode UI?
7. Are the five POC exercises the right review set?
8. What are blockers before Codex builds the POC pipeline?
9. Do the proposed cue timelines match the intended motion phases for each POC exercise?

## Acceptance Criteria Before Scaling

Claude Design must approve:

- one still frame style
- one motion style
- body proportions
- muscle highlight treatment
- background/lighting
- equipment treatment
- no-copy risk from competitor references
- accessibility and readability on mobile
- cue timeline compatibility with Coach Mode

Only after that should Codex generate or commission the remaining 45 high-fidelity animations.

## Codex Implementation Notes

Codex has prepared an optional `mediaManifest` contract in Web, iOS, and Android so approved high-fidelity assets can be introduced without breaking the current Lottie pipeline.

Current status:

- Existing `assetManifest` remains the production fallback.
- Web can select and render a future `mediaManifest.videoPath` when `preferredMotion` is `video`.
- Web video rendering supports `demo.webm` first, `demo.mp4` fallback, `poster.webp`, and a friendly motion-unavailable state.
- iOS can render future `demo.mp4` assets through native `AVKit.VideoPlayer`.
- Android can render future `demo.mp4` assets through platform `VideoView`.
- Native real-video QA should wait for actual Claude-approved POC assets.
- A five-exercise planned POC media manifest is available for Claude review.
- The planned POC manifest validates locally but intentionally fails release-ready validation until real `demo.mp4`, `demo.webm`, and `poster.webp` assets are created and hashed.
- No live Firestore media records have been applied.

Planned POC files:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/workout-high-fidelity-media-poc.json
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/validate-workout-high-fidelity-media.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/apply-workout-high-fidelity-media.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/render-workout-high-fidelity-poc-checklist.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-animation-poc-checklist-2026-07-01.html
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/high-fidelity-client-video-playback-checkpoint-2026-07-01.md
```

Additional motion-board checkpoint prepared after Claude approved frame-aware cue sync:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/render-workout-high-fidelity-motion-board.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/high-fidelity-motion-poc-board-claude-checkpoint-2026-07-02.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-motion-poc-board-2026-07-02.html
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-motion-poc-board-screenshot-2026-07-02.png
```

The motion board is still a prototype and should not be treated as release media. It demonstrates the desired app experience: realistic motion direction paired with selected Coach Mode text, while real production media remains gated on Claude Design approval and final MP4/WebM/poster generation.

### Production Asset Briefs Update (2026-07-02)

Codex added a production-brief generator for the five high-fidelity POC exercises. This is the handoff layer between the prototype motion board and real media generation:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/render-workout-high-fidelity-production-briefs.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/high-fidelity-production-asset-briefs-claude-checkpoint-2026-07-02.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-production-asset-briefs-2026-07-02.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-production-asset-briefs-2026-07-02.html
```

The briefs define exact MP4/WebM/poster storage paths, duration/fps targets, phase-aligned prompts, mobile file-size budgets, and QA checks. They explicitly keep text/cues in the app layer and reject competitor UI, logos, watermarks, unsupported claims, or sexualized body proportions.

The POC manifest currently covers:

```text
goblet_squat
push_up
lat_pulldown
romanian_deadlift
bulgarian_split_squat
```

Each record includes the planned storage paths, render brief, target muscles, equipment, movement focus, and "avoid" notes. This is design/pipeline prep only; it is not live catalog data.

Changed files for this local preparation:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/domain/workoutCatalogModels.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/presentation/WorkoutsLibrarySection.jsx
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/__tests__/workoutsWebLibrary.test.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/workout-high-fidelity-media-poc.json
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/validate-workout-high-fidelity-media.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/apply-workout-high-fidelity-media.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/render-workout-high-fidelity-poc-checklist.js
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/WorkoutCatalogModels.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/FirestoreWorkoutCatalogRepository.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeLogTests/WorkoutCatalogTests.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/WorkoutCatalogModels.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/data/FirestoreWorkoutCatalogRepository.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/test/java/com/risewiththetribe/challengetracker/workouts/WorkoutCatalogTest.kt
```

Verification:

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
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/render-workout-high-fidelity-poc-checklist.js
```

Result:

```text
Rendered high-fidelity POC checklist
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
