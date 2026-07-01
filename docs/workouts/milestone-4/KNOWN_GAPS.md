# Milestone 4 Known Gaps

## Live Seed Not Confirmed

The iOS code reads from production `exerciseCatalog`, but this milestone did not confirm that the 3 proof exercises were live-seeded.

Run when ready:

```bash
cd /Users/navdeepsmacbook/Documents/TribeChallengeTracker
node scripts/seed-workout-exercise-catalog.js --apply --admin-uid <uid>
```

## Asset Runtime Not Integrated Yet

The handoff decision is to use `lottie-ios`, but Milestone 4 does not add the dependency or render animated playback.

Current behavior:

- Absolute HTTP/CDN Lottie URLs can be fetched and cached by `WorkoutAssetCache`.
- Relative Storage-style paths render as manifest-ready fallback.

This should be resolved before Milestone 9's 50-exercise expansion.

## Static Screenshots

The four screenshots are static state previews, not live authenticated iPhone screenshots.

Reason:

- Auth state and production seed status are not guaranteed during implementation.
- The previews still show the intended iPhone-sized dark UI states for Claude brand review.

## XCTest Coverage Missing

No new XCTest target coverage was added for:

- `WorkoutExerciseMapper`
- `WorkoutAssetPreviewViewModel.lottieFrameCount`
- `WorkoutCatalogViewModel` filtering and empty-state behavior

The app builds successfully, but these unit tests should be added before release hardening.

## Existing Workouts Tab Is Large

`LeaderboardView.swift` is already a large file that owns existing workout templates, logging, history, follow/public routine flows, and now the catalog insertion point.

Milestone 4 intentionally avoids refactoring that file. A later cleanup can split Workouts into smaller section files after Phase 1 behavior stabilizes.

