# Milestone 9 Execution Log

Status date: 2026-07-01

## What Changed

Updated the asset generator:

- `scripts/generate-workout-asset-batch.js`

Claude approved Batch 4 and cleared Batch 5. Added:

- Batch 5 cardio/mobility exercise definitions.
- Cardio movement-chain target choices.
- Mobility stretch-target target choices.

Generated staging output remains:

- `generated/workouts/exercises/v1/{exerciseId}/demo.lottie.json`
- `generated/workouts/exercises/v1/{exerciseId}/muscle-map-front.svg`
- `generated/workouts/exercises/v1/{exerciseId}/muscle-map-back.svg`
- `generated/workouts/exercises/v1/{exerciseId}/thumbnail.webp`

Generated metadata now includes all five batches:

- `scripts/workout-exercise-seed-batch-1.json`
- `scripts/workout-assets-manifest-batch-1.json`
- `scripts/workout-exercise-seed-batch-2.json`
- `scripts/workout-assets-manifest-batch-2.json`
- `scripts/workout-exercise-seed-batch-3.json`
- `scripts/workout-assets-manifest-batch-3.json`
- `scripts/workout-exercise-seed-batch-4.json`
- `scripts/workout-assets-manifest-batch-4.json`
- `scripts/workout-exercise-seed-batch-5.json`
- `scripts/workout-assets-manifest-batch-5.json`

Review boards:

- `docs/workouts/milestone-9/asset-batch-1-review.html`
- `docs/workouts/milestone-9/asset-batch-2-review.html`
- `docs/workouts/milestone-9/asset-batch-3-review.html`
- `docs/workouts/milestone-9/asset-batch-4-review.html`
- `docs/workouts/milestone-9/asset-batch-5-review.html`

## Commands Run

```bash
node --check scripts/generate-workout-asset-batch.js
node scripts/generate-workout-asset-batch.js --batch 5
node scripts/upload-workout-assets.js --manifest scripts/workout-assets-manifest-batch-5.json
CI=true npm test -- --runTestsByPath src/__tests__/workoutsAssetPipeline.test.js --runInBand
```

Visual inspection rendered:

```text
/tmp/batch5-treadmill-run-front.png
/tmp/batch5-treadmill-run-back.png
/tmp/batch5-incline-walk-back.png
/tmp/batch5-stationary-bike-front.png
/tmp/batch5-rowing-machine-back.png
/tmp/batch5-cat-cow-back.png
/tmp/batch5-downward-dog-back.png
/tmp/batch5-childs-pose-back.png
/tmp/batch5-worlds-greatest-stretch-front.png
```

## Result

- Batch 5 generated 8 exercise seeds and 32 manifest entries.
- Across Batches 1-5: 50 exercise seeds and 200 asset entries are generated locally.
- Batch 5 upload dry-run validation passed.
- Asset pipeline focused test passed: 16/16.
- `thumbnail.webp` files validate as real `RIFF/WEBP` images.

## Deviation

M9 local generation is complete, but M9 is not release-ready until:

- Claude approves Batch 5 visuals.
- Firebase Storage upload is run.
- Client Storage URL resolution is wired and verified.
- Seed data is live-applied.
