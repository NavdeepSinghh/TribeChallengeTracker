# Milestone 1 Architecture Review

## Status

Completed for Milestone 1.

## Review Checklist

- Firebase-first approach preserved.
- Function logic is separated from Firebase callable wrapper where practical.
- Trusted PR writes are server-side.
- Idempotency is deterministic and documented.
- Firestore rules enforce social visibility and block-list boundaries.
- No UI layer changes in Milestone 1.

## Findings

### Firebase-First Approach

Preserved. No new backend service was introduced.

### Function Boundary

`finishWorkoutSession` is exported as a callable Cloud Function and delegates implementation to `functions/workoutSessionCallableHandlers.js`. Pure helper functions are exported for unit tests.

### Server-Side PR Trust Boundary

Trusted PR writes are handled in the callable transaction. Clients may still show provisional in-session flags later, but direct client writes to `exercisePRs` are blocked by rules.

### Idempotency

Mirror documents use deterministic IDs derived from `sessionId`. Activity log writes replace the existing matching activity entry rather than appending duplicates.

### Security Rules

`publicWorkouts` reads enforce:

- owner access
- admin access
- public visibility
- tribe/follower visibility
- bidirectional block-list denial

### Layering

No UI layer was changed. Milestone 1 only adds backend rules, function foundation, seed validation, tests, and docs.

## Residual Risk

The focused rule checks are static contract tests plus Firestore emulator parse validation. They do not execute allow/deny scenarios against the emulator. Add `@firebase/rules-unit-testing` before public-workout UI rollout if CI must verify rule behavior dynamically.

