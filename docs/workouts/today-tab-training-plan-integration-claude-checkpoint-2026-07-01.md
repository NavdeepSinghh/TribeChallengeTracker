# Claude Checkpoint 14: Today Tab Training Plan Integration

Status date: 2026-07-01
Verdict requested: product UX + architecture review
Scope: Web Today tab integration for active Training Plans.

## Summary

Checkpoint 14 makes the challenge Today tab aware of a user's active Training Plan.

The goal is to move TribeLog closer to "open the app and know what to do today" while preserving the existing logger-first challenge flow. The existing challenge tasks, points preview, and quick log action remain intact. The new Training Plan card sits above the challenge task list and is optional:

- No active plan: supportive empty state and "Browse plans" handoff to Workouts.
- Active workout day: shows today's plan workout, exercise count, estimated minutes, first movements, and "Continue plan workout".
- Rest/recovery day: shows recovery copy without pressure or guilt.
- Missed prior workout days: shows a gentle comeback note without resets, streak threats, shame, or fake urgency.

No trusted server writes were added in this checkpoint.

## Files Changed

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/domain/trainingPlanModels.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/challengeTracker/useTodayTrainingPlanCardState.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/challengeTracker/TodayTrainingPlanCard.jsx
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/challengeTracker/TodayTab.jsx
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/ChallengeTrackerScreen.jsx
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/ChallengesTab.jsx
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/challenges/ChallengesTabContent.jsx
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/app/challengesTabProps.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/__tests__/todayTrainingPlanCard.test.js
```

## Behavior Added

- Adds `countMissedTrainingPlanWorkouts(plan, enrollment, today)` as a pure domain helper.
- Adds `useTodayTrainingPlanCardState`, a presentation hook that depends only on Training Plan use cases.
- Adds `TodayTrainingPlanCard`, a testable card component with injected view model support.
- Mounts the card in `TodayTab` above the existing challenge checklist.
- Threads an optional `onOpenWorkouts` callback from the app shell to the challenge tracker.
- Uses the existing `board` tab as the Workouts destination.

## Architecture Notes

- `TodayTrainingPlanCard.jsx` does not import Firestore.
- `useTodayTrainingPlanCardState.js` does not import Firestore.
- The hook calls existing use cases: `loadTrainingPlans`, `loadEnrollments`, and `selectTodayWorkout`.
- `ChallengeTrackerScreen.jsx` is the composition boundary for this slice and creates Training Plan use cases once with `useMemo`.
- App navigation is injected as `onOpenWorkouts`; the card itself does not know about app tabs.
- All missed-workout calculation is read-only and client-side. It is not used for badge awards, feed writes, PRs, or trusted adherence metrics.

## Verification

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTracker
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/todayTrainingPlanCard.test.js src/__tests__/trainingPlansFoundation.test.js --watchAll=false --runInBand
```

Result: `PASS`, 12 tests.

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTracker
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run build
```

Result: `Compiled successfully.`

## Test Coverage

```text
src/__tests__/todayTrainingPlanCard.test.js
```

Covers:

- Missed workout counting ignores rest days.
- Completed/skipped plan day keys suppress missed count.
- No-active-plan empty state keeps Today useful and routes to Workouts.
- Workout-day state shows plan name, workout name, exercise count, minutes, comeback copy, and continue CTA.
- Rest-day state shows recovery copy and no comeback warning.

Existing training plan foundation tests were rerun alongside the new Today tests.

## Known Gaps

- This checkpoint is Web-only. iOS and Android Today/Home surfaces still need native parity if we decide Today-plan prompts should live outside the Workouts tab on native.
- The card opens the Workouts tab but does not deep-link into a specific guided workout session yet.
- Completing/skipping today from the card is intentionally deferred to Checkpoint 15/16 because those become trusted adherence/customization flows.
- No live screenshot was captured in this checkpoint.

## Questions For Claude

1. Does this preserve the logger-first Today tab flow while adding useful trainer guidance?
2. Is the comeback/missed-workout copy supportive enough, with no guilt or dark pattern?
3. Is `ChallengeTrackerScreen` an acceptable composition boundary for this Web slice?
4. Should native Today/Home parity be required immediately, or can it be a follow-up checkpoint after Web UX is approved?
5. Should "Continue plan workout" remain a Workouts-tab handoff for now, or should the next checkpoint add deep-linking directly into guided session setup?
