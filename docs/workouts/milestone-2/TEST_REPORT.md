# Milestone 2 Test Report

## Status

Completed.

## Syntax / Parse Checks

```text
node -c functions/workoutSessionCallableHandlers.js
node -c functions/index.js
node -c scripts/seed-workout-exercise-catalog.js
jq empty firestore.indexes.json scripts/workout-exercise-seed.json
```

Result: passed.

## Firestore Rules Parse

```text
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" \
PATH="/Applications/Android Studio.app/Contents/jbr/Contents/Home/bin:$PATH" \
firebase emulators:exec --only firestore "node -e \"console.log('firestore rules parsed')\""
```

Result: passed.

## Seed Dry Run

```text
node scripts/seed-workout-exercise-catalog.js
```

Result:

```text
Validated 3 workout exercise seed records. Use --apply to write to Firestore.
Apply mode requires --admin-uid <uid> and verifies that uid exists in /admins.
- goblet_squat: Goblet Squat
- push_up: Push-Up
- plank: Plank
```

## Focused Jest Test

```text
npm test -- --runTestsByPath src/__tests__/workoutsBackendFoundation.test.js --watchAll=false --runInBand
```

Result:

```text
PASS src/__tests__/workoutsBackendFoundation.test.js
Tests: 8 passed, 8 total
```

Covered:

- deterministic mirror IDs
- retry-safe activity replacement
- activity/feed point consistency
- trusted PR calculation helpers
- Firestore rule contract for visibility, block enforcement, and owned source session direct-write defense
- Firestore index contract
- proof seed validation
- explicit admin identity for apply mode

## Not Run

- Live Firestore seed apply.
- Full emulator allow/deny rule suite.
- Production app build. No production UI code was changed for Milestone 2.

