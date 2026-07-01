# Milestone 7 Architecture Review

Status date: 2026-07-01

## Verdict

Self-audit: PASS.

M7 keeps the same Workouts feature architecture approved in earlier milestones.

## Layer Boundaries

### Web

| Layer | Files | Boundary |
|---|---|---|
| Domain | `workoutHistoryModels.js`, `workoutHistoryUseCases.js` | No React or Firebase imports. |
| Data | `firestoreWorkoutHistoryRepository.js` | Owns Firebase Auth/Firestore access. |
| Presentation | `useWorkoutHistoryViewModel.js`, `WorkoutHistorySection.jsx` | Depends on use cases and UI state. |
| Composition | `workoutHistoryComposition.js` | Wires repository to use cases. |

### iOS

| Layer | Files | Boundary |
|---|---|---|
| Domain | `WorkoutHistoryModels.swift`, `WorkoutHistoryUseCases.swift` | Foundation-only domain and use cases. |
| Data | `FirestoreWorkoutHistoryRepository.swift` | Only history file importing FirebaseAuth/FirebaseFirestore. |
| Presentation | `WorkoutHistoryViewModel.swift`, `WorkoutHistorySection.swift` | ViewModel depends on use cases; SwiftUI view observes ViewModel. |
| Composition | `WorkoutHistoryComposition.swift` | Wires Firestore repository to use cases. |

### Android

| Layer | Files | Boundary |
|---|---|---|
| Domain | `WorkoutHistoryModels.kt`, `WorkoutHistoryUseCases.kt` | Pure Kotlin domain and repository interface. |
| Data | `FirestoreWorkoutHistoryRepository.kt`, `WorkoutHistoryComposition.kt` | Firebase SDK isolated here. |
| Presentation | `WorkoutHistoryViewModel.kt`, `WorkoutHistorySection.kt` | StateFlow ViewModel and Compose UI. |
| App wiring | `TribeApp.kt` | Supplies composed use cases to the Workouts screen. |

## Trust Boundary

Clients do not calculate trusted PRs or write feed/activity mirrors in M7. The UI reads:

- completed sessions
- server-written PR docs
- deterministic mirror IDs written by `finishWorkoutSession`

This preserves the Milestone 1 server-trust design.

## Residual Risk

- M8 must add emulator allow/deny rule tests before any social sharing UI becomes shippable.
- M7 does not deploy or smoke-test `finishWorkoutSession`; that remains a release blocker.
