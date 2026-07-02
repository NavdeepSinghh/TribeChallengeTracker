# Claude Checkpoint: High-Fidelity Production Asset Briefs

Status date: 2026-07-02

Scope: production-ready generation briefs for the five high-fidelity workout media POC assets.

## Verdict Request

Please review this as a prep checkpoint before any real `demo.mp4`, `demo.webm`, or `poster.webp` assets are generated or applied to Firestore.

Requested verdict: `APPROVED`, `APPROVED WITH FIXES`, `BLOCKED`, or `REVIEW INCONCLUSIVE`.

## Why This Exists

Navdeep wants the workout animations to feel more realistic, closer to high-quality fitness app demonstrations, while still staying distinctly TribeLog:

- dark near-black training studio
- subtle teal rim light
- brand orange used for tasteful muscle glow only
- realistic adult athlete proportions
- no baked-in text, app UI, social-media UI, logos, watermarks, or competitor lookalikes
- Coach Mode text stays in the app layer and syncs to motion progress

The existing Lottie/SVG exercise assets remain the production fallback. This checkpoint does not change live Firestore records.

## What Changed

Added a production-brief renderer:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/render-workout-high-fidelity-production-briefs.js
```

It reads the already-validated five-exercise POC manifest:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/workout-high-fidelity-media-poc.json
```

It renders two review artifacts:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-production-asset-briefs-2026-07-02.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-production-asset-briefs-2026-07-02.html
```

Added focused tests:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/__tests__/workoutHighFidelityProductionBriefs.test.js
```

## What The Briefs Include

For each of the five POC exercises:

- exact Storage paths:
  - `workouts/exercises/v2/{exerciseId}/demo.mp4`
  - `workouts/exercises/v2/{exerciseId}/demo.webm`
  - `workouts/exercises/v2/{exerciseId}/poster.webp`
- target duration and frame rate from the manifest
- mobile-oriented camera direction
- primary and secondary muscle emphasis
- phase-aligned cue timeline in seconds and percentages
- video-generation prompt
- poster-generation prompt
- QA checklist
- file-size budget:
  - MP4 <= 3 MB
  - WebM <= 2 MB
  - poster <= 250 KB

## Guardrails

- No generated media may contain baked-in text, labels, captions, app UI, logos, watermarks, timers, or social-media reaction UI.
- No medical, diagnosis, treatment, pain-free, guarantee, or clinical claims.
- No competitor names or competitor UI references in generated prompts.
- No sexualized body proportions.
- Muscle highlights must be subtle and anatomical.
- Cue text remains in TribeLog Coach Mode UI, not in the asset.
- Current Lottie/SVG `assetManifest` fallback remains intact.
- Existing apply script still refuses planned media and requires release-ready hashes.

## Verification

Production brief render:

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/render-workout-high-fidelity-production-briefs.js
```

Result:

```text
Rendered high-fidelity production briefs to /Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-production-asset-briefs-2026-07-02.md
Rendered high-fidelity production briefs board to /Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-production-asset-briefs-2026-07-02.html
```

Manifest validation:

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/validate-workout-high-fidelity-media.js
```

Result:

```text
Validated 5 high-fidelity workout media POC records.
```

Focused tests:

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/workoutHighFidelityProductionBriefs.test.js --watchAll=false --runInBand
```

Result:

```text
PASS, 3/3 tests
```

## Known Gaps

- No real MP4/WebM/poster assets were generated in this checkpoint.
- No files were uploaded to Firebase Storage.
- No live Firestore `mediaManifest` records were updated.
- Real high-fidelity media still needs Claude Design approval before generation and batch rollout.

## Review Questions For Claude

1. Are these production asset briefs specific enough for Claude Design or another asset pipeline to generate the five real POC media files?
2. Are the prompts distinct enough from the competitor/reel-style references Navdeep shared?
3. Are the file-size budgets realistic for mobile workout detail screens?
4. Is the instruction to keep cue text in the app layer strong enough?
5. Should any exercise brief be adjusted before real media generation starts?
6. Is this checkpoint enough to proceed to generating the first real POC asset, or should the motion board be revised first?
