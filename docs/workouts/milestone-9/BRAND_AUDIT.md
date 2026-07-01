# Milestone 9 Brand Audit

Status date: 2026-07-01

## Verdict

Batch 5 cardio/mobility assets are ready for Claude review. If approved, all 50 exercise assets have passed local generation and validation.

## Brand Choices

- Muscle maps use:
  - `#040404` background
  - `#FF6B35` primary muscle
  - `#FFB199` secondary muscle
  - connected torso, limbs, and joint dots from the M0 direction
  - white labels
- Thumbnails are 640x360 branded WebP cards with the exercise name and primary/secondary muscle labels.

## Review Artifacts

```text
docs/workouts/milestone-9/asset-batch-1-review.html
docs/workouts/milestone-9/asset-batch-2-review.html
docs/workouts/milestone-9/asset-batch-3-review.html
docs/workouts/milestone-9/asset-batch-4-review.html
docs/workouts/milestone-9/asset-batch-5-review.html
```

## Batch 5 Checks

- `treadmill_run` shows full lower-chain emphasis with core/glute support.
- `incline_walk` shows quads/glutes primary and calves/hamstrings/core support.
- `stationary_bike` shows quads primary with posterior lower-leg support.
- `rowing_machine` shows posterior chain primary with arm/core/calf support.
- `cat_cow` shows lower-back/core primary with shoulder/glute support.
- `downward_dog` shows hamstrings/calves primary with shoulders/lats/lower-back support.
- `childs_pose` shows lats/lower-back primary with shoulders/glutes support.
- `worlds_greatest_stretch` shows hip flexors primary with hamstrings/glutes/core/shoulder support.
- Real WebP thumbnails generated for all 8 Batch 5 exercises.

## Known Visual Limitations

- Lottie demos are generated consistently but are not expert-grade biomechanics.
- Mobility exercises use the same standing anatomical map as the other exercises; posture is represented by muscle target choice rather than a full pose illustration.
- Thumbnails are generated branded cards rather than rendered Lottie still frames.
- The internal `OFFICIAL V1` label remains visible in review assets and should be hidden or stripped before production UI release if desired.
