# Milestone 5 Execution Log: Android Workouts Read-Only Library

## Summary

Implemented the Android Workouts read-only exercise catalog with MVVM + Clean Architecture scoped to the Workouts feature boundary.

## Files Added

Android:

- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/WorkoutCatalogModels.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/WorkoutCatalogUseCases.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/data/FirestoreWorkoutCatalogRepository.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/data/WorkoutAssetCache.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/data/WorkoutCatalogComposition.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/WorkoutCatalogViewModel.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/WorkoutCatalogSection.kt`

Documentation:

- `docs/workouts/milestone-5/EXECUTION_PLAN.md`
- `docs/workouts/milestone-5/EXECUTION_LOG.md`
- `docs/workouts/milestone-5/TEST_REPORT.md`
- `docs/workouts/milestone-5/ARCHITECTURE_REVIEW.md`
- `docs/workouts/milestone-5/BRAND_AUDIT.md`
- `docs/workouts/milestone-5/KNOWN_GAPS.md`
- `docs/workouts/milestone-5/CLAUDE_REVIEW_PACKET.md`
- `docs/workouts/milestone-5/screenshots/android-workouts-state-preview.html`

## Files Modified

- `app/build.gradle.kts`
  - Added `implementation("com.airbnb.android:lottie-compose:6.6.2")`.
- `app/src/main/java/com/risewiththetribe/challengetracker/ui/TribeApp.kt`
  - Imported `WorkoutCatalogComposition`.
  - Imported `WorkoutCatalogSection`.
  - Created `workoutCatalogUseCases` with `remember`.
  - Inserted `WorkoutCatalogSection` above `TrainingJournalCard`.

## Plan-to-Code Mapping

| Acceptance Criterion | Implementation |
|---|---|
| Workouts tab shell | Existing `BoardScreen` labeled `Workouts`; catalog section inserted inside it |
| Catalog repository | `FirestoreWorkoutCatalogRepository.kt` |
| Domain interface | `WorkoutCatalogRepository` in `WorkoutCatalogUseCases.kt` |
| ViewModel | `WorkoutCatalogViewModel.kt` |
| Exercise Library UI | `WorkoutCatalogSection.kt` |
| Search and filters | `WorkoutCatalogViewModel.updateSearch/updateMuscle/updateEquipment/updateLevel` |
| Detail view | `WorkoutExerciseDetailDialog` in `WorkoutCatalogSection.kt` |
| Lazy Lottie asset preview | `WorkoutAssetPreview` with `LottieCompositionSpec.Url` |
| Loading/empty/error/loaded states | `WorkoutCatalogLoadingState`, `WorkoutCatalogEmptyState`, `WorkoutCatalogErrorState`, loaded list branch |
| Build succeeds | `JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew :app:assembleDebug` |

## Deviations

1. The Android app already has the Workouts tab label through `Tab.Board("Workouts", "💪")`.
   - Decision: insert the catalog into the existing tab instead of creating a second tab.

2. Relative `assetManifest` paths do not play directly in Android.
   - Decision: absolute URLs use live Lottie playback now; relative paths show a manifest-ready fallback until Milestone 9 Storage/CDN work.

3. Screenshots are static HTML previews.
   - Reason: live authenticated catalog screenshots require seeded data and device state. The Android build itself is verified.

## Build Notes

Initial Gradle run failed because shell Java was unavailable. Android Studio's bundled JDK exists at:

```text
/Applications/Android Studio.app/Contents/jbr/Contents/Home
```

All Android verification commands were run with that `JAVA_HOME`.
