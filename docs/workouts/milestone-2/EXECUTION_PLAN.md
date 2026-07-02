# Milestone 2 Execution Plan: Admin Content Seed Path

## Objective

Harden the admin-only content seed path for official workout exercises and address the three soft fixes from Claude's Milestone 1 review.

## Scope

- Admin-only seed/update utility for official exercise catalog records.
- Required-field validation for exercise content.
- Asset manifest validation for Lottie, thumbnail, and muscle-map paths.
- Initial 3 proof exercise records ready for backend loading.
- Tighten direct `publicWorkouts` write rules.
- Align feed points with session points.
- Track `@firebase/rules-unit-testing` as a Milestone 8 gate.

## Out Of Scope

- Public UI for admin content editing.
- Live Firestore write without explicit admin UID and credentials.
- Generating the remaining exercise animation batch.
- Full emulator allow/deny test suite.

## Admin Seed Contract

Dry run:

```bash
node scripts/seed-workout-exercise-catalog.js
```

Live apply:

```bash
node scripts/seed-workout-exercise-catalog.js --apply --admin-uid <uid>
```

Apply mode refuses to write unless:

- `--admin-uid` is present and valid.
- Firebase Admin SDK credentials are available locally.
- `/admins/{adminUid}` exists.
- all seed records pass schema and asset validation.

## Proof Exercises

Initial seed file:

```text
scripts/workout-exercise-seed.json
```

Records:

- `goblet_squat`
- `push_up`
- `plank`

## Acceptance Criteria

- Dry-run seed validation passes.
- Apply mode is admin-gated.
- Seed payloads stamp `updatedBy`.
- Asset manifest paths follow `workouts/exercises/vN/{exerciseId}/...`.
- Tests cover the seed path.
- `publicWorkouts` direct writes require an owned source session.
- Feed points match activity points when a session provides points.
- Phase 1 plan tracks `@firebase/rules-unit-testing` before Milestone 8.
