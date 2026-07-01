# Milestone 4 Execution Plan

## Goal

Ship the iOS read-only Workouts Exercise Library with the same behavior as Web Milestone 3:

- Backend-driven `exerciseCatalog` reads.
- Search and filters.
- Loading, loaded, empty, and error states.
- Exercise detail view.
- Asset manifest loading/cache strategy.
- Clean Architecture / MVVM boundary inside the Workouts feature.

## Scope

Milestone 4 is intentionally read-only. It does not start guided sessions, write workout completions, or mutate exercise catalog data.

## Architecture

| Layer | Files | Responsibility |
|---|---|---|
| Domain | `TribeChallenge/Workouts/WorkoutCatalogModels.swift`, `WorkoutCatalogUseCases.swift` | Entities, repository protocol, use-case wrappers |
| Data | `TribeChallenge/Workouts/FirestoreWorkoutCatalogRepository.swift`, `WorkoutAssetCache.swift` | Firestore reads, document mapping, asset cache |
| Presentation | `TribeChallenge/Workouts/WorkoutCatalogViewModel.swift`, `TribeChallenge/Views/WorkoutCatalogSection.swift` | Observable UI state, SwiftUI section/detail |
| Composition | `TribeChallenge/Workouts/WorkoutCatalogComposition.swift` | Wires Firestore repository to use cases |
| App wiring | `TribeChallenge/Views/LeaderboardView.swift` | Places the composed catalog inside the existing Workouts tab |

## Query Strategy

The iOS repository mirrors Web Milestone 3:

- Always reads only `status == "published"`.
- Applies one indexed Firestore filter at a time:
  1. `primaryMuscles arrayContains`
  2. `equipment arrayContains`
  3. `level ==`
- Applies remaining active filters locally.
- Orders by `name`.

This avoids introducing a new combinatorial index set during the read-only slice.

## Asset Strategy

The iOS asset cache can fetch and cache absolute HTTP/CDN URLs keyed by `assetHash + path`.

Current seed content stores storage-style paths such as `workouts/exercises/v1/goblet_squat/demo.lottie.json`, not absolute CDN URLs. For those paths, the UI shows manifest readiness and does not attempt network fetch. This avoids adding Firebase Storage or hardcoding web-hosted public assets before the asset delivery decision is finalized.

## Verification Plan

- Build generic iOS target.
- Build specifically for Navdeep's iPhone.
- Review code boundary: no Firebase import in ViewModel or SwiftUI view.
- Share this pack with Claude before Milestone 5 starts.
