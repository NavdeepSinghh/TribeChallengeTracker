# Milestone 4 Architecture Review

## Layer Separation

| Layer | Files | Status |
|---|---|---|
| Domain | `WorkoutCatalogModels.swift`, `WorkoutCatalogUseCases.swift` | Pass |
| Data | `FirestoreWorkoutCatalogRepository.swift`, `WorkoutAssetCache.swift` | Pass |
| Presentation | `WorkoutCatalogViewModel.swift`, `WorkoutCatalogSection.swift` | Pass |
| Composition | `WorkoutCatalogComposition.swift` | Pass |
| App wiring | `LeaderboardView.swift` | Pass |

## MVVM Compliance

- `WorkoutCatalogViewModel` is `@MainActor ObservableObject`.
- ViewModel depends on `WorkoutCatalogUseCases`.
- ViewModel does not import `FirebaseFirestore`, `FirebaseAuth`, or SwiftUI.
- SwiftUI views observe ViewModel state and do not call Firestore directly.
- Repository implementation is the only new Workouts catalog file importing Firestore/Auth.
- Firestore repository construction happens in `WorkoutCatalogComposition`, not in the ViewModel or SwiftUI section.

## Repository Contract

```swift
protocol WorkoutCatalogRepository {
    func fetchExercises(filters: WorkoutCatalogFilters) async throws -> [WorkoutExercise]
}
```

This matches the Web domain boundary: presentation calls use cases, use cases call a repository contract, and Firestore stays in the data layer.

## Dependency Injection

- `WorkoutCatalogUseCases` accepts a repository implementation.
- `WorkoutCatalogViewModel` accepts use cases and has a Firestore-backed default for app wiring.
- Future XCTest coverage can inject a fake repository without Firestore.

## Composition Boundary

`LeaderboardView` calls `WorkoutCatalogComposition.makeUseCases()` and passes the result into `WorkoutCatalogSection(useCases:)`. The section constructs its `@StateObject` ViewModel from those injected use cases.

This keeps Firestore wiring out of the ViewModel and out of SwiftUI presentation logic.
