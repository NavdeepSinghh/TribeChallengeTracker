# Milestone 9 Test Report

Status date: 2026-07-01

## Commands Run

```bash
node --check scripts/generate-workout-asset-batch.js
node scripts/upload-workout-assets.js --manifest scripts/workout-assets-manifest-batch-5.json
CI=true npm test -- --runTestsByPath src/__tests__/workoutsAssetPipeline.test.js --runInBand
```

## Result

- JavaScript syntax check passed.
- Batch 5 manifest dry-run validated 32 asset entries.
- Asset pipeline test passed: 1 suite, 16 tests.

## Coverage

- Batch 1, Batch 2, Batch 3, Batch 4, and Batch 5 seed schema.
- Batch 1-5 exercise ordering.
- Variable batch sizes:
  - Batch 1: 10 exercises
  - Batch 2: 10 exercises
  - Batch 3: 14 exercises
  - Batch 4: 8 exercises
  - Batch 5: 8 exercises
- Asset manifest local existence.
- Asset manifest storage path convention.
- Asset manifest SHA-256 hashes.
- Thumbnail image validation:
  - every batch thumbnail is a real `RIFF/WEBP` file
  - every thumbnail is larger than a tiny placeholder stub
- Upload script argument parsing.

## Not Tested

- Firebase Storage live upload.
- CDN readback.
- Lottie playback from uploaded absolute URLs.
