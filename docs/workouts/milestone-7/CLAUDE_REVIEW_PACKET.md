# Claude Review Packet: Milestone 7

Status date: 2026-07-01

## Request

Please review Milestone 7: History, PRs, And Feed Auto-Log surfaces.

## Verdict Requested

Use one of:

- `APPROVED`
- `APPROVED WITH FIXES`
- `BLOCKED`
- `REVIEW INCONCLUSIVE`

## What Codex Built

M7 adds read-only post-finish surfaces across Web, iOS, and Android:

- completed guided workout history
- history summary
- volume trend
- server-trusted PR display
- deterministic activity/feed/public mirror indicators

The trusted writes still come from `finishWorkoutSession`; clients only read the resulting session and PR docs.

## Files To Review

### Web

- `src/workouts/domain/workoutHistoryModels.js`
- `src/workouts/domain/workoutHistoryUseCases.js`
- `src/workouts/data/firestoreWorkoutHistoryRepository.js`
- `src/workouts/workoutHistoryComposition.js`
- `src/workouts/presentation/useWorkoutHistoryViewModel.js`
- `src/workouts/presentation/WorkoutHistorySection.jsx`
- `src/app/BoardTab.jsx`
- `src/__tests__/workoutsHistory.test.js`

### iOS

- `TribeChallenge/Workouts/WorkoutHistoryModels.swift`
- `TribeChallenge/Workouts/WorkoutHistoryUseCases.swift`
- `TribeChallenge/Workouts/FirestoreWorkoutHistoryRepository.swift`
- `TribeChallenge/Workouts/WorkoutHistoryComposition.swift`
- `TribeChallenge/Workouts/WorkoutHistoryViewModel.swift`
- `TribeChallenge/Views/WorkoutHistorySection.swift`
- `TribeChallenge/Views/LeaderboardView.swift`
- `TribeLogTests/WorkoutHistoryTests.swift`

### Android

- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/WorkoutHistoryModels.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/WorkoutHistoryUseCases.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/data/FirestoreWorkoutHistoryRepository.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/data/WorkoutHistoryComposition.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/WorkoutHistoryViewModel.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/WorkoutHistorySection.kt`
- `app/src/main/java/com/risewiththetribe/challengetracker/ui/TribeApp.kt`
- `app/src/test/java/com/risewiththetribe/challengetracker/workouts/WorkoutHistoryTest.kt`

## Verification

Web:

- 21 focused Workouts tests pass.
- Production build passes.

iOS:

- 21 XCTest cases pass.
- Generic iOS build passes.

Android:

- Debug unit tests pass.
- Debug APK build passes.

## Questions For Claude

1. Does M7 preserve the server-trusted PR/feed design?
2. Is list-level mirror status enough for M7, with destructive cleanup deferred to M8?
3. Is the history summary/volume trend scope acceptable before social sharing?
4. Are the new tests sufficient to proceed to M8?

## Known Gaps To Decide

- `finishWorkoutSession` deployment and smoke test remain release blockers.
- Firestore emulator tests remain the M8 hard gate.
- Real screenshots are still required before release.
- History pagination can wait unless Claude considers it a blocker.
