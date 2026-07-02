# Claude Checkpoint 18: Advanced Feature Vote And Metrics Plan

Status date: 2026-07-01
Verdict requested: product + architecture review
Scope: Phase 3 vote framework, metric definitions, data thresholds, and privacy posture.

## Requested Verdict

Please return one of:

- APPROVED
- APPROVED WITH FIXES
- BLOCKED
- REVIEW INCONCLUSIVE

## Context

Phase 2 Training Plans are pending Claude review. This checkpoint prepares the Phase 3 decision layer without assuming the tribe vote result.

No Phase 3 production feature is selected here. The purpose is to make the vote options and metric definitions reviewable before implementation begins.

## What Changed

- Added a reviewed JSON plan for Phase 3 vote options and metric definitions.
- Added a validator for the plan so unsupported claim language, duplicate IDs, missing metrics, and malformed thresholds fail fast.
- Added pure domain helpers for:
  - completed-session thresholds
  - training-week counts
  - per-exercise history counts
  - feature readiness messages
  - privacy-safe public metric bucketing
  - privacy posture summaries
- Added focused tests for the plan validator and readiness helpers.

## Claude CP18 Review Result

Claude reviewed CP18 and returned `APPROVED WITH ONE FIX`.

Claude re-reviewed the applied fix and returned `APPROVED` without qualifications. CP19 may proceed as preparation infrastructure for aggregation schemas and admin console updates. User-facing or production UI work that assumes Muscle Volume Heat Maps won the Phase 3 vote must wait until Navdeep has a vote result or explicitly chooses that direction.

Fix applied:

- Raised Progressive Overload Suggestions from 3 completed sessions / 2 target-exercise sessions to 4 completed sessions / 4 target-exercise sessions across at least 2 training weeks.
- Added validator enforcement so too-loose overload thresholds fail fast.
- Added share-card privacy language that a shared card may remain saved outside TribeLog after sharing, even if the original card is later deleted.
- Kept muscle heat map, share card, and exercise-library thresholds unchanged.

## Key Files

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/workout-advanced-metrics-plan.json
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/validate-workout-advanced-metrics-plan.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/domain/workoutInsightMetrics.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/__tests__/workoutAdvancedMetricsPlan.test.js
```

## Vote Options

Question:

```text
What should TribeLog build next for Workouts?
```

Options:

1. Muscle volume heat maps
2. Progressive overload suggestions
3. Bigger exercise library
4. Shareable workout insight cards

Each option includes:

- release shape
- minimum data requirements
- insufficient-data copy
- related metric definition
- trust boundary
- privacy posture

## Metric Definitions

### `weekly_muscle_volume_kg`

For muscle volume heat maps.

Definition:

```text
Sum of reps multiplied by weight for completed sets, grouped by primary muscle and calendar week.
```

Trust boundary:

```text
Server aggregation recommended before public release.
```

Privacy:

```text
Owner-only read. Public cards must use rounded or bucketed values.
```

### `exercise_progression_delta`

For progressive overload suggestions.

Definition:

```text
Comparison of recent completed sets for one exercise against prior best or recent average.
```

Trust boundary:

```text
Server or deterministic local preview; final trusted values should be reproducible.
```

Privacy:

```text
Owner-only read. No automatic public posting.
```

### `catalog_coverage`

For library expansion.

Definition:

```text
Count of published official exercises by category, muscle, equipment, and level.
```

Trust boundary:

```text
Admin-seeded content with schema validation.
```

Privacy:

```text
Public catalog metadata only.
```

### `share_card_snapshot`

For shareable insight cards.

Definition:

```text
User-approved snapshot of selected workout summary fields.
```

Trust boundary:

```text
Client renders preview; user explicitly shares.
```

Privacy:

```text
No precise timestamps, private notes, or unselected exercise details by default.
```

## Data Thresholds

| Feature | Minimum Data |
|---|---|
| Muscle volume heat map | 3 completed sessions, 1 training week, 1 session per displayed muscle group |
| Progressive overload suggestions | 4 completed sessions, 4 sessions for the target exercise, across at least 2 training weeks |
| Expanded exercise library | No personal history required |
| Shareable workout cards | 1 completed session |

## Security And Privacy Notes

- Advanced insights are framed as training trends, not health diagnosis or guaranteed outcomes.
- Private workout details stay private by default.
- Public share cards require explicit user action.
- Shared cards may remain saved outside TribeLog after sharing, even if the original card is later deleted.
- Public metrics should be rounded or bucketed where exact values are not necessary.
- Insufficient-data states are neutral and supportive.

## Verification

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTracker
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/validate-workout-advanced-metrics-plan.js
```

Result:

```text
Validated advanced metrics plan v1: 4 options, 4 metrics.
```

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTracker
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/workoutAdvancedMetricsPlan.test.js --watchAll=false --runInBand
```

Result:

```text
PASS, 6 tests.
```

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTracker
git diff --check
```

Result: passed.

## Known Gaps

Blockers:

- Phase 3 implementation should not start until Navdeep has a tribe vote result or explicitly chooses a direction.

Non-blockers:

- The JSON plan is `draft_pending_tribe_vote`.
- Server aggregation is not implemented in this checkpoint.
- UI for heat maps, overload suggestions, library expansion, and share cards is not implemented in this checkpoint.

## Specific Questions For Claude

1. Are the Phase 3 vote options clear and honest?
2. Are the minimum-data thresholds conservative enough?
3. Is the privacy posture strong enough before volume aggregation and share cards are built?
4. Should progressive overload suggestions require more than two sessions for the target exercise?
5. Are there any App Store / Play Store wording risks in the vote and insufficient-data copy?
