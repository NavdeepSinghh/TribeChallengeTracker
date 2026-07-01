# Claude Review Packet — Milestone 4

## Context For New Claude Instance

TribeLog Workouts Phase 1 is being built milestone-by-milestone with Claude review after each milestone.

Already approved:

- M0 Foundation Architecture / Phase 1 Plan / Visual POC
- M1 Backend Foundation
- M2 Admin Content Seed Path
- M3 Web Workouts Read-Only Library

Current review target:

- **M4 iOS Workouts Read-Only Library**

Relevant locked decisions:

- Firebase-first architecture.
- Backend-driven exercise catalog.
- MVVM + Clean Architecture inside Workouts feature boundary.
- ViewModels must not import Firebase.
- Repository implementations are the only layer that imports platform Firebase SDKs.
- Composition root wires repositories to use cases.
- Lottie runtime decision: `lottie-web`, `lottie-ios`, `lottie-android`.
- Firebase Storage/CDN asset pipeline is a hard gate before M9 expansion.

## What Codex Built

- iOS domain models and repository contracts.
- Firestore repository for `exerciseCatalog`.
- ViewModel with explicit loading/loaded/empty/failed state.
- SwiftUI catalog section with search/filter/detail.
- Asset cache for absolute URLs keyed by `assetHash + path`.
- Workouts tab wiring inside existing `LeaderboardView`.
- iPhone-sized preview screenshots for loading, loaded, empty, and error states.

## Files To Review

Docs:

- `docs/workouts/milestone-4/EXECUTION_PLAN.md`
- `docs/workouts/milestone-4/EXECUTION_LOG.md`
- `docs/workouts/milestone-4/TEST_REPORT.md`
- `docs/workouts/milestone-4/ARCHITECTURE_REVIEW.md`
- `docs/workouts/milestone-4/BRAND_AUDIT.md`
- `docs/workouts/milestone-4/KNOWN_GAPS.md`

iOS source:

- `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/WorkoutCatalogModels.swift`
- `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/WorkoutCatalogUseCases.swift`
- `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/FirestoreWorkoutCatalogRepository.swift`
- `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/WorkoutAssetCache.swift`
- `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/WorkoutCatalogViewModel.swift`
- `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/WorkoutCatalogComposition.swift`
- `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Views/WorkoutCatalogSection.swift`
- `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Views/LeaderboardView.swift`

## Verification Already Run

```bash
xcodebuild -project TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination generic/platform=iOS build
xcodebuild -project TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination 'platform=iOS,id=00008120-00146588142A601E' build
```

Both builds succeeded.

## Specific Review Questions

1. Does the iOS implementation pass MVVM + Clean Architecture for M4?
2. Is `WorkoutCatalogComposition` an acceptable composition boundary?
3. Is it acceptable for M4 to show manifest-ready fallback for relative Storage paths and defer `lottie-ios` runtime playback until asset delivery is finalized?
4. Are the static iPhone-sized screenshots enough for brand review, or should live authenticated iPhone screenshots block M4 approval?
5. What fixes are required before Milestone 5 Android starts?

