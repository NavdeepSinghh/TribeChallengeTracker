# Milestone 6 Known Gaps: Guided Workout MVP

## Release Blockers

1. `finishWorkoutSession` has not been deployed during this milestone.
   - Clients are wired to the production endpoint shape.
   - No live authenticated finish smoke test was run.
   - Production release should not proceed until deployment and smoke test pass.

2. iOS and Android use direct HTTPS calls to the callable endpoint.
   - This may be acceptable, but Claude should review whether the native Firebase Functions SDK should be required before release.

3. Live seed still needs coordination.
   - The guided picker depends on `exerciseCatalog` having published exercises.
   - Empty state works, but full user QA requires seeded data.

## Test Gaps

- iOS and Android now have guided workout domain/ViewModel tests for session creation, set completion, finish payload filtering, pending finish persistence, and retry cleanup.
- No live end-to-end finish test.
- No background/foreground device QA for timer persistence.
- No race/retry test against a deployed callable endpoint.

## Product Gaps

- No workout template saving yet.
- No workout history UI yet.
- No edit-completed-session flow yet.
- No public discovery/copy flow yet.
- No plan-based "what should I do today" recommendation yet.

## Asset Gaps

- Guided workout uses existing catalog asset metadata and captures `assetHashSnapshot`.
- The Milestone 9 Firebase Storage asset pipeline is still required before scaling to 50 exercises.

## Documentation Gaps

- Static screenshots are included for brand review.
- Live platform screenshots should be added once seeded data and deployed function are available.
