# Milestone 8 Execution Log

Status date: 2026-07-01

## What Changed

### Dependencies / Scripts

- Added `@firebase/rules-unit-testing`.
- Added `firebase-tools`.
- Added `npm run test:workouts-rules` with local Android Studio JBR `JAVA_HOME` so Firestore emulator can run on Navdeep's Mac.

Files:

- `package.json`
- `package-lock.json`

### Rules Tests

- Added Firestore emulator allow/deny suite:
  - `src/__tests__/workoutsSocialRules.test.js`

Coverage:

- private training session owner/non-owner
- tribe-visible public workout follower/non-follower
- public workout blocked in either direction
- direct `publicWorkouts` write source-session defense
- non-admin write denies for catalog and PRs
- admin write allows for catalog and PRs

### Backend Callable

- Added deterministic copy template ID helper.
- Added visibility helper used by server-side copy.
- Added copied template builder preserving attribution.
- Added `copyPublicWorkout` callable.
- Exported callable from `functions/index.js`.

Files:

- `functions/workoutSessionCallableHandlers.js`
- `functions/index.js`
- `src/__tests__/workoutsBackendFoundation.test.js`

### Web UI

Added social discovery/domain/data/presentation:

- `src/workouts/domain/workoutSocialModels.js`
- `src/workouts/domain/workoutSocialUseCases.js`
- `src/workouts/data/firestoreWorkoutSocialRepository.js`
- `src/workouts/workoutSocialComposition.js`
- `src/workouts/presentation/useWorkoutSocialViewModel.js`
- `src/workouts/presentation/PublicWorkoutDiscoverySection.jsx`
- `src/__tests__/workoutsSocial.test.js`

Wired into:

- `src/app/BoardTab.jsx`

### iOS UI Parity

Added Workouts-scoped social discovery/copy/follow implementation:

- `../TribeChallengeTrackerIOS/TribeChallenge/Workouts/WorkoutSocialModels.swift`
- `../TribeChallengeTrackerIOS/TribeChallenge/Workouts/WorkoutSocialUseCases.swift`
- `../TribeChallengeTrackerIOS/TribeChallenge/Workouts/FirestoreWorkoutSocialRepository.swift`
- `../TribeChallengeTrackerIOS/TribeChallenge/Workouts/WorkoutSocialViewModel.swift`
- `../TribeChallengeTrackerIOS/TribeChallenge/Workouts/WorkoutSocialComposition.swift`
- `../TribeChallengeTrackerIOS/TribeChallenge/Views/PublicWorkoutDiscoverySection.swift`
- `../TribeChallengeTrackerIOS/TribeLogTests/WorkoutSocialTests.swift`

Wired into:

- `../TribeChallengeTrackerIOS/TribeChallenge/Views/LeaderboardView.swift`
- `../TribeChallengeTrackerIOS/TribeChallenge.xcodeproj/project.pbxproj`

### Android UI Parity

Added Workouts-scoped social discovery/copy/follow implementation:

- `../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/WorkoutSocialModels.kt`
- `../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/WorkoutSocialUseCases.kt`
- `../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/data/FirestoreWorkoutSocialRepository.kt`
- `../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/data/WorkoutSocialComposition.kt`
- `../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/WorkoutSocialViewModel.kt`
- `../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/PublicWorkoutDiscoverySection.kt`
- `../TribeChallengeTrackerAndroid/app/src/test/java/com/risewiththetribe/challengetracker/workouts/WorkoutSocialTest.kt`

Wired into:

- `../TribeChallengeTrackerAndroid/app/build.gradle.kts`
- `../TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/ui/TribeApp.kt`

### Deployment / Endpoint Smoke

Deployed both callable functions to Firebase:

- `finishWorkoutSession`
- `copyPublicWorkout`

Both deployed in `australia-southeast1`.

Direct endpoint smoke checks returned the expected unauthenticated callable boundary:

- `finishWorkoutSession`: HTTP 401, `UNAUTHENTICATED`, `Sign in is required.`
- `copyPublicWorkout`: HTTP 401, `UNAUTHENTICATED`, `Sign in is required.`

## Plan-To-Code Mapping

| Acceptance Criterion | Implementation |
|---|---|
| Rules deny private session to non-owner | Emulator test `allows owner and denies non-owner reads...` |
| Rules enforce tribe follower visibility | Emulator test `allows follower and denies non-follower...` |
| Rules enforce bidirectional block | Emulator test `allows public workout reads unless either side has blocked...` |
| Copy preserves attribution | `buildCopiedWorkoutTemplate` and unit test |
| Copy is server-side | `copyPublicWorkout` callable |
| Web public discovery | Web `PublicWorkoutDiscoverySection` |
| iOS public discovery | iOS `PublicWorkoutDiscoverySection` |
| Android public discovery | Android `PublicWorkoutDiscoverySection` |
| Follow/unfollow integration | Web uses existing follow service; iOS/Android use Workouts data repositories and existing follow collection shape |

## Deviations

- Web discovery currently queries public workouts only. Tribe-visible workout discovery by followed creators can be added after Claude review of the first public flow.
- Smoke tests prove deployed callable reachability and auth boundary, but not a full authenticated finish/copy UX path from a signed-in client.
