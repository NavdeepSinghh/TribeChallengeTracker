# Claude Checkpoint 20: Progressive Overload And Intensity

Status date: 2026-07-01
Verdict requested: backend trust + coaching-safety review
Scope: owner-only progressive overload suggestion foundation and transparent workout intensity scoring.

Claude verdict: `APPROVED WITH TWO STRONG RECOMMENDATIONS`.

Claude approved this checkpoint as vote-independent backend prep. The two strong recommendations are tracked below:

- Keep the current low-rep behavior documented until prescription metadata exists. The current suggestion logic assumes moderate-rep training and remains conservative for low-rep strength work.
- Reshape intensity presentation before any UI ships. The 0-100 computation may remain internal/debug-only for now, but public UI should prioritize raw session facts over a comparative score.

Pre-review alignment fix:

- Updated the implementation from the early 2-session prototype to the CP18-approved threshold: 4 target-exercise sessions across 2 training weeks.
- Removed raw session IDs from owner-readable suggestion documents.
- Added tests for the 2-training-week gate and session-ID minimization.

## Requested Verdict

Please return one of:

- APPROVED
- APPROVED WITH FIXES
- BLOCKED
- REVIEW INCONCLUSIVE

## Context

Checkpoint 18 defined `progressive_overload_suggestions` as a possible Phase 3 direction. This checkpoint implements the backend foundation without shipping user-facing UI yet.

The design is intentionally conservative:

- no suggestion until the user has at least four completed sessions for the exercise
- no suggestion until that exercise has been logged across at least two training weeks
- explain the suggestion plainly
- prefer adding reps before adding weight unless recent performance supports a small weight increase
- store suggestions privately under the owner
- never auto-post suggestions publicly

## What Changed

- Added pure progression helper functions.
- Added `syncWorkoutProgressionSuggestions` callable export in `australia-southeast1`.
- Added owner-readable/admin-writable Firestore rules for `users/{uid}/workoutProgressionSuggestions/{exerciseId}`.
- Added account deletion cleanup for progression suggestions.
- Added transparent workout intensity score helper based on volume, set count, and duration.
- Added tests for:
  - insufficient data
  - conservative weight increase
  - rep-first suggestion
  - completed-session filtering
  - 2-training-week threshold
  - raw session ID minimization
  - intensity score factors
  - rule/function/deletion contract

## Key Files

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/functions/workoutProgressionSuggestionHandlers.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/functions/index.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/functions/accountDeletionCallableHandlers.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/firestore.rules
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/__tests__/workoutProgressionSuggestions.test.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/advanced-feature-vote-and-metrics-plan-claude-checkpoint-2026-07-01.md
```

## Suggestion Logic

Minimum:

```text
4 completed sessions for the target exercise across at least 2 training weeks.
```

If the latest best set is stable or better than the previous best set and reaches 10+ reps at a non-zero weight:

```text
Suggest a small weight increase.
```

Otherwise:

```text
Suggest adding 1 rep at the same weight.
```

Current weight increments:

| Level | Increment |
|---|---|
| Beginner | 1.25 kg |
| Intermediate | 2.5 kg |
| Advanced | 2.5 kg |

The suggestion is framed as optional:

```text
Try a small weight increase and keep the reps controlled.
```

or:

```text
Keep the same weight and add 1 rep if form still feels controlled.
```

Low-rep prescription note:

```text
The current suggestion assumes moderate-rep training around 8-12 reps.
For strength-focused low-rep work, the algorithm stays conservative and may keep suggesting +1 rep at the same weight.
Future prescription-aware logic should handle low-rep schemes once plan/exercise prescription metadata is richer.
```

## Intensity Score

The helper returns:

```js
{
  score: 0-100,
  label: "steady" | "moderate" | "high",
  factors: {
    totalVolumeKg,
    setCount,
    durationMinutes
  }
}
```

This is not a health score. It is a workout-session training load shorthand built from visible session facts.

Claude UI-framing requirement before any public intensity UI ships:

- Reframe from "score" to "session summary" and lead with raw facts such as volume, set count, and duration.
- Avoid surfacing a 0-100 value to users unless a later review explicitly approves it.
- Avoid "steady/moderate/high intensity" copy in user-facing UI unless the label is grounded in observable facts such as "high-volume session."
- Never surface intensity tiers in public/social/share contexts.
- Keep the current helper internal/backend-only until the UI framing is reviewed.

## Trust And Privacy Model

Collection:

```text
users/{uid}/workoutProgressionSuggestions/{exerciseId}
```

Rules:

- owner/admin can read
- admin/function can write
- normal clients cannot write
- suggestion docs do not include raw training session IDs

Callable:

```text
syncWorkoutProgressionSuggestions
```

Region:

```text
australia-southeast1
```

Input:

```js
{
  exerciseId: "bench_press",
  level: "intermediate"
}
```

Output:

```js
{
  exerciseId: "bench_press",
  status: "ready",
  observedSessions: 4,
  observedTrainingWeeks: 2,
  suggestion: {
    type: "weight",
    targetWeightKg: 65,
    targetReps: 10
  }
}
```

## Verification

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTracker
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/workoutProgressionSuggestions.test.js src/__tests__/workoutInsightAggregation.test.js src/__tests__/workoutAdvancedMetricsPlan.test.js --watchAll=false --runInBand
```

Result:

```text
PASS, 19 tests.
```

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTracker
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run build
```

Result:

```text
Compiled successfully.
```

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTracker
git diff --check
```

Result: passed.

## Known Gaps

Blockers for this checkpoint:

- None known from local verification.

2026-07-02 update:

- `syncWorkoutProgressionSuggestions` is deployed to `australia-southeast1`.
- Firestore emulator allow/deny tests now cover owner/admin reads and writes for `workoutProgressionSuggestions`.
- Signed-in production smoke passed with temporary workout history, and smoke-only data was cleaned after verification.

Non-blocking gaps:

- No UI uses the suggestions yet.
- Suggestion logic does not yet account for exercise-specific loading jumps, equipment availability, RPE, pain, injury, or fatigue. That is intentional for this checkpoint; copy stays conservative and optional.
- Intensity score is a simple transparent formula, not a medical/recovery score. Claude approved backend computation for prep, but public UI must be reshaped before it ships.
- Public progressive-overload UI must not ship until `syncWorkoutProgressionSuggestions` has per-user rate limiting.
- Public progressive-overload UI must not ship until low-rep prescription behavior is either explicitly documented in user-facing copy or replaced with prescription-aware logic.
- Public progressive-overload UI copy must use "suggested next step" language, not "target" or "goal" language.

## Specific Questions For Claude

1. Is the CP18-aligned threshold of four target-exercise sessions across two weeks sufficient before showing a conservative overload suggestion?
2. Is the rep-first/weight-second logic safe enough for first release?
3. Should advanced users get larger increments, or keep all increments conservative?
4. Is the intensity score framing acceptable if we avoid recovery/health claims?
5. Should emulator rules tests be required before any UI reads these private suggestions?

## Claude Answers

1. Four target-exercise sessions across two weeks is enough for first release scope. A future stronger version can raise this to six sessions across three weeks once richer data exists.
2. Rep-first/weight-second is the correct default. The 10-rep gate before weight increases is the right conservative signal.
3. Advanced users can stay at +2.5 kg for now; track RPE-scaled increments for a later enhancement.
4. Intensity framing is not ready for UI. Keep the backend helper, but reshape user-facing presentation into a raw-facts session summary before UI release.
5. CP21 can proceed as vote-independent backend prep under the same no-user-facing-Phase-3-UI boundary.
