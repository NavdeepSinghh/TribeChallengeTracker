# Guided Workout State Machine Proposal

## Review Purpose

This is the M6 state-machine proposal for Claude review. It documents the intended guided workout behavior before M7 builds on top of finished sessions, history, PRs, and feed mirroring.

## State Model

```text
idle
  -> loadingCatalog
  -> selecting
  -> active
  -> resting
  -> finishing
  -> pendingSync
  -> finished
  -> failed
```

## State Definitions

| State | Meaning | Allowed next states |
|---|---|---|
| `idle` | No catalog/session loaded yet | `loadingCatalog` |
| `loadingCatalog` | Catalog loading for exercise selection | `selecting`, `failed` |
| `selecting` | User chooses 1-6 backend catalog exercises | `active`, `idle` |
| `active` | User edits/completes the current set | `resting`, `finishing`, `selecting` |
| `resting` | Timer runs after set completion | `active`, `finishing` |
| `finishing` | Finish payload submitted to `finishWorkoutSession` | `finished`, `pendingSync`, `failed` |
| `pendingSync` | Finish payload saved locally after submission failure | `finishing`, `selecting` |
| `finished` | Server accepted the finished workout | `selecting` |
| `failed` | Catalog/session action failed | previous recoverable state |

## Domain-Owned Transitions

Domain logic owns:

- Creating a session from catalog exercises.
- Capturing `nameSnapshot`, `primaryMusclesSnapshot`, and `assetHashSnapshot`.
- Updating reps/weight for a draft set.
- Completing a set and moving active pointers.
- Starting/resting/ticking rest state.
- Calculating total volume, duration, completed set counts, and points.
- Building a finish payload with completed sets only.

## Data-Owned Side Effects

Repositories/services own:

- Active session persistence.
- Pending finish persistence.
- Backend finish submission.
- Restoring active or pending state at app launch.
- Clearing active session only after successful finish or explicit discard.

## Presentation-Owned Behavior

ViewModels own:

- Mapping domain state to UI state.
- Enforcing selection limits.
- Starting/stopping timer loops.
- Coordinating retry/discard actions.
- Showing provisional finish status while the server remains the trusted writer.
- Unit-tested start, finish-failure, pending-sync, and retry transitions on iOS and Android.

Views own:

- Rendering selection, active, rest, pending, finished, and error states.
- Collecting reps/weight inputs.
- Calling ViewModel actions only.

## Idempotency And Trust Boundary

- Clients build one finish payload per `sessionId`.
- `finishWorkoutSession` remains the trusted server boundary for PRs, activity logs, feed mirrors, and public workout documents.
- Client-side PR flags are allowed only as provisional UI, not trusted records.
- Pending retry must resubmit the same `sessionId` so deterministic server IDs prevent duplicate activity/feed writes.

## Required M6 Review Decisions

1. Whether direct HTTPS callable usage on iOS/Android is acceptable for MVP, or whether native Firebase Functions SDKs are required before release.
2. Whether the new guided workout-specific native ViewModel tests are sufficient for M7 to proceed.
3. Whether M7 can proceed with Cloud Function deployment as a release blocker, or whether deployment/smoke test must happen before M7 implementation.
