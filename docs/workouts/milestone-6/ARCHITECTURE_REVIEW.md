# Milestone 6 Architecture Review: Guided Workout MVP

## Verdict

Pass for implementation review, with one explicit release blocker: `finishWorkoutSession` must be deployed and smoke-tested before guided workouts are exposed to production users.

## Layer Separation

### Web

| Layer | Files | Compliance |
|---|---|---|
| Domain | `guidedWorkoutModels.js`, `guidedWorkoutUseCases.js` | Pure functions/classes, no Firebase imports |
| Data | `webGuidedWorkoutRepository.js` | Owns `localStorage` and Firebase Functions callable |
| Presentation | `useGuidedWorkoutViewModel.js`, `GuidedWorkoutSection.jsx` | Depends on use cases and domain helpers only |
| Composition | `workoutGuidedComposition.js`, `BoardTab.jsx` | Wires repository to use cases |

### iOS

| Layer | Files | Compliance |
|---|---|---|
| Domain | `GuidedWorkoutModels.swift` | Pure Codable models and business logic |
| Data/service | `GuidedWorkoutService.swift` | Owns local storage, Auth token, and finish call |
| Presentation | `GuidedWorkoutViewModel.swift`, `GuidedWorkoutSection.swift` | ViewModel owns state; SwiftUI view renders state |
| Composition | `LeaderboardView.swift` | Wires section into existing Workouts screen |

Hardening note: `GuidedWorkoutService` now conforms to `GuidedWorkoutServicing`, so `GuidedWorkoutViewModel` can be unit-tested with a fake service while the production service keeps Auth, storage, and network behavior out of presentation.

### Android

| Layer | Files | Compliance |
|---|---|---|
| Domain | `GuidedWorkoutModels.kt`, `GuidedWorkoutUseCases.kt` | Pure Kotlin models/use cases/repository interface |
| Data | `AndroidGuidedWorkoutRepository.kt`, `GuidedWorkoutComposition.kt` | Owns SharedPreferences, Auth token, and finish call |
| Presentation | `GuidedWorkoutViewModel.kt`, `GuidedWorkoutSection.kt` | Compose + StateFlow UI state |
| Composition | `TribeApp.kt` | Wires use cases into Workouts screen |

Hardening note: the Android rest timer coroutine now exits when there is no active session or no remaining rest, preventing a long-lived no-op job after rest completion.

## MVVM Compliance

- ViewModels expose observable UI state.
- Views call ViewModel actions; views do not construct finish payloads directly.
- Domain models perform deterministic state transitions.
- Repositories handle persistence and remote submission.
- Firestore catalog repository remains isolated from guided workout presentation.

## Clean Architecture Checks

| Check | Result |
|---|---|
| No Firebase imports in guided workout domain | Pass |
| No Firestore imports in guided workout ViewModels | Pass |
| Finish is routed through repository/service layer | Pass |
| `assetHashSnapshot` captured at session creation | Pass |
| Active session persistence separated from UI components | Pass |
| Existing Quick Log/training journal kept in place | Pass |
| Native guided ViewModels can be tested with fake dependencies | Pass |

## Design Tradeoffs

### Direct HTTPS on iOS/Android

iOS and Android submit to the callable endpoint directly with a Firebase Auth ID token instead of using platform Firebase Functions SDKs.

Pros:

- Smaller dependency change.
- Keeps review scope focused.
- Clear request/response behavior.

Cons:

- Callable protocol handling is manually maintained.
- Native Functions SDK may handle some edge cases better.

Recommendation for Claude review: decide whether this is acceptable for MVP or require SDK adoption before release.

### Local Persistence

Using simple platform-native key/value stores is acceptable for MVP because only one active session and one pending finish payload exist at a time.

Future migration trigger:

- Multiple concurrent drafts.
- Workout templates with editable exercise order.
- Rich history query requirements.

## Release Blockers

1. Deploy `finishWorkoutSession`.
2. Smoke-test one authenticated finish from at least Web and one native client.
3. Decide on direct HTTPS vs platform Firebase Functions SDK for iOS/Android.
