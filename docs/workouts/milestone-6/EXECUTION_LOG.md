# Milestone 6 Execution Log: Guided Workout MVP

## Summary

Implemented guided workout MVP across Web, iOS, and Android. The feature now lets users select catalog exercises, start a guided session, record reps and weight, complete sets, use a rest timer, persist the active session locally, finish through the backend function boundary, and retry pending finish payloads if submission fails.

## Web Implementation

Files added:

- `src/workouts/domain/guidedWorkoutModels.js`
- `src/workouts/domain/guidedWorkoutUseCases.js`
- `src/workouts/data/webGuidedWorkoutRepository.js`
- `src/workouts/workoutGuidedComposition.js`
- `src/workouts/presentation/useGuidedWorkoutViewModel.js`
- `src/workouts/presentation/GuidedWorkoutSection.jsx`
- `src/__tests__/workoutsGuidedSession.test.js`

Files changed:

- `src/firebase.js`
- `src/app/BoardTab.jsx`

Implementation notes:

- `guidedWorkoutModels.js` owns pure state transitions and finish payload construction.
- `webGuidedWorkoutRepository.js` owns `localStorage` persistence and `httpsCallable(workoutsFunctions, "finishWorkoutSession")`.
- `useGuidedWorkoutViewModel.js` coordinates catalog loading, exercise selection, active session persistence, rest timer ticks, finish, pending sync, and retry.
- `GuidedWorkoutSection.jsx` renders selection, active session, pending sync, and finished states.
- `BoardTab.jsx` wires the guided section above the read-only exercise library.
- `firebase.js` now exports `workoutsFunctions` pinned to `australia-southeast1`.

## iOS Implementation

Files added:

- `TribeChallenge/Workouts/GuidedWorkoutModels.swift`
- `TribeChallenge/Workouts/GuidedWorkoutService.swift`
- `TribeChallenge/Workouts/GuidedWorkoutViewModel.swift`
- `TribeChallenge/Views/GuidedWorkoutSection.swift`

Files changed:

- `TribeChallenge/Views/LeaderboardView.swift`
- `TribeChallenge.xcodeproj/project.pbxproj`
- `TribeChallenge/Workouts/GuidedWorkoutService.swift`
- `TribeChallenge/Workouts/GuidedWorkoutViewModel.swift`

Implementation notes:

- `GuidedWorkoutModels.swift` owns Codable session models, summary, set completion, timer tick input, and finish payload creation.
- `GuidedWorkoutService.swift` owns `UserDefaults` persistence, Firebase Auth token loading, and direct HTTPS submission to `finishWorkoutSession`.
- `GuidedWorkoutService.swift` now conforms to `GuidedWorkoutServicing`, giving tests an injectable seam without moving network/storage logic into the ViewModel.
- `GuidedWorkoutViewModel.swift` owns UI state and depends on catalog use cases plus `GuidedWorkoutServicing`.
- `GuidedWorkoutSection.swift` renders selection, active session, visibility picker, pending sync, and finish summary UI.
- `LeaderboardView.swift` now shows guided workouts above the catalog/library section inside the existing Workouts screen.
- `TribeLogTests/GuidedWorkoutTests.swift` covers domain transitions and ViewModel start/failure/retry flows.

## Android Implementation

Files added:

- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/GuidedWorkoutModels.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/GuidedWorkoutUseCases.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/data/AndroidGuidedWorkoutRepository.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/data/GuidedWorkoutComposition.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/GuidedWorkoutViewModel.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/GuidedWorkoutSection.kt`

Files changed:

- `app/src/main/java/com/risewiththetribe/challengetracker/ui/TribeApp.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/GuidedWorkoutViewModel.kt`

Implementation notes:

- `GuidedWorkoutModels.kt` owns pure session models and state transitions.
- `GuidedWorkoutUseCases.kt` wraps repository operations.
- `AndroidGuidedWorkoutRepository.kt` owns `SharedPreferences` persistence, Firebase Auth token loading, and direct HTTPS submission.
- `GuidedWorkoutViewModel.kt` owns `StateFlow` UI state and rest timer coroutine.
- `GuidedWorkoutViewModel.kt` now exits the timer coroutine when no active rest remains, avoiding a long-lived no-op timer job.
- `GuidedWorkoutSection.kt` renders Compose selection, active session, visibility chips, pending sync, and finished UI.
- `TribeApp.kt` wires guided workout use cases into the Workouts tab.
- `GuidedWorkoutTest.kt` covers domain transitions and ViewModel start/failure/retry flows.

## Plan-To-Code Mapping

| Acceptance criterion | Implementation |
|---|---|
| Select exercises from backend catalog | Web/iOS/Android guided sections consume existing catalog use cases |
| Start guided session | `createGuidedWorkoutSession`, `GuidedWorkoutModel.makeSession` |
| Set/reps/weight entry | Guided section inputs update current set on all platforms |
| Rest timer | Web interval, iOS view timer, Android coroutine ticker |
| Active session local persistence | Web `localStorage`; iOS `UserDefaults`; Android `SharedPreferences` |
| Finish summary | `guidedWorkoutSummary`, `GuidedWorkoutSummary`, finish UI panels |
| Server-side trusted finish | All platforms call `finishWorkoutSession` |
| Pending retry | Pending finish stored locally on submit failure |
| `assetHashSnapshot` | Captured when session is created from catalog exercise asset manifest |

## Deviations From Plan

1. iOS and Android use direct HTTPS calls to the callable endpoint instead of Firebase Functions SDK wrappers.
   - Rationale: avoids dependency churn before Claude review.
   - Review request: Claude should decide whether native Functions SDK is required before production release.

2. Cloud Function deployment was not run during this milestone.
   - Rationale: do not silently deploy production backend while M4/M5 are still pending Claude review.
   - Status: hard release blocker before real user QA.

3. iOS and Android initially had catalog ViewModel/domain unit tests from Milestone 5.5 only.
   - Follow-up: M6 hardening added dedicated guided-workout state and ViewModel tests on both platforms.
   - Status: native guided unit coverage now exists; live device timer/background QA remains pending.

## Open Questions For Claude

1. Should iOS and Android switch from direct HTTPS calls to Firebase Functions SDK before approval?
2. Should M7 wait until `finishWorkoutSession` is deployed and smoke-tested, or can M7 continue as implementation-only with deployment as a gate?
3. Are the newly-added guided workout native tests enough for M7 to proceed, with live device timer/background QA tracked for release?
