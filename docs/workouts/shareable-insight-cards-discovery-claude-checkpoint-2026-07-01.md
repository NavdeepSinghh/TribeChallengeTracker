# Claude Checkpoint 22: Shareable Insight Cards And Discovery

Status date: 2026-07-01
Verdict requested: privacy + UX foundation review
Scope: pure-domain share-card payload builders and public workout trend ranking foundation.

## Requested Verdict

Please return one of:

- APPROVED
- APPROVED WITH FIXES
- BLOCKED
- REVIEW INCONCLUSIVE

## Context

Checkpoint 22 prepares the sharing and discovery layer for Phase 3 without launching new UI yet.

The main safety requirement is that private workout data should never leak into share cards automatically. Cards are preview payloads only and require explicit user action before sharing.

## What Changed

- Added workout insight share-card helpers.
- Added public workout trend scoring and ranking helper.
- Added tests covering:
  - explicit-share preview flags
  - rounded volume values
  - private note exclusion
  - exact timestamp exclusion
  - unsupported claim filtering
  - public-only discovery ranking

## Key Files

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/domain/workoutShareInsights.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/__tests__/workoutShareInsights.test.js
```

## Share Card Types

### Workout Summary

Includes:

- title
- short subtitle
- rounded volume
- points
- up to four exercise highlights
- owner display name
- date label only, not exact timestamp

Excludes:

- private notes
- exact timestamps
- raw set log

### Muscle Volume

Includes:

- top muscle groups
- rounded weekly volume values
- period key

Excludes:

- source session IDs
- raw set logs
- exact workout timestamps

### Personal Record

Includes:

- exercise name
- best weight
- estimated 1RM

Excludes:

- exact timestamp
- private notes

## Public Discovery Ranking

Only `visibility === "public"` workouts are ranked.

Current trend score:

```text
copiedCount * 5 + reactionCount * 2 + recencyBoost
```

This is intentionally simple and transparent for a first discovery pass.

## Verification

```text
cd /Users/navdeepsmacbook/Documents/TribeChallengeTracker
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/workoutShareInsights.test.js --watchAll=false --runInBand
```

Result:

```text
PASS, 5 tests.
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

## Security And Privacy Notes

- Share card helpers create private preview payloads only.
- Actual sharing must remain explicit user action.
- Cards sanitize unsupported claim language.
- Rounded public metric values are used where exact values are unnecessary.
- Discovery helper filters out private/tribe workouts before ranking.
- Existing Firestore public workout visibility and block-list rules remain the security boundary.

## Known Gaps

Blockers for this checkpoint:

- None known from local verification.

Non-blocking gaps:

- No visual card UI is implemented in this checkpoint.
- No native share integration is implemented in this checkpoint.
- Trend ranking is not yet backed by a server index or scheduled score materialization.
- Moderation/reporting UX for discovered public workouts remains part of the broader social safety layer.

## Specific Questions For Claude

1. Are the share-card payloads privacy-safe enough before UI implementation?
2. Should exact workout date labels be hidden further, or is `MM-DD` acceptable?
3. Is the trend score too simplistic, or acceptable for first discovery UI?
4. Should share cards include attribution for copied workouts by default?
5. What moderation/reporting gates should block public trend UI?
