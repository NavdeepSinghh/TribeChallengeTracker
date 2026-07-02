# TribeLog Workouts Foundation Architecture

## Status

Pre-Phase 1 proposal for Claude and Navdeep review. This is not production code.

## Recommendation Summary

Use the existing Firebase stack for Phase 1:

- Firebase Auth for identity.
- Firestore for catalog metadata, user sessions, social sharing, follow edges, and feed cards.
- Firebase Storage or CDN-backed Storage paths for SVG and Lottie assets.
- Existing admin model through `/admins/{uid}` and the existing app-side admin surface.
- Client-side clean architecture boundaries so iOS, Web, and Android can evolve without duplicating business rules inside UI code.

Do not introduce Postgres, Redis, WebSockets, or a new API service in Phase 1 unless there is a hard blocker. The current app already has the primitives this feature needs.

## Existing App Primitives To Reuse

```text
users/{uid}/trainingSessions/{sessionId}
  Existing private training journal storage.

publicProfiles/{uid}
  Existing discoverable/follower-visible profile card.

users/{uid}/following/{targetUid}
users/{uid}/followers/{followerUid}
  Existing follow graph.

publicRoutines/{routineId}
  Existing shared routine/template concept.

tribeFeed/{feedId}
  Existing mirrored activity feed with reactions.

admins/{uid}
  Existing admin authorization check.
```

## Key Data Model Decision

Separate completed workouts from reusable routines:

```text
publicWorkouts
  Completed shared workout sessions.

publicRoutines
  Reusable workout templates that another user can copy and perform.
```

This avoids confusing "I completed this" with "you can follow this template."

## Firestore Collections

### Exercise Catalog

```text
exerciseCatalog/{exerciseId}
  id: string
  slug: string
  name: string
  status: draft | published | archived
  version: number
  primaryMuscles: string[]
  secondaryMuscles: string[]
  equipment: string[]
  level: beginner | intermediate | advanced
  movementPattern: push | pull | squat | hinge | carry | core | cardio | mobility
  instructions: string[]
  formCues: string[]
  commonMistakes: string[]
  substitutions: string[]
  assetManifest:
    lottiePath: string
    thumbnailPath: string
    muscleMapFrontPath: string
    muscleMapBackPath: string
    assetVersion: number
    assetHash: string
  createdAt: timestamp
  updatedAt: timestamp
  updatedBy: uid
```

Read: signed-in users.
Write: admins only.

### Workout Templates

```text
workoutTemplates/{templateId}
  id: string
  name: string
  status: draft | published | archived
  source: official | user | coach
  ownerUid: string | null
  visibility: system | private | tribe | public
  goal: strength | hypertrophy | endurance | mobility | mixed
  level: beginner | intermediate | advanced
  estimatedMinutes: number
  exercises:
    - exerciseId: string
      order: number
      targetSets: number
      targetRepsMin: number
      targetRepsMax: number
      targetWeight: number | null
      restSeconds: number
      notes: string
  copiedFromTemplateId: string | null
  originalCreatorUid: string | null
  originalCreatorDisplayName: string | null
  copiedCount: number
  createdAt: timestamp
  updatedAt: timestamp
```

Official templates are admin-written. User templates are owner-written. Public/follower visibility is enforced through rules and client services.

### Private Workout Sessions

```text
users/{uid}/trainingSessions/{sessionId}
  id: string
  userId: string
  status: active | completed | abandoned
  source: guided | quick_log | copied_public_workout | template
  templateId: string | null
  copiedFromPublicWorkoutId: string | null
  copiedFromTemplateId: string | null
  originalCreatorUid: string | null
  originalCreatorDisplayName: string | null
  name: string
  dateStr: YYYY-MM-DD
  startedAt: timestamp
  completedAt: timestamp | null
  durationSeconds: number
  totalVolumeKg: number
  intensity: easy | steady | hard | max | null
  notes: string
  exercises:
    - exerciseId: string
      nameSnapshot: string
      order: number
      primaryMusclesSnapshot: string[]
      sets:
        - setNumber: number
          reps: number
          weightKg: number
          durationSeconds: number | null
          restSeconds: number | null
          completedAt: timestamp | null
          isWarmup: boolean
          isPR: boolean
  prFlags: string[]
  routineVisibility: private | tribe | public
  publicWorkoutId: string | null
  activityLogId: string | null
  feedId: string | null
  createdAt: timestamp
  updatedAt: timestamp
```

Private session details remain owner-only.

### Public Workouts

```text
publicWorkouts/{publicWorkoutId}
  id: string
  ownerUid: string
  ownerDisplayName: string
  ownerAvatarEmoji: string
  ownerAvatarColor: string
  sourceSessionId: string
  visibility: tribe | public
  name: string
  dateStr: YYYY-MM-DD
  summary: string
  exercises:
    - exerciseId: string
      name: string
      primaryMuscles: string[]
      setCount: number
      repSummary: string
      bestWeightKg: number
  totalVolumeKg: number
  durationSeconds: number
  copiedCount: number
  reactionCounts: map
  publishedAt: timestamp
  updatedAt: timestamp
```

Public docs are sanitized snapshots. They must not contain private notes, raw HealthKit/Health Connect payloads, exact location, device identifiers, or hidden user metadata.

### Personal Records

```text
users/{uid}/exercisePRs/{exerciseId}
  exerciseId: string
  bestWeightKg: number
  bestVolumeKg: number
  bestEstimatedOneRepMaxKg: number
  repRangePRs:
    reps_1_3: number
    reps_4_6: number
    reps_7_10: number
    reps_11_15: number
  updatedFromSessionId: string
  updatedAt: timestamp
```

PR writes are server-side in Phase 1.

Clients may calculate provisional PR flags for in-session feedback, but the trusted record is written by a callable Cloud Function during workout finish. The function receives the final session payload, validates ownership, reads current PR docs, computes updates inside a transaction, and writes `users/{uid}/exercisePRs/{exerciseId}` atomically.

Required function contract:

```text
finishWorkoutSession(payload)
  input:
    uid: auth.uid
    sessionId: string
    finalSession: sanitized session payload
    shareVisibility: private | tribe | public
  transaction:
    1. validate auth.uid owns users/{uid}/trainingSessions/{sessionId}
    2. set users/{uid}/trainingSessions/{sessionId}
    3. compute PR changes from finalSession exercises
    4. set changed users/{uid}/exercisePRs/{exerciseId}
    5. set deterministic users/{uid}/activityLog/{dateStr} activity entry
    6. set deterministic tribeFeed/{feedId} when feed auto-log is enabled
    7. set deterministic publicWorkouts/{publicWorkoutId} when visibility is tribe/public
  output:
    sessionId
    activityLogId
    feedId | null
    publicWorkoutId | null
    prUpdates[]
```

This avoids client race conditions, offline retry duplicate writes, and stale PR summaries across devices.

## Deterministic Idempotency Contract

Finishing a guided workout must be retry-safe. All mirror writes use deterministic IDs and `setDoc`/transactional writes, never `addDoc`.

```text
sessionId:
  generated before workout start and reused for the session lifecycle

activityLogId:
  sha256(sessionId + ":activity").slice(0, 32)

feedId:
  sha256(sessionId + ":feed").slice(0, 32)

publicWorkoutId:
  uid + "_" + sha256(sessionId + ":publicWorkout").slice(0, 32)
```

The private session stores `activityLogId`, `feedId`, and `publicWorkoutId` after finish. Re-running `finishWorkoutSession` with the same `sessionId` overwrites the same documents and must not create duplicates.

Editing a completed workout should call a separate `updateFinishedWorkoutSession` function that rewrites the same deterministic mirror docs and recomputes PR summaries only when the edited session is still the source of the current PR.

## ER Diagram

```text
User
 ├─ has many TrainingSessions
 ├─ has many ExercisePRs
 ├─ follows many Users
 └─ owns many PublicWorkouts

ExerciseCatalog
 ├─ referenced by WorkoutTemplates
 ├─ referenced by TrainingSessions
 └─ referenced by PublicWorkouts

WorkoutTemplate
 ├─ references many ExerciseCatalog items
 └─ can be copied into TrainingSession

TrainingSession
 ├─ may reference WorkoutTemplate
 ├─ may produce PublicWorkout
 ├─ may produce ActivityLog entry
 └─ may produce TribeFeed entry

PublicWorkout
 ├─ references owner User
 ├─ references source TrainingSession by id only
 └─ can be copied into another user's TrainingSession draft
```

## API Contract

Phase 1 can use Firestore repositories directly behind domain interfaces. Document the contract as service methods rather than introducing a new HTTP API immediately.

```yaml
WorkoutCatalogRepository:
  listExercises:
    input: { filters, pageCursor, limit }
    output: { exercises, nextPageCursor }
  getExercise:
    input: { exerciseId }
    output: { exercise }
  listOfficialTemplates:
    input: { filters, pageCursor, limit }
    output: { templates, nextPageCursor }

WorkoutSessionRepository:
  createDraftSession:
    input: { userId, source, templateId?, exercises }
    output: { session }
  saveActiveSession:
    input: { userId, session }
    output: { session }
  finishSession:
    input: { userId, sessionId, finalSession, shareVisibility }
    output: { session, publicWorkout?, feedEntry?, prUpdates }
    note: calls finishWorkoutSession Cloud Function for idempotent activity/feed/PR writes
  listSessionHistory:
    input: { userId, pageCursor, limit }
    output: { sessions, nextPageCursor }

WorkoutSocialRepository:
  listPublicWorkouts:
    input: { viewerUid, filters, pageCursor, limit }
    output: { workouts, nextPageCursor }
  publishWorkout:
    input: { userId, sessionId, visibility }
    output: { publicWorkout }
  unpublishWorkout:
    input: { userId, sessionId }
    output: { ok }
  copyWorkout:
    input: { viewerUid, publicWorkoutId }
    output: { draftSession }
```

If a separate backend API is introduced later, this service contract can become OpenAPI without changing the domain layer.

## Authorization Model

```text
exerciseCatalog
  read: signed-in users
  write: admins

workoutTemplates
  read: published official templates or allowed owner/follower visibility
  write: admins for official; owner for user templates

users/{uid}/trainingSessions
  read/write: owner only

publicWorkouts
  read: public, owner, admin, or follower when visibility is tribe, and neither side has blocked the other
  create/update/delete: owner only

tribeFeed
  read: signed-in users
  create/delete: owner
  update: reaction fields only
```

Block lists are enforced in Firestore rules and also filtered in client queries for UX.

For any `publicWorkouts/{publicWorkoutId}` read, rules must deny access when either of these documents exists:

```text
users/{request.auth.uid}/blockedUsers/{resource.data.ownerUid}
users/{resource.data.ownerUid}/blockedUsers/{request.auth.uid}
```

This prevents a blocked viewer from reading a public workout directly through Firestore. Client-side filtering remains useful for reducing flicker and hiding already-loaded data, but it is not the security boundary.

## Asset Pipeline

```text
source vector / animation files
   ↓
reviewed proof assets
   ↓
export Lottie JSON + SVG muscle maps
   ↓
upload to Firebase Storage/CDN
   ↓
write assetManifest into exerciseCatalog
   ↓
clients lazy-load and cache by assetHash
```

Recommended formats:

- Lottie JSON for exercise demonstrations.
- SVG for reusable muscle maps.
- PNG/WebP thumbnails generated from the Lottie/SVG source for lightweight lists.

## Asset Versioning Strategy

Assets are cached by immutable `assetHash`, not just by path. A catalog document can update its `assetManifest` without requiring an app release.

```text
assetManifest:
  lottiePath: storage/CDN path
  thumbnailPath: storage/CDN path
  muscleMapFrontPath: storage/CDN path
  muscleMapBackPath: storage/CDN path
  assetVersion: monotonically increasing integer
  assetHash: content hash for this exact asset bundle
```

Client behavior:

1. On catalog read, compare `assetManifest.assetHash` with the cached hash.
2. If the hash is new, download the new asset bundle in the background.
3. Mark the asset bundle ready only after every required file validates locally.
4. Use the new asset for new screens and newly started workouts.
5. Do not swap assets in the middle of an active workout. The active session stores `assetHashSnapshot` per exercise and keeps rendering that version until the session finishes or is discarded.
6. If an asset fetch fails, keep the last known valid bundle and show a non-blocking stale-asset state only in admin/debug surfaces.

Catalog versioning and asset versioning are separate:

```text
exerciseCatalog.version
  changes when exercise content changes.

assetManifest.assetVersion
  changes when animation, thumbnail, or muscle-map assets change.
```

## Offline Model

Backend-driven content does not mean backend-dependent active workouts.

```text
Catalog:
  Cache last successful exerciseCatalog and workoutTemplates.

Assets:
  Lazy-load and cache Lottie/SVG by assetHash.

Active session:
  Store current workout state locally every set/rest transition.
  Store assetHashSnapshot for rendered exercise assets.
  Sync to Firestore when online.

Finish:
  Queue finishWorkoutSession Cloud Function call if offline.
  Retry with the same sessionId and deterministic mirror IDs.
```

## Platform Architecture

Use Clean Architecture inside the Workouts feature boundary.

```text
Presentation
  Screens, components, SwiftUI Views, Compose UI
  ViewModels expose immutable UI state

Domain
  Entities
  Use cases
  Repository interfaces

Data
  Firestore DTOs
  Mappers
  Repository implementations
  Local cache implementations
```

This should be introduced feature-by-feature. Do not block Phase 1 on refactoring the entire existing app.

## Feature Flags

Recommended flags:

```text
workouts_tab_enabled
exercise_catalog_backend_enabled
guided_workout_enabled
public_workouts_enabled
copy_workout_enabled
workout_feed_autolog_enabled
workout_admin_catalog_enabled
```

Use the existing feature flag pattern first. Move to a managed platform only if rollout complexity justifies it.

## Analytics Events

```text
workouts_tab_viewed
exercise_library_search
exercise_detail_viewed
guided_workout_started
guided_workout_set_completed
guided_workout_finished
workout_shared
workout_copied
public_workout_viewed
```

No health or medical claims should be inferred from analytics.

## Major Deviations From Claude Proposal

1. Backend stack: Firebase first, not Postgres first.
2. API style: repository contracts first, not HTTP API first.
3. Clean Architecture scope: Workouts feature boundary first, not whole-app rewrite.
4. Realtime: Firestore listeners where needed, not WebSockets.
5. Redis: not needed in Phase 1.

These deviations reduce delivery risk and preserve production momentum.
