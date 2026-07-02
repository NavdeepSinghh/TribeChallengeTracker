# Claude Checkpoint 21: Library Expansion To 200+

Status date: 2026-07-01
Verdict requested: catalog scope + asset pipeline review
Scope: 150-exercise expansion candidate backlog and validation guardrails toward a 200-exercise official library.

## Requested Verdict

Please return one of:

- APPROVED
- APPROVED WITH FIXES
- BLOCKED
- REVIEW INCONCLUSIVE

## Important Scope Note

This checkpoint does not claim that 150 new exercise assets are finished.

It creates the reviewed backlog and validation guardrails for the expansion from 50 official exercises to 200 official exercises. Asset generation should still happen in Claude-reviewed batches of 10-15.

## What Changed

- Added `workout-exercise-expansion-candidates.json`.
- Added validator for expansion candidates.
- Added tests for:
  - total candidate count
  - stable ID generation
  - duplicate prevention
  - unsupported health/medical claim prevention
  - count drift prevention

## Key Files

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/workout-exercise-expansion-candidates.json
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/validate-workout-exercise-expansion-candidates.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/__tests__/workoutExerciseExpansionCandidates.test.js
```

## Candidate Coverage

| Group | Count | Notes |
|---|---:|---|
| Upper push | 25 | Chest, shoulders, triceps |
| Upper pull | 25 | Lats, upper back, biceps, forearms |
| Lower body | 35 | Quads, hamstrings, glutes, calves |
| Core | 20 | Abs, obliques, lower back |
| Cardio | 23 | Machines, intervals, outdoor work, bodyweight conditioning |
| Mobility | 20 | Hips, shoulders, spine, ankles |
| Power | 2 | Accessible explosive movements only |
| **Total** | **150** | 50 existing + 150 candidates = 200 official exercises |

## Claude Review Follow-Up

Claude first-pass verdict:

```text
APPROVED WITH ONE DEFERRAL AND ONE STRUCTURAL RECOMMENDATION
```

Applied follow-up:

- Deferred high-skill power/Olympic-style movements to Phase 4 Coach Pro.
- Kept only two self-serve power candidates in this planning backlog:
  - Medicine Ball Slam
  - Box Jump
- Reallocated the removed candidate capacity into cardio depth so the plan still reaches 150 candidates and 200 official exercises total.
- Added a locked `metadataVocabulary` section for equipment and levels. Equipment/level can still be assigned per generation batch, but generated seed docs must use the locked vocabulary.
- Added validator coverage so deferred Coach Pro candidates cannot quietly re-enter the active expansion list.

Deferred to Phase 4 Coach Pro:

```text
Clean Pull
Hang Power Clean
Power Snatch
Dumbbell Snatch
Kettlebell Clean
Kettlebell Snatch
Broad Jump
Slam Ball Overhead Throw
```

Rationale: these patterns need coach-authored cues, richer video, and stronger safety context before appearing in a self-serve official library.

## Locked Metadata Vocabulary

Equipment and level metadata may land per batch, but the vocabulary is now locked at candidate-list stage to avoid fragmented filters at 200+ exercises.

Level vocabulary:

```text
beginner
intermediate
advanced
```

Equipment vocabulary:

```text
bodyweight
dumbbell
barbell
kettlebell
cable
machine
bench
band
medicine_ball
slam_ball
box
sled
smith_machine
trap_bar
landmine
rings
plate
ab_wheel
stability_ball
treadmill
stationary_bike
rowing_machine
elliptical
stair_climber
assault_bike
skierg
jump_rope
battle_rope
pool
outdoor
```

## Asset Review Policy

```text
Generate in batches of 10-15 and require visual review before upload.
```

Recommended batch sequence:

1. Upper Push Expansion A
2. Upper Push Expansion B
3. Upper Pull Expansion A
4. Upper Pull Expansion B
5. Lower Body Expansion A
6. Lower Body Expansion B
7. Lower Body Expansion C
8. Core Expansion
9. Cardio Expansion
10. Mobility Expansion A
11. Mobility Expansion B
12. Cardio Expansion B
13. Power Expansion

## Validation Rules

The validator enforces:

- plan status is valid
- target total is reachable
- exact 150 candidate count
- valid categories
- group-level primary muscles
- stable snake_case IDs from exercise names
- no duplicate exercise IDs
- no unsupported claim language
- locked equipment and level vocabulary
- deferred Coach Pro candidates cannot overlap active candidates

## Verification

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTracker
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/validate-workout-exercise-expansion-candidates.js
```

Result:

```text
Validated 150 expansion candidates across 7 groups.
```

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTracker
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/workoutExerciseExpansionCandidates.test.js --watchAll=false --runInBand
```

Result:

```text
PASS, 5 tests.
```

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTracker
git diff --check
```

Result: passed.

## Known Gaps

Blockers:

- Claude/Navdeep should approve the candidate list before Codex generates the 150 new assets.

Non-blocking gaps:

- No new Lottie/SVG/WebP assets are generated in this checkpoint.
- No Firestore seed documents are generated in this checkpoint.
- Equipment, level, and detailed cue metadata will need to be added per batch before upload using the locked vocabulary above.
- The high-fidelity animation direction may change asset requirements before generating all candidates.
- Claude can audit the actual 150-name list during per-batch review; this checkpoint keeps the safer power deferral now and leaves detailed form-risk review to each 10-15 exercise batch.

## Phase 2 Launch Gate Before CP22

Claude approved this backend/admin planning checkpoint, but explicitly called out that CP22 should not be sent for review until the Phase 2 launch gates are complete:

- Signed-in production smoke test for `finishWorkoutSession` with a planned workout.
- iPhone screenshots of Today active plan/card.
- iPhone screenshot of plan customization panel.
- iPhone screenshot of badge/progress card.

This keeps Phase 3 prep from running too far ahead of actual Phase 2 product launch feedback.

## Specific Questions For Claude

1. Is the 150-exercise candidate coverage balanced enough for a 200+ official library?
2. Are any candidates inappropriate, redundant, too advanced, or likely to create form-risk concerns?
3. Should power/Olympic-style movements be included this early, or deferred until the app has stronger coaching assets?
4. Is the 10-15 exercise review batch policy strict enough to avoid visual drift?
5. Should equipment and level metadata be required at candidate-list stage, or per generation batch?
