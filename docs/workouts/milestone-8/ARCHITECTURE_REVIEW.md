# Milestone 8 Architecture Review

Status date: 2026-07-01

## Verdict

Self-audit: PASS WITH ONE QA CAVEAT.

Backend/rules/Web/iOS/Android preserve the Workouts feature architecture. The remaining caveat is that deployment smoke checks verified callable reachability/auth boundaries, but not a signed-in end-to-end user copy flow.

## Backend Boundary

`copyPublicWorkout` is server-side because clients should not be trusted to:

- decide if a tribe/public workout is visible
- preserve original creator attribution
- increment copy counts
- write reusable private templates from public content

The function validates visibility and block/follow status before writing a private draft.

## Web Boundary

| Layer | Files | Boundary |
|---|---|---|
| Domain | `workoutSocialModels.js`, `workoutSocialUseCases.js` | No React/Firebase imports. |
| Data | `firestoreWorkoutSocialRepository.js` | Owns Firestore, Functions, and existing follow service calls. |
| Presentation | `useWorkoutSocialViewModel.js`, `PublicWorkoutDiscoverySection.jsx` | Depends on use cases. |
| Composition | `workoutSocialComposition.js` | Wires repository to use cases. |

## iOS Boundary

| Layer | Files | Boundary |
|---|---|---|
| Domain | `WorkoutSocialModels.swift`, `WorkoutSocialUseCases.swift` | Foundation only. No SwiftUI/Firebase imports. |
| Data | `FirestoreWorkoutSocialRepository.swift` | Owns Firestore, Functions, Auth, and follow collection writes. |
| Presentation | `WorkoutSocialViewModel.swift` | `@MainActor`, no Firestore imports. |
| View | `PublicWorkoutDiscoverySection.swift` | SwiftUI rendering only; observes ViewModel. |
| Composition | `WorkoutSocialComposition.swift` | Wires repository to use cases. |

## Android Boundary

| Layer | Files | Boundary |
|---|---|---|
| Domain | `WorkoutSocialModels.kt`, `WorkoutSocialUseCases.kt` | Pure Kotlin. No Android/Firebase imports. |
| Data | `FirestoreWorkoutSocialRepository.kt` | Owns Firestore, Functions, Auth, and follow collection writes. |
| Presentation | `WorkoutSocialViewModel.kt` | StateFlow ViewModel; no Firebase imports. |
| View | `PublicWorkoutDiscoverySection.kt` | Compose rendering only; observes ViewModel. |
| Composition | `WorkoutSocialComposition.kt` | Wires repository to use cases. |

## Rules Boundary

Rules are now tested dynamically through the Firestore emulator, not just static string assertions.
