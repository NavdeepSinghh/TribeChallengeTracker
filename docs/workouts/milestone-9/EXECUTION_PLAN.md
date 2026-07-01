# Milestone 9 Execution Plan: 50 Exercise Library Expansion

Status date: 2026-07-01

## Goal

Move from proof exercises toward the official exercise library using a Firebase Storage-backed asset pipeline.

## Approved Batch Rule

Claude requested assets in batches of 10. This checkpoint implements batch 1 only:

- Bench Press
- Dumbbell Bench Press
- Incline Dumbbell Press
- Push-Up
- Machine Chest Press
- Dumbbell Shoulder Press
- Lateral Raise
- Dumbbell Chest Fly
- Triceps Pushdown
- Bench Dip

## Scope Completed

- Asset generator for batch 1.
- Generated 10 seed records.
- Generated 40 local staged assets:
  - 10 Lottie JSON demos
  - 10 front muscle maps
  - 10 back muscle maps
  - 10 placeholder WebP files
- Upload manifest with Firebase Storage paths and SHA-256 checks.
- Upload script dry-run validator.
- Tests for seed and manifest validation.
- Visual review board for batch 1.

## Out Of Scope

- Actually uploading to Firebase Storage; credentials/bucket confirmation needed.
- Generating batches 2-5.
- Final 50-exercise seed apply.
- Real thumbnails; current thumbnails are placeholders.
- Claude approval of batch 1 visual style.
