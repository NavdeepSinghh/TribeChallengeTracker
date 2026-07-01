# Milestone 5 Architecture Review: Android Workouts Read-Only Library

## Verdict

Pass for Milestone 5 scope.

The Android Workouts read-only library follows MVVM + Clean Architecture inside the Workouts feature boundary.

## Layer Audit

| Layer | Files | Status |
|---|---|---|
| Domain | `WorkoutCatalogModels.kt`, `WorkoutCatalogUseCases.kt` | Pure Kotlin, no Firebase, no Compose |
| Data | `FirestoreWorkoutCatalogRepository.kt`, `WorkoutAssetCache.kt`, `WorkoutCatalogComposition.kt` | Firebase isolated here |
| Presentation | `WorkoutCatalogViewModel.kt`, `WorkoutCatalogSection.kt` | ViewModel depends on use cases only |
| App Composition | `TribeApp.kt` | Creates use cases with `WorkoutCatalogComposition.makeUseCases()` |

## Dependency Direction

```text
Presentation -> Domain
Data -> Domain
TribeApp composition -> Data + Presentation
```

No reverse dependency was introduced.

## ViewModel Review

`WorkoutCatalogViewModel`:

- Accepts `WorkoutCatalogUseCases` via constructor.
- Exposes immutable `StateFlow<WorkoutCatalogUiState>`.
- Does not import Firebase, Firestore, Auth, or Compose UI.
- Handles loading, loaded, empty, and failed states.
- Keeps filter options cached after first load.

## Repository Review

`FirestoreWorkoutCatalogRepository`:

- Authenticates via `FirebaseAuth`.
- Reads `exerciseCatalog` from Firestore.
- Uses valid Firestore query combinations.
- Maps Firestore maps into domain entities.
- Does not expose Firestore DTOs to presentation.

## Composition Root

`WorkoutCatalogComposition.makeUseCases()`:

- Owns the concrete repository construction.
- Keeps Firestore dependency out of `BoardScreen` logic except via composition wiring.

`BoardScreen`:

- Uses `remember { WorkoutCatalogComposition.makeUseCases() }`.
- Passes use cases into `WorkoutCatalogSection`.
- Contains no Firestore catalog query logic.

## Known Architecture Gap

There are no fake-repository ViewModel unit tests yet. This is acceptable for M5 because the Android test source set currently has no tests, but it should be addressed before the Guided Workout MVP expands state complexity.
