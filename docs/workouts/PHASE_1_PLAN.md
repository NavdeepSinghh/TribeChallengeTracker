# Phase 1 Implementation Plan: Workouts Foundation

## Status

Pre-implementation plan for Claude and Navdeep review. No production code should be written until this plan and the visual proof of concept are approved.

## Phase 1 Goal

Ship a production-ready Workouts tab that moves TribeLog from pure logging toward guided training while preserving fast Quick Log behavior.

## Scope

### In Scope

- Workouts bottom-nav tab.
- Backend-driven exercise catalog.
- 50 official exercises.
- Exercise Library with search and filters.
- Exercise details with muscle map, Lottie demonstration, form cues, and common mistakes.
- Guided workout session flow.
- Set/reps/weight tracking.
- Rest timer.
- Last-session prefill.
- PR flags.
- Workout history.
- Private/follower/public sharing.
- Public workout discovery.
- Copy public workout to private draft.
- Auto-log finished guided workouts to TribeLog feed.
- Cloud Function-backed PR writes and idempotent finish writes.
- Admin seed path for official content.

### Out Of Scope

- Training plan progression.
- AI-generated plans.
- Coach Pro.
- Real video demonstrations.
- Muscle group heat map.
- Medical recommendations.
- Full backend migration away from Firebase.

## Milestones

### Milestone 0: Review Pack Approval

Deliverables:

- `FOUNDATION_ARCHITECTURE.md`
- Visual proof of concept assets and mockups
- Platform implementation templates
- `PHASE_1_PLAN.md`

Acceptance:

- Claude accepts Firebase-first architecture or explicitly requests a backend migration.
- Navdeep approves visual direction.
- Exercise asset style is approved before generating 50 exercises.

### Milestone 1: Backend Foundation

Deliverables:

- Firestore rules for `exerciseCatalog`, `workoutTemplates`, `publicWorkouts`, and `exercisePRs`.
- Firestore rules that enforce block lists for `publicWorkouts` reads.
- Index updates for catalog filtering and public workout discovery.
- Callable `finishWorkoutSession` Cloud Function contract for PR, activity, feed, and public workout writes.
- Seed script for official exercises.
- Storage path conventions for Lottie/SVG/thumbnail assets.
- Asset versioning and cache invalidation contract.
- Repository contracts documented per platform.

Acceptance:

- Admin can seed a draft and published exercise.
- Signed-in users can read published exercises.
- Non-admin users cannot write official catalog content.
- Private workout sessions remain owner-only.
- Public/follower visibility rules are tested.
- Public workout reads are denied when viewer has blocked owner or owner has blocked viewer.
- Finished workout retries use deterministic `activityLogId`, `feedId`, and `publicWorkoutId`.
- PR docs are written by the Cloud Function, not directly by clients.
- Asset cache behavior uses `assetHash` and never swaps exercise assets mid-active-session.

### Milestone 2: Admin Content Seed Path

Deliverables:

- Admin-only seed/update utility for official exercises.
- Validation for required fields.
- Asset manifest validation.
- Initial 3-5 proof exercises loaded from backend.

Acceptance:

- Catalog content can be changed without app deployment.
- Invalid exercise documents are rejected before publish.
- Existing app users cannot alter official catalog content.

### Milestone 3: Web Workouts Read-Only Library

Deliverables:

- Workouts tab shell.
- Exercise Library.
- Search and filters.
- Exercise detail view.
- Lazy-loaded proof Lottie/SVG assets.

Acceptance:

- Quick Log remains available from Workouts.
- Exercise content loads from backend.
- Empty, loading, and error states are handled.
- UI follows brand tokens.

### Milestone 4: iOS Workouts Read-Only Library

Deliverables:

- SwiftUI Workouts tab shell.
- Catalog repository and ViewModel.
- Exercise Library and detail view.
- Asset loading and cache strategy.

Acceptance:

- Same behavior as Web Milestone 3.
- Build succeeds on device.
- No hardcoded exercise content except offline fallback.

### Milestone 5: Android Workouts Read-Only Library

Deliverables:

- Compose Workouts tab shell.
- Catalog repository and ViewModel.
- Exercise Library and detail view.
- Asset loading and cache strategy.

Acceptance:

- Same behavior as Web/iOS.
- Android build succeeds.
- Google approval status does not block local implementation.

### Milestone 6: Guided Workout MVP

Deliverables:

- Pre-flight verification that `finishWorkoutSession` is deployed in the target Firebase project and callable from Web.
- Select exercises.
- Start workout.
- Active workout state.
- Set/reps/weight entry.
- Rest timer.
- Local active-session persistence.
- Finish workout summary.

Acceptance:

- Web client finish calls target the deployed `finishWorkoutSession` callable, not a local-only stub.
- User can complete a guided workout without network after assets/catalog are cached.
- Rest timer survives app background/foreground.
- Session saves when network is available.
- Abandoned session can be resumed or discarded.

### Milestone 7: History, PRs, And Feed Auto-Log

Deliverables:

- Session history.
- Volume summary.
- Server-trusted PR detection through `finishWorkoutSession`.
- Deterministic activity log write.
- Deterministic Tribe feed card write.

Acceptance:

- Finished guided workout creates one private training session.
- Finished guided workout creates one activity log entry.
- Feed creation failure does not block workout save.
- Repeated finish retries do not create duplicate activity or feed entries.
- PR updates remain correct when the same account uses multiple devices.
- Deleting the activity/session removes or updates related mirrored feed docs.

### Milestone 8: Social Sharing And Copying

Deliverables:

- `@firebase/rules-unit-testing` emulator allow/deny suite for social workout visibility.
- Visibility selector: private, tribe, public.
- Publish/unpublish workout.
- Public workout discovery.
- Copy public workout to private draft.
- Creator attribution preserved.
- Follow/unfollow integration.

Acceptance:

- Private sessions are not readable by other users.
- Tribe visibility is visible only to followers.
- Public workouts are discoverable by signed-in users.
- Copied workouts preserve original creator attribution.
- Blocked users are hidden from discovery surfaces and denied by Firestore rules.
- Emulator rule tests cover owner-only private sessions, follower allow/deny, bidirectional block deny, non-admin catalog write deny, and non-admin PR write deny.

### Milestone 9: 50 Exercise Library Expansion

Deliverables:

- 50 official exercise documents.
- 50 Lottie demonstrations.
- Reusable muscle map highlights.
- Thumbnails.

Acceptance:

- All 50 exercises pass schema validation.
- Assets lazy-load and cache.
- No asset blocks initial Workouts tab render.
- Claude brand audit passes before production release.

### Milestone 10: Phase 1 Release Pack

Deliverables:

- `EXECUTION_PLAN.md`
- `EXECUTION_LOG.md`
- `TEST_REPORT.md`
- `ARCHITECTURE_REVIEW.md`
- `BRAND_AUDIT.md`
- `KNOWN_GAPS.md`
- Store-review notes if app permissions or feature descriptions changed.

Acceptance:

- All platform builds pass.
- Manual QA completed on real iOS device, web, and Android build target.
- Claude review fix list is closed or explicitly deferred.
- Tribe vote prompt prepared for Phase 2 direction.

## First 50 Official Exercises

Upper push:

1. Barbell Bench Press
2. Dumbbell Bench Press
3. Incline Dumbbell Press
4. Push-Up
5. Machine Chest Press
6. Dumbbell Shoulder Press
7. Lateral Raise
8. Dumbbell Chest Fly
9. Triceps Pushdown
10. Bench Dip

Upper pull:

11. Lat Pulldown
12. Pull-Up
13. Assisted Pull-Up
14. Seated Cable Row
15. One-Arm Dumbbell Row
16. Barbell Bent-Over Row
17. Face Pull
18. Rear Delt Fly
19. Dumbbell Biceps Curl
20. Hammer Curl

Lower body:

21. Back Squat
22. Goblet Squat
23. Leg Press
24. Romanian Deadlift
25. Conventional Deadlift
26. Hip Thrust
27. Walking Lunge
28. Bulgarian Split Squat
29. Step-Up
30. Leg Extension
31. Seated Leg Curl
32. Standing Calf Raise
33. Glute Bridge
34. Kettlebell Swing

Core:

35. Plank
36. Side Plank
37. Dead Bug
38. Bird Dog
39. Bicycle Crunch
40. Hanging Knee Raise
41. Russian Twist
42. Mountain Climber

Cardio and conditioning:

43. Treadmill Run
44. Incline Walk
45. Stationary Bike
46. Rowing Machine

Mobility and yoga:

47. Cat-Cow
48. Downward Dog
49. Child's Pose
50. World's Greatest Stretch

## Acceptance Criteria By Layer

### Presentation

- Bottom nav includes Workouts.
- Quick Log is visible and fast.
- Exercise cards show name, muscles, equipment, level, and visual cue.
- Active workout screen has one primary action at a time.
- Timer and set controls are reachable with one thumb on mobile.
- Visibility choices are explicit before public sharing.

### Domain

- Use cases are independently testable.
- PR calculation does not depend on UI.
- Trusted PR writes happen through Cloud Functions.
- Visibility rules are centralized.
- Copy workout use case preserves attribution.
- Finish workout use case calls the server finish function and uses deterministic mirror IDs.

### Data

- Firestore DTOs are mapped to domain entities.
- Missing backend fields fail gracefully.
- Catalog reads are cached.
- Active sessions are locally recoverable.
- Public workout docs are sanitized snapshots.

## Risk Register

| Risk | Impact | Mitigation |
|---|---:|---|
| 50 exercise assets take longer than expected | High | Approve 3-5 proof assets first; generate in batches |
| Lottie support differs by platform | Medium | Test proof animations on all three before expansion |
| Existing app architecture is not fully MVVM | Medium | Apply Clean Architecture inside Workouts boundary first |
| Firestore rule complexity for follower visibility | High | Add focused security tests before UI release |
| Public workout docs leak private session data | High | Use sanitized mapper, never publish raw private session |
| Offline workout state conflicts with backend writes | Medium | Use local session IDs and idempotent finish writes |
| Auto-log creates duplicate feed entries | Medium | Store `feedId` and deterministic `activityLogId` |
| Client-side PR race conditions across devices | High | Use `finishWorkoutSession` Cloud Function transaction for trusted PR writes |
| Cached assets update during active workout | Medium | Cache by `assetHash` and store `assetHashSnapshot` for active sessions |
| Blocked user bypasses client hiding through Firestore | High | Enforce block checks in Firestore rules for `publicWorkouts` reads |
| Health claims in form cues | High | Keep cues educational; no medical or injury-prevention claims |

## Phase Gate Vote

After Phase 1 ships:

```text
What should we build next?

1. Training Plans
2. Custom Workout Builder upgrades
3. Form Video Library
```

Vote should run in-app and on Instagram, but final roadmap decisions should rely on first-party app responses where possible.
