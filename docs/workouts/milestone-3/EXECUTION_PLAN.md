# Milestone 3 Execution Plan: Web Workouts Read-Only Library

## Objective

Ship the first Web UI slice of the Workouts feature: a backend-driven read-only exercise library inside the existing Workouts bottom-nav tab.

## Acceptance Criteria

- Workouts tab shell includes the Exercise Library.
- Exercise content loads through the backend repository boundary.
- Search and filters exist.
- Exercise detail view includes Lottie/SVG asset loading paths.
- Empty, loading, and error states are handled.
- Quick Log remains accessible from Workouts.
- Web ViewModel depends on use cases only; Firestore stays inside the repository implementation.

## Architecture

Layer ownership:

- Domain: `src/workouts/domain/workoutCatalogModels.js`, `src/workouts/domain/workoutCatalogUseCases.js`
- Data: `src/workouts/data/firestoreWorkoutCatalogRepository.js`
- Presentation: `src/workouts/presentation/useWorkoutCatalogViewModel.js`, `src/workouts/presentation/WorkoutsLibrarySection.jsx`
- Composition: `src/workouts/workoutCatalogComposition.js`
- App wiring: `src/app/BoardTab.jsx`, `src/app/boardTabProps.js`

The ViewModel receives use cases from composition. It does not import Firestore or repository implementations.

## Query Strategy

Firestore queries use the Milestone 1 composite indexes:

- `status == "published"`, `orderBy("name")`
- `status == "published"`, `level == value`, `orderBy("name")`
- `status == "published"`, `primaryMuscles array-contains value`, `orderBy("name")`
- `status == "published"`, `equipment array-contains value`, `orderBy("name")`

Search is client-side over the returned catalog subset. Muscle filters intentionally use primary muscles only because Milestone 1 indexes only support `primaryMuscles`.

## Asset Strategy

The UI resolves asset manifest paths as:

- Absolute URLs: used directly.
- Root-relative paths: used directly.
- Storage/CDN-style relative paths: mapped to `/path` for Web hosting fallback.

Milestone 3 lazy-loads Lottie JSON and SVG muscle maps. It does not introduce a Lottie runtime dependency yet.

## Implementation Steps

1. Add domain models and use cases.
2. Add Firestore repository.
3. Add ViewModel hook with loading/loaded/empty/failed states.
4. Add Workouts library UI and exercise detail panel.
5. Wire Workouts library into existing `board` tab.
6. Add static proof assets under `public/workouts/exercises/v1`.
7. Add focused tests.
8. Generate screenshot artifacts for Claude visual review.
