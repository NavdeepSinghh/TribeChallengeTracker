# Phase 2 Training Plans Completion

Status date: 2026-07-02
Status: release-ready after live backend deploy and signed-in production smoke.

## What Is Live

- Three official training plans are seeded to live Firestore:
  - `beginner_strength_foundation`
  - `upper_lower_strength_builder`
  - `run_walk_base_builder`
- Firestore rules and indexes are deployed.
- `syncTrainingPlanProgress` is deployed in `australia-southeast1`.
- `finishWorkoutSession` is redeployed in `australia-southeast1` with training-plan progress support.
- Firebase Hosting is deployed at `https://tribechallengetracker.web.app`.

## Production Smoke

Signed-in production smoke used the App Review test account and completed one planned workout through the deployed `finishWorkoutSession` callable.

Verified:

- planned workout session written under the user
- `completedDayKeys` includes `w1-d1`
- `skippedDayKeys` removed `w1-d1`
- `trainingPlanAdherence` written with `completedCount: 1`, `dueCount: 1`, `adherencePct: 100`
- `plan_first_workout` badge written
- activity log mirror written exactly once for the smoke session
- callable returned `trainingPlanProgress` with `status: active` and `awardedBadgeIds: ["plan_first_workout"]`

Smoke session:

- `phase2-smoke-1782980403608`

Cleanup:

- Removed smoke-only training sessions `phase2-smoke-1782980253186` and `phase2-smoke-1782980403608` from the App Review account after verification.
- Removed the matching smoke activity-log entries and feed/public mirror targets so live user-facing surfaces do not show smoke data.
- Kept the trusted plan progress state on the App Review account for launch screenshots and QA.

## Verification

Passed:

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run workouts:phase2:release-check
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run build
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npx firebase deploy --only hosting --project tribechallengetracker --non-interactive
xcodebuild -scheme TribeLog -destination 'generic/platform=iOS' build
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew :app:testDebugUnitTest :app:assembleDebug
```

Release-check includes:

- training plan seed validation
- dry-run seed apply
- planned workout finish smoke contract
- training plan progress tests
- Training Plans foundation tests
- Today Training Plan card tests

## Remaining Manual QA

These are not code blockers, but they should be done before public announcement:

- iPhone real-device screenshots:
  - Today card with active plan
  - plan customization panel
  - badge/progress card after finishing a planned workout
- Android real-device screenshots when a device is available:
  - plan discovery
  - active/enrolled plan
  - progress/badge state

## Notes

- Firebase Functions deploy warned that Node.js 20 is deprecated and will be decommissioned on 2026-10-30. Track a runtime upgrade before the next major backend deployment window.
- `firebase-functions` package is outdated; upgrade should be planned separately because Firebase warns about breaking changes.
