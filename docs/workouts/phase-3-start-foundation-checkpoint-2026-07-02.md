# Phase 3 Start: Depth And Intelligence Foundation

Status date: 2026-07-02
Status: Phase 3 started with backend trust, private insight rules, deployment, and production smoke.

## Scope

This checkpoint starts Phase 3 by closing the backend safety gates for:

- weekly muscle-volume aggregates
- progressive overload suggestions
- advanced metric readiness thresholds
- 200+ exercise expansion backlog validation
- share-card privacy payload helpers

No public Phase 3 UI is shipped in this checkpoint.

## Completed

- Added Firestore emulator allow/deny tests for private insight collections:
  - `users/{uid}/workoutInsightAggregates/{aggregateId}`
  - `users/{uid}/workoutProgressionSuggestions/{exerciseId}`
- Added `npm run test:workouts-phase3-rules`.
- Added `npm run workouts:phase3:foundation-check`.
- Deployed Phase 3 callables to `australia-southeast1`:
  - `syncWorkoutInsightAggregates`
  - `syncWorkoutProgressionSuggestions`
- Added per-user cooldown and global rolling-window rate limiting to both Phase 3 sync callables before user-facing UI.
- Ran signed-in production smoke with temporary App Review account workout history.
- Cleaned all smoke-only sessions, aggregate docs, and suggestion docs after verification.

## Production Smoke Result

Temporary exercise:

```text
phase3_smoke_press
```

Verified:

- `syncWorkoutInsightAggregates` returned `weekly_2026-W27`
- weekly aggregate had enough completed sessions and was not insufficient-data
- aggregate included expected smoke muscle groups: `chest`, `triceps`
- `syncWorkoutProgressionSuggestions` returned `ready`
- progression suggestion observed 4 sessions across 2 training weeks
- suggested next step was conservative: `65 kg x 10 reps`
- temporary data was cleaned after smoke

## Verification

Passed:

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run workouts:phase3:foundation-check
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run test:workouts-phase3-rules
```

The foundation check includes:

- advanced metrics plan validator
- 200+ exercise expansion candidate validator
- metric readiness tests
- muscle volume aggregation tests
- progression suggestion tests
- exercise expansion candidate tests
- share insight privacy tests

The rules check includes:

- owner can read own weekly muscle-volume aggregate
- non-owner and guest cannot read another user's aggregate
- owner can read own progression suggestion
- non-owner and guest cannot read another user's suggestion
- normal clients cannot write private insight docs
- admins can write insight docs for support/backfill/function-equivalent maintenance

## Still Required Before User-Facing Phase 3 UI

- Build Web UI for the selected Phase 3 surface.
- Add iOS and Android parity.
- Add real screenshots for Web, iOS, and Android.
- Keep deployed rate limiting in place before exposing user-triggered sync buttons broadly.
- Ship Progressive Overload Suggestions first unless Navdeep explicitly changes the Phase 3 launch sequence.
- Launch-surface decision is documented in `phase-3-launch-surface-decision-2026-07-02.md`: start with Progressive Overload Suggestions inside Progress.

## Notes

- Firebase deploy still warns that Node.js 20 is deprecated and will be decommissioned on 2026-10-30. Track runtime upgrade separately.
- `firebase-functions` package remains outdated; upgrade should be handled in a dedicated backend maintenance pass.
