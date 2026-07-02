# TribeLog Workouts Full Cue Draft v1 - Claude Checkpoint

Status date: 2026-07-01
Implementation owner: Codex
Review owner: Claude
Product owner: Navdeep

## Verdict Requested

Please review this as a coaching-copy and content-safety checkpoint.

Use one of:

- `APPROVED`
- `APPROVED WITH FIXES`
- `BLOCKED`
- `REVIEW INCONCLUSIVE`

## Context

Coach Mode v1 introduced an optional backend field named `coachingCues`. This checkpoint extends that work by producing a local draft cue pack for all 50 official Phase 1 exercises.

Nothing has been applied to live Firestore yet.

## What Changed

New files:

```text
scripts/generate-workout-coaching-cues-draft.js
scripts/render-workout-coaching-cues-review-board.js
scripts/workout-coaching-cues-full-draft.json
docs/workouts/review-packs/coach-mode-full-cues-review-board-2026-07-01.html
```

Updated files:

```text
scripts/apply-workout-coaching-cues.js
src/__tests__/workoutsWebLibrary.test.js
```

## Content Model

Each official exercise now has exactly four draft coaching cues:

```json
{
  "id": "bench_press",
  "coachingCues": [
    {
      "id": "setup",
      "phase": "setup",
      "title": "Set the base first",
      "body": "Set your grip and brace before the first rep. Keep chest ready to do the work.",
      "startPercent": 0,
      "endPercent": 18,
      "focusMuscles": ["chest", "core"],
      "view": "front"
    }
  ]
}
```

`startPercent` / `endPercent` are required. Optional `startFrame` / `endFrame` are supported by the Web, iOS, Android parsers and by the apply validator, but this full draft intentionally remains percent-only until Claude approves whether exact frame authoring is required before live apply.

The five hand-authored pilot exercises remain preserved:

1. `goblet_squat`
2. `push_up`
3. `lat_pulldown`
4. `dumbbell_biceps_curl`
5. `romanian_deadlift`

The other 45 exercises are generated from movement-specific templates:

- push
- pull
- squat
- hinge
- core
- cardio
- mobility
- special cases for curls, lateral raises, flys, triceps, dips, machine isolation, calf raises, rows, vertical pulls, and rear delt movements

## Validation Added

The apply validator now rejects obvious medical or unsupported-claim wording:

```text
cure, treat, diagnose, heal, rehab, therapy, injury, pain-free, guarantee, medical, doctor, clinical
```

It also exposes `validateCueCoverage(records, seedExercises)` to ensure:

- every official exercise has cue coverage
- no duplicate cue records exist
- no cue record targets a non-official exercise id

Optional frame validation is also in place:

- cue records must provide both `startFrame` and `endFrame`, or neither
- frame values must be non-negative integers
- `endFrame` must be greater than or equal to `startFrame`

## Verification

Commands run:

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/generate-workout-coaching-cues-draft.js
```

Result:

```text
Generated 50 coaching cue records
```

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/apply-workout-coaching-cues.js --file scripts/workout-coaching-cues-full-draft.json
```

Result:

```text
Validated 50 workout coaching cue records
```

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/workoutsWebLibrary.test.js --watchAll=false --runInBand
```

Result:

```text
PASS, 10 tests
```

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/render-workout-coaching-cues-review-board.js
```

Result:

```text
Rendered cue review board
```

## Review Questions For Claude

1. Is it acceptable to use this template-generated full draft as the first content base, with manual refinement after screenshots?
2. Which exercise families need more custom copy before live Firestore apply?
3. Are the generated cues too generic for a premium coaching feel?
4. Are the movement phases consistent enough for later frame-aware cue sync?
5. Should any exercises require exact `startFrame` / `endFrame` before live apply, or is percent-only acceptable for the first content pass?
6. Are the banned-claim terms sufficient for production safety, or should the validator catch more language?
7. Should the five hand-authored pilot cues be applied first, or should we wait and apply all 50 after this full cue review?
8. Does the HTML review board make it easy enough to spot repeated or generic copy?

## Known Gaps

- The full draft is generated from templates, not written exercise-by-exercise by a coach.
- Cue text is not yet frame-synced to actual Lottie progress.
- Optional `startFrame` / `endFrame` can be parsed and validated, but this draft does not author frame-specific cue ranges yet.
- Some movement families intentionally share cue structure for consistency.
- There are no screenshots showing all 50 cues in UI yet.
- The validator catches obvious claim language, not every possible risky phrase.

## Recommended Next Step

If Claude approves:

1. Apply the five pilot cues first.
2. Capture Web/iOS/Android screenshots for the five pilot exercises.
3. Apply the full 50-cue draft only after screenshot review.

If Claude requests copy fixes:

1. Update the generator templates or add per-exercise overrides.
2. Regenerate `workout-coaching-cues-full-draft.json`.
3. Rerun cue validation and web tests.

If Claude blocks:

1. Do not apply cue data to Firestore.
2. Rewrite the content model before expanding beyond pilot cues.
