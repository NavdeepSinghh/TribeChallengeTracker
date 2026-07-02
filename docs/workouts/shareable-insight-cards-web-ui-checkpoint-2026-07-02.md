# Shareable Insight Cards Web UI Checkpoint

Date: 2026-07-02

## Scope

Adds the first explicit Web UI for Phase 3 shareable workout insight cards inside `Progress > History`.

This does not add a new Workouts hub entry. It stays inside the Progress subflow to keep the Workouts tab low-cognitive-load.

## What Changed

- Added `WorkoutInsightSharePanel`.
- Embedded it after history metrics, insight cards, volume trend, sessions, and PRs.
- Supports three private-preview card types when source data exists:
  - latest guided workout summary
  - weekly muscle volume
  - personal record
- Uses existing privacy-safe domain helpers:
  - `buildWorkoutSummaryShareCard`
  - `buildMuscleVolumeShareCard`
  - `buildPersonalRecordShareCard`
  - `buildWorkoutShareCaption`

## Product Guardrails

- Cards are preview-only until the user taps `Share`.
- Copy/share is explicit user action.
- Private notes, exact timestamps, source session IDs, and raw set logs stay excluded by the domain helpers.
- No unsupported medical or guaranteed outcome wording is allowed in generated captions.
- The panel is Web-only for this checkpoint; native parity should follow after review.

## Files

```text
src/workouts/presentation/tab/progress/panels/WorkoutInsightSharePanel.jsx
src/workouts/presentation/WorkoutHistorySection.jsx
src/workouts/presentation/tab/progress/ProgressFlow.jsx
```

## Verification

Passed:

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/workoutShareInsights.test.js src/__tests__/workoutInsightModels.test.js src/__tests__/workoutInsightsViewModel.test.js --watchAll=false --runInBand
```

Result:

```text
3 test suites passed
12 tests passed
```

Passed:

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run build
```

Result:

```text
Compiled successfully.
```

Passed:

```bash
git diff --check
```

## Claude Questions

1. Is the share-card preview panel acceptable inside `Progress > History`, or should it move behind a secondary "Share" mode inside Progress?
2. Is caption-only share acceptable for the first Web checkpoint, or should image generation be required before native parity?
3. Are the three card types enough for launch, or should personal record cards wait until PR naming is more polished?
