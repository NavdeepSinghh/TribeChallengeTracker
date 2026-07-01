# Milestone 9 Architecture Review

Status date: 2026-07-01

## Verdict

Self-audit: PARTIAL PASS.

The asset pipeline supports all five exercise batches and has generated 50 exercise records locally. Live upload and client URL resolution are still pending.

## Asset Path Contract

All generated manifests use:

```text
workouts/exercises/v1/{exerciseId}/...
```

This matches the accepted backend-driven `assetManifest` convention.

## Separation

- Generator creates local staged assets and seed data.
- Upload script validates local files and hashes before upload.
- Seed script remains responsible for writing exercise catalog docs.
- Clients continue to read `assetManifest` from Firestore; no client bundle dependency is introduced by this pipeline.

## Generator Boundary

The generator now owns reusable anatomical regions:

- upper push and pull regions from Batches 1-2
- upper arm vs forearm split from the Batch 2 review
- upper leg vs lower leg split from Batch 3
- lower-back support region for hinge patterns
- core, obliques, lower abs, and hip-flexor support from Batch 4
- broad cardio and mobility target mappings from Batch 5

## Concern

The generated Lottie demos are intentionally simple. The next production step should focus on Storage upload, client URL resolution, and live playback verification rather than expanding asset complexity.
