# Workouts Platform Implementation Templates

These templates show the intended Clean Architecture boundary for the Workouts feature. They are reference scaffolds only and are not wired into production builds.

## Structure

```text
Presentation
  View / screen
  ViewModel
  UI state

Domain
  Entities
  Use cases
  Repository interfaces

Data
  Firestore DTOs
  Mappers
  Repository implementations
  Local cache
```

## Files

### iOS

- [WorkoutDomain.swift](ios/WorkoutDomain.swift)
- [WorkoutCatalogViewModel.swift](ios/WorkoutCatalogViewModel.swift)
- [WorkoutCatalogView.swift](ios/WorkoutCatalogView.swift)

### Web

- [workoutDomain.ts](web/workoutDomain.ts)
- [WorkoutCatalogViewModel.ts](web/WorkoutCatalogViewModel.ts)
- [WorkoutCatalogView.tsx](web/WorkoutCatalogView.tsx)

### Android

- [WorkoutDomain.kt](android/WorkoutDomain.kt)
- [WorkoutCatalogViewModel.kt](android/WorkoutCatalogViewModel.kt)
- [WorkoutCatalogScreen.kt](android/WorkoutCatalogScreen.kt)

## Implementation Rule

When production implementation starts, copy the pattern, not necessarily these exact files. The domain layer must remain testable without SwiftUI, React, Compose, or Firebase UI dependencies.

