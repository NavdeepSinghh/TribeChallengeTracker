# Milestone 3 Execution Log: Web Workouts Read-Only Library

## Built

- Added Workouts Clean Architecture slice for Web:
  - `src/workouts/domain/workoutCatalogModels.js`
  - `src/workouts/domain/workoutCatalogUseCases.js`
  - `src/workouts/data/firestoreWorkoutCatalogRepository.js`
  - `src/workouts/presentation/useWorkoutCatalogViewModel.js`
  - `src/workouts/presentation/WorkoutsLibrarySection.jsx`
  - `src/workouts/workoutCatalogComposition.js`
- Wired the library into the existing Workouts tab:
  - `src/app/BoardTab.jsx`
  - `src/app/boardTabProps.js`
- Added proof assets:
  - `public/workouts/exercises/v1/goblet_squat/demo.lottie.json`
  - `public/workouts/exercises/v1/push_up/demo.lottie.json`
  - `public/workouts/exercises/v1/plank/demo.lottie.json`
  - SVG muscle maps for all three proof exercises.
- Added focused Web tests:
  - `src/__tests__/workoutsWebLibrary.test.js`
- Updated Milestone 2 cleanup:
  - `scripts/seed-workout-exercise-catalog.js`
  - `src/__tests__/workoutsBackendFoundation.test.js`
- Updated Phase 1 plan:
  - `docs/workouts/PHASE_1_PLAN.md`

## Plan-To-Code Mapping

| Acceptance Criterion | Implementation |
|---|---|
| Workouts tab shell | Existing `board` tab remains the Workouts tab; `WorkoutsLibrarySection` is mounted inside it |
| Exercise Library | `WorkoutsLibrarySection.jsx` |
| Backend-driven content | `FirestoreWorkoutCatalogRepository.listPublishedExercises` reads `exerciseCatalog` |
| Search and filters | `filterExercises`, `FilterSelect`, search input |
| Exercise detail view | `ExerciseDetail`, `ExerciseMotionPreview`, `MuscleMap` |
| Lazy-loaded Lottie/SVG assets | `useLazyJsonAsset`, `img loading="lazy"` for muscle maps |
| Empty/loading/error states | `LoadingState`, `EmptyState`, `ErrorState` |
| Quick Log remains available | `BoardTab` passes `setShowLog(true)` to `WorkoutsLibrarySection` |
| MVVM/Clean compliance | ViewModel receives use cases; Firestore only appears in data repository |

## Milestone 2 Notes Addressed

- Added Milestone 6 pre-flight item for deployed `finishWorkoutSession`.
- Live seed remains operator-controlled and was not run.
- Removed misleading dry-run `updatedAt` from seed payload. Live apply mode still writes a server timestamp.

## Claude Review Fixes Applied

- `useWorkoutCatalogViewModel` no longer refetches full catalog filter options on every filter-driven load.
- Filter options are loaded once on initial mount and reloaded only through explicit `refresh`.
- Added regression coverage for filter-option caching.
- Added known-gap notes for multi-filter query scale and lenient catalog mapping defaults.
- Shared the missing `WorkoutsLibrarySection.jsx` source with Claude; Claude confirmed no Firestore leakage, real loading/empty/error/loaded states, and Milestone 3 approval.
- Sent the four screenshot PNGs to Claude; Claude confirmed brand compliance and kept the approval unchanged.
- Follow-up cleanup from Claude review:
  - ViewModel now exposes `isEmpty` so presentation does not encode the `status`/`visibleExercises` divergence.
  - Lottie preview frame count now uses `op - ip` instead of raw `op`.
  - Missing `useCases` fallback now logs a warning instead of silently rendering as a real empty catalog.
  - State-preview motion panel clips overflowing figure content to match production behavior.

## Deviations

- No Lottie runtime dependency was added. Milestone 3 fetches the JSON and renders a lightweight branded motion fallback. This keeps the read-only milestone smaller; actual playback can be reviewed before adding a dependency.
- Screenshot artifacts are generated from a state-preview HTML board, not an authenticated live session, because the app requires a signed-in/onboarded user to reach the Workouts tab.
