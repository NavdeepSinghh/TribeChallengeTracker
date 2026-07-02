# Phase 3 Progress Insights UI Checkpoint

Date: 2026-07-02

## Verdict Requested

Please review the first user-facing Phase 3 surface after the launch-surface decision:

- Progressive Overload Suggestions inside `Progress > History`
- Weekly Muscle Volume summary inside `Progress > History`
- Public workout trend ranking inside `Explore > Tribe workouts`

## Claude Final Verdict

Final review status: `APPROVED` for Web preview and native parity work.

Claude first blocked the checkpoint because the review packet did not include the new-file contents and a few UI/architecture details were not verifiable. After the V2 packet and closeout fixes, Claude accepted the implementation.

Final release boundary:

- Web can proceed as preview.
- Native parity work can proceed.
- iOS/Android parity and real-device screenshots remain required before public/user-facing release.
- The standing Lottie/CORS visual check remains part of native release QA.

## Product Decision

The Workouts hub remains low-cognitive-load. No new top-level entry point was added.

Phase 3 intelligence now appears inside the existing `Progress` subflow, using compact cards underneath the trusted workout-history summary.

## Implementation Summary

### Scope Clarification

`BoardTab.jsx` already moved to the `hub/start/plans/progress/explore` flow model during the previously reviewed Workouts tab information-architecture pass. That restructuring is included in the local diff because the branch is not committed yet, but it is not new scope for this checkpoint.

This checkpoint adds:

- the insight data/domain/presentation layer
- the two `Progress > History` insight cards
- trend ranking/display refinement inside `Explore > Tribe workouts`

It does not add another top-level Workouts hub entry.

### Domain

- `src/workouts/domain/workoutInsightModels.js`
  - maps progression suggestion docs
  - maps weekly muscle-volume aggregate docs
  - selects a progression exercise candidate from already-loaded history
  - builds transparent UI copy for ready and insufficient-data states
  - builds relative muscle-volume intensity for the heat-map-style card

- `src/workouts/domain/workoutInsightUseCases.js`
  - repository-backed load/sync use cases
  - pure selection/copy/volume insight use cases

- `src/workouts/domain/workoutSocialUseCases.js`
  - ranks public discovery results with existing trend scoring before presentation

### Data

- `src/workouts/data/firestoreWorkoutInsightRepository.js`
  - only layer that imports Firestore / Cloud Functions
  - reads owner-private `workoutProgressionSuggestions`
  - reads owner-private `workoutInsightAggregates`
  - calls rate-limited `syncWorkoutProgressionSuggestions`
  - calls rate-limited `syncWorkoutInsightAggregates`

Existing public-workout discovery data repository remains the only Firestore boundary for public workouts.

### Composition

- `src/workouts/workoutInsightComposition.js`
  - single composition root for insight use cases

### Presentation

- `src/workouts/presentation/useWorkoutInsightsViewModel.js`
  - loads insight docs
  - does not fetch workout history
  - receives already-loaded sessions from `WorkoutHistorySection`
  - refreshes callables only after explicit user action
  - prefers structured callable `retryAfterSeconds` metadata before legacy message parsing
  - disables refresh buttons during client cooldown countdowns

- `src/workouts/presentation/tab/progress/panels/ProgressiveOverloadInsightPanel.jsx`
  - shows ready / insufficient-data / empty states
  - uses conservative copy
  - user can ignore or refresh suggestion
  - shows `Try in Xs` during rate-limit cooldown

- `src/workouts/presentation/tab/progress/panels/MuscleVolumeHeatMapPanel.jsx`
  - shows top weekly muscle groups as relative bars
  - explains insufficient-data state
  - uses rounded weekly volume only
  - uses `Refresh weekly read` copy instead of `Update`
  - shows `Try in Xs` during rate-limit cooldown

- `src/workouts/presentation/PublicWorkoutDiscoverySection.jsx`
  - shows a qualitative `TRENDING` badge when score is high
  - does not expose raw numeric trend score
  - does not add a new discovery surface

- `src/workouts/presentation/WorkoutHistorySection.jsx`
  - embeds the Phase 3 cards in loaded history state
  - passes existing history sessions to the insight ViewModel
  - passes profile/onboarding level to progression sync instead of always using beginner

## Architecture Notes

- Presentation has no Firestore imports.
- ViewModel has no Firestore imports.
- Data repository is the only SDK boundary.
- Progress insights do not create another workout-history fetch.
- Broad sync callables are user-triggered, rate-limited, and deployed.

## V2 Claude Fixes Closed

- Included actual new-file contents in the review packet.
- Clarified `BoardTab.jsx` restructuring came from the earlier Workouts IA pass.
- Removed raw numeric trend-score display from Explore.
- Kept only qualitative `TRENDING` badge display.
- Added structured callable retry details: `retryAfterSeconds`.
- Added client cooldown countdowns for progression and muscle-volume refresh.
- Changed muscle-volume button copy to `Refresh weekly read`.
- Mapped profile/onboarding level to progression level (`beginner`, `intermediate`, `advanced`).
- Moved trend badge threshold into a named constant.

## Final Claude Closeout Fixes

- Structured callable details now include `{ reason, retryAfterSeconds }` for rate limits.
- Client cooldown parsing prefers `error.details.retryAfterSeconds` and only falls back to legacy message parsing.
- Retry metadata tests cover structured details, legacy message fallback, and missing metadata.
- Progression insight level now maps from `userProfile.onboarding.level` instead of hardcoding `beginner`.
- Public workout trend threshold is a named constant.
- `syncWorkoutInsightAggregates` and `syncWorkoutProgressionSuggestions` were redeployed to `australia-southeast1`.

## Verification

Passed:

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/workoutInsightModels.test.js src/__tests__/workoutInsightRateLimit.test.js src/__tests__/workoutsHistory.test.js src/__tests__/workoutProgressionSuggestions.test.js src/__tests__/workoutInsightAggregation.test.js --watchAll=false --runInBand
```

Result:

```text
5 test suites passed
26 tests passed
```

After V2 fixes:

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/workoutInsightModels.test.js src/__tests__/workoutInsightsViewModel.test.js src/__tests__/workoutInsightRateLimit.test.js src/__tests__/workoutsHistory.test.js src/__tests__/workoutsSocial.test.js src/__tests__/workoutShareInsights.test.js src/__tests__/workoutProgressionSuggestions.test.js src/__tests__/workoutInsightAggregation.test.js --watchAll=false --runInBand
```

Result:

```text
8 test suites passed
37 tests passed
```

Passed:

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/workoutsSocial.test.js src/__tests__/workoutShareInsights.test.js --watchAll=false --runInBand
```

Result:

```text
2 test suites passed
8 tests passed
```

Passed:

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run workouts:phase3:foundation-check
```

Result:

```text
Validated advanced metrics plan v1: 4 options, 4 metrics.
Validated 150 expansion candidates across 7 groups.
8 test suites passed
44 tests passed
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

Deployed after structured cooldown details were added:

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" firebase deploy --only functions:syncWorkoutInsightAggregates,functions:syncWorkoutProgressionSuggestions
```

## Open Questions For Claude

1. Is it acceptable for the first Web Phase 3 UI to show both progression and muscle-volume cards inside `Progress > History`, or should muscle volume remain hidden until after progression ships alone?
2. Does the candidate selection logic feel transparent enough for launch?
3. Is the explicit client cooldown and softer "Refresh weekly read" copy safe enough for the muscle-volume sync action?
4. Is qualitative trend-badge display inside Explore acceptable, or should trend ranking remain invisible sorting only?
5. Before native parity, should this be treated as Web-only preview or blocked from public release?

## Known Gaps

- iOS parity not implemented in this checkpoint.
- Android parity not implemented in this checkpoint.
- Real-device screenshots still required before user-facing release.
- Share-card UI is not added yet; existing share-card domain helpers remain private-preview foundations.
- The 200+ exercise expansion remains a validated candidate backlog, not a seeded production catalog.
