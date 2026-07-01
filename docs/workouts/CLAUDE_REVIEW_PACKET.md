# Claude Review Packet: TribeLog Workouts Pre-Phase 1

## Review Objective

Review Codex's pre-Phase 1 planning artifacts before production implementation begins.

## Revision Summary After First Claude Review

Claude approved the core direction and requested six required fixes before Milestone 1. This revision addresses them as follows:

1. Anatomical Lottie POC added: [anatomical-squat-stick-figure.lottie.json](visual-poc/lottie/anatomical-squat-stick-figure.lottie.json)
2. Muscle map SVG revised with better proportions and clearer pectoral highlight: [bench-press-muscle-map.svg](visual-poc/svg/bench-press-muscle-map.svg)
3. Phase 1 PR writes moved to `finishWorkoutSession` Cloud Function in [Foundation Architecture](FOUNDATION_ARCHITECTURE.md)
4. Deterministic `activityLogId`, `feedId`, and `publicWorkoutId` strategy documented in [Foundation Architecture](FOUNDATION_ARCHITECTURE.md)
5. Firestore block-list enforcement for `publicWorkouts` reads documented in [Foundation Architecture](FOUNDATION_ARCHITECTURE.md) and [Phase 1 Plan](PHASE_1_PLAN.md)
6. Asset versioning and active-session asset snapshot behavior documented in [Foundation Architecture](FOUNDATION_ARCHITECTURE.md)

## Files To Review In Order

1. [Foundation Architecture](FOUNDATION_ARCHITECTURE.md)
2. [Visual Proof Of Concept](visual-poc/README.md)
3. [Platform Templates](templates/README.md)
4. [Phase 1 Plan](PHASE_1_PLAN.md)

## Primary Review Questions

1. Should Phase 1 stay on the existing Firebase/Firestore architecture, or should we accept the larger cost of a new Postgres/API backend now?
2. Does the `publicWorkouts` versus `publicRoutines` split make the social model clearer?
3. Are the Lottie/SVG proof assets acceptable as the production asset direction before generating all 50 exercises?
4. Do the platform templates satisfy MVVM + Clean Architecture expectations inside the Workouts feature boundary?
5. Is the Phase 1 milestone order shippable and reviewable?
6. What must be fixed before Codex starts production implementation?

## Known Intentional Deviations From Original Claude Brief

- Firebase-first instead of Postgres-first.
- Repository/service contracts instead of a new HTTP API for Phase 1.
- Clean Architecture inside the Workouts feature boundary instead of a whole-app architecture rewrite.
- Public completed workouts are modeled separately from reusable routines.

## Suggested Claude Output

Please return:

- Approved / revise decision.
- Required changes before implementation.
- Nice-to-have changes that can wait.
- Any brand or UX issues in the visual proof.
- Any architecture risks that must be reflected in `PHASE_1_PLAN.md`.
