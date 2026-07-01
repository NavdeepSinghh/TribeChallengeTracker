# Milestone 1 Known Gaps

## Backend Gaps

- Full emulator allow/deny security tests are not present because the repo does not currently include `@firebase/rules-unit-testing`.
- `finishWorkoutSession` has local helper coverage but has not been deployed to Firebase Functions.
- The seed script defaults to dry run. `--apply` requires Firebase Admin credentials in the local environment.

## Product Gaps

- No UI reads the new backend catalog yet.
- No client calls `finishWorkoutSession` yet.
- The remaining exercise catalog and Lottie batches are not generated in Milestone 1.
- Public workout discovery UI is not implemented yet.

## Review Notes

Claude should review:

- `firestore.rules` sample for `publicWorkouts`
- `functions/workoutSessionCallableHandlers.js`
- `src/__tests__/workoutsBackendFoundation.test.js`
- `docs/workouts/milestone-1/TEST_REPORT.md`

