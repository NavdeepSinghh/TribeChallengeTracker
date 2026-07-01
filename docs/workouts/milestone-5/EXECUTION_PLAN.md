# Milestone 5 Execution Plan: Android Workouts Read-Only Library

## Goal

Ship Android parity for the backend-driven Workouts read-only library introduced on Web in Milestone 3 and iOS in Milestone 4.

The existing Android `Board` tab is already labeled `Workouts`, so this milestone adds the exercise catalog section inside that tab while preserving the current quick training journal.

## Scope

- Add a Workouts feature boundary under `com.risewiththetribe.challengetracker.workouts`.
- Implement Domain, Data, and Presentation layers.
- Fetch published exercises from Firestore `exerciseCatalog`.
- Support search and filters for muscle, equipment, and level.
- Show loading, loaded, empty, and error states.
- Add exercise detail view with instructions, form cues, mistakes, substitutions, and asset preview.
- Integrate `lottie-android` through `lottie-compose`.
- Wire the section into the existing Android Workouts tab.

## Architecture

```text
TribeApp BoardScreen
  -> WorkoutCatalogSection
    -> WorkoutCatalogViewModel
      -> WorkoutCatalogUseCases
        -> WorkoutCatalogRepository
          -> FirestoreWorkoutCatalogRepository
```

Layer rules:

- `domain`: pure Kotlin models, use cases, repository interface.
- `data`: Firebase Auth/Firestore implementation and asset cache.
- `presentation`: Compose UI and ViewModel only.
- `ui/TribeApp.kt`: composition root usage only; no catalog query logic.

## Firestore Query Strategy

Base query:

```text
exerciseCatalog
  where status == published
```

Server-side filtering priority:

1. `primaryMuscles arrayContains muscle`
2. `equipment arrayContains equipment`
3. `level == level`

The repository then applies all remaining active filters client-side. This matches the Web strategy and avoids invalid multi-array Firestore queries.

## Asset Strategy

- `lottie-compose` added to Android dependencies.
- Absolute `assetManifest.lottiePath` values load with `LottieCompositionSpec.Url`.
- Relative Storage-style paths show a manifest-ready fallback until Milestone 9 moves assets to Firebase Storage/CDN.
- Asset cache keys use `assetHash|path`.

## Risks

| Risk | Handling |
|---|---|
| Firestore rules or data not seeded | UI has empty/error states; live seed remains a coordination item |
| Relative asset paths are not directly playable | Documented as M9 Firebase Storage dependency |
| UI layer accidentally imports Firebase | Verified with `rg`; only user-facing Firebase Storage copy appears in presentation |
| Android build environment lacks Java | Use Android Studio bundled JDK for Gradle verification |

## Acceptance Criteria

- Android debug build succeeds.
- ViewModel does not import Firebase/Firestore.
- Repository is the only Workouts feature file that imports Firebase SDKs.
- Exercise Library UI supports search, filters, detail view, and four states.
- Lottie runtime is present and used for absolute animation URLs.
- Quick Log/training journal remains below the new library section.
