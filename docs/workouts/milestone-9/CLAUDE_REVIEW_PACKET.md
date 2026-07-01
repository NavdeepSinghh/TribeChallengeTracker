# Claude Review Packet: Milestone 9 Batch 5

Status date: 2026-07-01

## Request

Please review Milestone 9 Batch 5 cardio/mobility assets.

This is the final M9 asset batch. If approved, all 50 exercise assets are generated locally and ready for the Storage upload / client URL resolution release path.

## Prior Claude Verdicts

- Batch 1 revision: approved.
- Batch 2 upper-pull: approved after curl anatomy fix.
- Batch 3 lower-body: approved.
- Batch 4 core: approved.

## Batch 5 Scope

Cardio:

1. Treadmill Run
2. Incline Walk
3. Stationary Bike
4. Rowing Machine

Mobility:

1. Cat-Cow
2. Downward Dog
3. Child's Pose
4. World's Greatest Stretch

## Direction Used

Cardio exercises use broad movement-chain highlights rather than pretending they have one isolated strength target:

- Treadmill Run: lower-chain primary with core/glute support
- Incline Walk: quads/glutes primary, calves/hamstrings/core support
- Stationary Bike: quads primary, hamstrings/calves/glutes support
- Rowing Machine: posterior chain primary with arm/core/calf support

Mobility exercises use stretch-target primary highlights with secondary whole-body engagement:

- Cat-Cow: lower-back/core primary
- Downward Dog: hamstrings/calves primary, shoulders/lats/lower-back support
- Child's Pose: lats/lower-back primary, shoulders/glutes support
- World's Greatest Stretch: hip flexors primary, hamstrings/glutes/core/shoulders support

## Built

- Batch 5 cardio/mobility definitions in the generator.
- 8 cardio/mobility exercise seed records.
- 32 Batch 5 staged assets.
- Firebase Storage upload manifest for Batch 5.
- Batch 5 visual review board.
- Tests updated to validate Batches 1-5.
- Dry-run upload validation for Batch 5.

## Files To Review

- `scripts/generate-workout-asset-batch.js`
- `scripts/workout-exercise-seed-batch-5.json`
- `scripts/workout-assets-manifest-batch-5.json`
- `generated/workouts/exercises/v1/`
- `docs/workouts/milestone-9/asset-batch-5-review.html`
- `src/__tests__/workoutsAssetPipeline.test.js`

## Verification

- Batch 5 upload manifest dry-run passed for 32 entries.
- Asset pipeline test passed: 16/16.
- Render checks completed for:
  - `treadmill_run` front/back
  - `incline_walk` back
  - `stationary_bike` front
  - `rowing_machine` back
  - `cat_cow` back
  - `downward_dog` back
  - `childs_pose` back
  - `worlds_greatest_stretch` front

## Questions For Claude

1. Are the cardio movement-chain highlights acceptable?
2. Does Rowing Machine correctly read as posterior-chain cardio?
3. Are the mobility stretch-target highlights acceptable despite using the same standing anatomical body map?
4. Are the generated WebP thumbnail cards acceptable for Batch 5?
5. If approved, should Codex proceed to Storage upload/client URL resolution, or revise any Batch 5 visuals first?
