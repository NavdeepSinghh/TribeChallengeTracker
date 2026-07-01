# Milestone 3 Test Report

## Automated Tests

Command:

```bash
npm test -- --runTestsByPath src/__tests__/workoutsBackendFoundation.test.js src/__tests__/workoutsWebLibrary.test.js --watchAll=false --runInBand
```

Result:

```text
Test Suites: 2 passed, 2 total
Tests: 13 passed, 13 total
```

Coverage added:

- Backend soft-fix regression coverage remains passing.
- Exercise document mapping.
- Domain filtering and backend filter selection.
- Web loaded state render.
- Quick Log action availability.
- Empty/error state render coverage.
- Asset URL resolution.
- ViewModel filter-option caching; indexed filter changes do not refetch the full options catalog.
- ViewModel `isEmpty` contract for client-side search misses.
- Lottie frame count calculation uses animation in/out points.

## Seed Validation

Command:

```bash
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

## Production Build

Command:

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run build
```

Result:

```text
Compiled successfully.
```

Note: default shell Node is 24.7.0 and is blocked by the project build guard. Build verification used Homebrew Node 20.20.2.

## Asset Checks

Command:

```bash
find public/workouts -type f | sort | xargs -n 1 file
```

Result:

- 3 Lottie JSON files detected as JSON.
- 6 muscle map files detected as SVG.

## Screenshots

- `docs/workouts/milestone-3/screenshots/loading.png`
- `docs/workouts/milestone-3/screenshots/empty.png`
- `docs/workouts/milestone-3/screenshots/loaded.png`
- `docs/workouts/milestone-3/screenshots/error.png`

Claude reviewed the actual PNGs and confirmed brand compliance.
