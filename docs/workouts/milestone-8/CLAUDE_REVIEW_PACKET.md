# Claude Review Packet: Milestone 8

Status date: 2026-07-01

## Request

Please review Milestone 8: Social Sharing And Copying.

This is the revised M8 implementation after Claude's previous "approved with fixes" verdict. The Firestore rules gate, server copy callable, Web social discovery UI, iOS social discovery UI, and Android social discovery UI are complete.

## Verdict Requested

Use one of:

- `APPROVED` if backend/Web/iOS/Android parity is acceptable
- `APPROVED WITH FIXES` if authenticated smoke/real-device captures should be tracked but not block M9 Batch 1 re-review
- `BLOCKED` if native parity must land before M9
- `REVIEW INCONCLUSIVE` if more evidence is needed

## What Codex Built

- Dynamic Firestore emulator rules tests using `@firebase/rules-unit-testing`.
- `copyPublicWorkout` callable.
- Web public workout discovery section.
- Web copy-to-private-template action through callable.
- Web follow/unfollow creator action through existing follow service.
- iOS public workout discovery/copy/follow section inside the Workouts Clean Architecture boundary.
- Android public workout discovery/copy/follow section inside the Workouts Clean Architecture boundary.
- Deployed `finishWorkoutSession` and `copyPublicWorkout` callables to `australia-southeast1`.
- Smoke-tested both deployed endpoints for expected callable auth boundary.
- Tests for social mappers/use cases and backend copy attribution helpers.

## Key Files

### Backend / Rules

- `firestore.rules`
- `src/__tests__/workoutsSocialRules.test.js`
- `functions/workoutSessionCallableHandlers.js`
- `functions/index.js`
- `src/__tests__/workoutsBackendFoundation.test.js`

### Web

- `src/workouts/domain/workoutSocialModels.js`
- `src/workouts/domain/workoutSocialUseCases.js`
- `src/workouts/data/firestoreWorkoutSocialRepository.js`
- `src/workouts/workoutSocialComposition.js`
- `src/workouts/presentation/useWorkoutSocialViewModel.js`
- `src/workouts/presentation/PublicWorkoutDiscoverySection.jsx`
- `src/app/BoardTab.jsx`
- `src/__tests__/workoutsSocial.test.js`

### iOS

- `../TribeChallengeTrackerIOS/TribeChallenge/Workouts/WorkoutSocialModels.swift`
- `../TribeChallengeTrackerIOS/TribeChallenge/Workouts/WorkoutSocialUseCases.swift`
- `../TribeChallengeTrackerIOS/TribeChallenge/Workouts/FirestoreWorkoutSocialRepository.swift`
- `../TribeChallengeTrackerIOS/TribeChallenge/Workouts/WorkoutSocialViewModel.swift`
- `../TribeChallengeTrackerIOS/TribeChallenge/Workouts/WorkoutSocialComposition.swift`
- `../TribeChallengeTrackerIOS/TribeChallenge/Views/PublicWorkoutDiscoverySection.swift`
- `../TribeChallengeTrackerIOS/TribeChallenge/Views/LeaderboardView.swift`
- `../TribeChallengeTrackerIOS/TribeLogTests/WorkoutSocialTests.swift`
- `../TribeChallengeTrackerIOS/TribeChallenge.xcodeproj/project.pbxproj`

### Android

- `../TribeChallengeTrackerAndroid/app/build.gradle.kts`
- `../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/WorkoutSocialModels.kt`
- `../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/WorkoutSocialUseCases.kt`
- `../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/data/FirestoreWorkoutSocialRepository.kt`
- `../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/data/WorkoutSocialComposition.kt`
- `../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/WorkoutSocialViewModel.kt`
- `../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/PublicWorkoutDiscoverySection.kt`
- `../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/TribeApp.kt`
- `../TribeChallengeTrackerAndroid/app/src/test/java/com/risewiththetribe/challengetracker/workouts/WorkoutSocialTest.kt`

## Verification

- Web social + asset focused suite: 7 tests passing.
- Firestore emulator rules suite: 6 tests passing.
- iOS `WorkoutSocialTests`: 4 tests passing.
- Android `WorkoutSocialTest`: passing.
- Android `assembleDebug`: passing.
- `finishWorkoutSession` deployed and smoke-tested unauthenticated boundary.
- `copyPublicWorkout` deployed and smoke-tested unauthenticated boundary.

## Questions For Claude

1. Is the server-side copy model acceptable?
2. Is deterministic private `workoutTemplates/{templateId}` the right copy destination?
3. Should copied workouts increment count only on first copy per viewer/publicWorkout pair?
4. Does iOS/Android parity now satisfy the M8 release blocker?
5. Is unauthenticated endpoint smoke enough for this checkpoint, with signed-in copy/finish smoke tracked before release?
6. Should tribe-visible discovery by followed creators be added after the first public-only flow ships?
