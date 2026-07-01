# Milestone 1 Execution Plan: Backend Foundation

## Objective

Implement the backend foundation for the approved Workouts Phase 1 plan without changing production UI.

## Scope

- Firestore rules for backend-driven exercise catalog content.
- Firestore rules for official/user workout templates.
- Firestore rules for public workout sharing with follower and block-list enforcement.
- Owner-readable, server-written personal record docs.
- `finishWorkoutSession` callable Cloud Function foundation.
- Deterministic mirror IDs for activity log, feed, and public workout writes.
- Firestore composite indexes for planned catalog/discovery queries.
- Focused tests for idempotency helpers and backend rule/index contracts.

## Architecture Decisions

### Firebase First

Use the existing Firebase stack. No new HTTP API or Postgres service is introduced in Milestone 1.

### Callable Function Boundary

`finishWorkoutSession` owns trusted finish behavior:

- save final private session
- compute and write PRs
- write deterministic activity log mirror
- write deterministic tribe feed mirror
- write deterministic public workout mirror when visibility is `tribe` or `public`

### Deterministic IDs

```text
activityLogId = sha256(sessionId + ":activity").slice(0, 32)
feedId = sha256(sessionId + ":feed").slice(0, 32)
publicWorkoutId = uid + "_" + sha256(sessionId + ":publicWorkout").slice(0, 32)
```

### Rules-Level Blocking

`publicWorkouts` reads must deny access if either side has blocked the other:

```text
users/{viewerUid}/blockedUsers/{ownerUid}
users/{ownerUid}/blockedUsers/{viewerUid}
```

## Composite Index Choices

Planned indexes:

- `exerciseCatalog`: `status ASC, name ASC`
- `exerciseCatalog`: `status ASC, level ASC, name ASC`
- `exerciseCatalog`: `status ASC, primaryMuscles ARRAY_CONTAINS, name ASC`
- `exerciseCatalog`: `status ASC, equipment ARRAY_CONTAINS, name ASC`
- `workoutTemplates`: `status ASC, visibility ASC, updatedAt DESC`
- `workoutTemplates`: `ownerUid ASC, updatedAt DESC`
- `publicWorkouts`: `visibility ASC, publishedAt DESC`
- `publicWorkouts`: `ownerUid ASC, publishedAt DESC`
- `publicWorkouts`: `visibility ASC, ownerUid ASC, publishedAt DESC`

## Acceptance Criteria

- Rules expose published exercise catalog to signed-in users.
- Rules keep draft/archived catalog admin-only.
- Rules keep private training sessions owner-only.
- Rules keep exercise PR writes admin/server only.
- Rules deny `publicWorkouts` reads for blocked relationships.
- `finishWorkoutSession` helper tests prove retry-safe deterministic IDs.
- PR calculation test proves server-side trust boundary can detect updates.
- Index file includes planned catalog and public discovery queries.

## Out Of Scope

- Workouts UI.
- Exercise catalog client repositories.
- Admin console screens.
- Full emulator security suite.
- Generating the remaining 47 exercise animations.

