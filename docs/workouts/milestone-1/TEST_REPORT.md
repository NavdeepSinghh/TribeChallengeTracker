# Milestone 1 Test Report

## Status

Completed for Milestone 1.

## Planned Tests

- Workout callable helper unit tests.
- Firestore rules contract test.
- Firestore index contract test.
- Existing React/Jest focused test run.

## Results

### Syntax / Parse Checks

```text
node -c functions/workoutSessionCallableHandlers.js
node -c functions/index.js
node -c scripts/seed-workout-exercise-catalog.js
```

Result: passed.

```text
jq empty firestore.indexes.json scripts/workout-exercise-seed.json
```

Result: passed.

```text
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" \
PATH="/Applications/Android Studio.app/Contents/jbr/Contents/Home/bin:$PATH" \
firebase emulators:exec --only firestore "node -e \"console.log('firestore rules parsed')\""
```

Result: passed. Firestore emulator started and parsed rules successfully.

### Seed Dry Run

```text
node scripts/seed-workout-exercise-catalog.js
```

Result:

```text
Validated 3 workout exercise seed records. Use --apply to write to Firestore.
- goblet_squat: Goblet Squat
- push_up: Push-Up
- plank: Plank
```

### Focused Jest Test

```text
npm test -- --runTestsByPath src/__tests__/workoutsBackendFoundation.test.js --watchAll=false --runInBand
```

Result:

```text
PASS src/__tests__/workoutsBackendFoundation.test.js
Tests: 6 passed, 6 total
```

Covered:

- deterministic mirror IDs
- retry-safe activity replacement
- trusted PR calculation helpers
- Firestore rule contract for visibility and block enforcement
- Firestore index contract
- proof seed validation

## Not Run

- Full app production build. No production UI code was changed in this milestone.
- Full Firebase Functions deployment. This pass implements and validates locally only.
- Full emulator allow/deny rule tests. The repo does not currently include `@firebase/rules-unit-testing`.
