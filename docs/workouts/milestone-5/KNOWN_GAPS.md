# Milestone 5 Known Gaps: Android Workouts Read-Only Library

## Gaps

1. Live seeded data not verified on Android device.
   - The app builds, but live catalog display depends on production/emulator Firestore seed and an authenticated user.

2. Android unit tests are not present yet.
   - `:app:testDebugUnitTest` passes with `NO-SOURCE`.
   - Add fake-repository ViewModel tests before Milestone 6 or as part of M6.

3. Relative asset paths do not play directly.
   - Absolute URLs play through `lottie-compose`.
   - Relative `workouts/exercises/v1/...` paths need Milestone 9 Firebase Storage/CDN resolution.

4. Screenshots are static HTML previews.
   - Used for brand review only.
   - Live screenshots should be captured after seed + authenticated device QA.

5. Android is still pending Google Play app-level approval.
   - This does not block local Android implementation or debug build verification.

## Carried Forward

- Deploy `finishWorkoutSession` before Milestone 6.
- Add `@firebase/rules-unit-testing` before Milestone 8.
- Move assets from `/public`/relative manifest paths to Firebase Storage before Milestone 9.
