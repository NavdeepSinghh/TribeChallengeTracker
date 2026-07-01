# Milestone 10 Launch Follow-Up

Status date: 2026-07-01

## Remaining Manual Tasks

1. iOS real-device screenshot of the guided-workout flow.
2. Android device/emulator screenshot of the catalog/detail/social-copy flow.

These are non-code launch tasks. Claude's final M10 check approved Phase 1 as ready to ship.

## Resolved Gaps

- 50 exercise records are seeded live in Firestore.
- Web/iOS/Android can resolve relative Storage asset paths to Firebase Storage download URLs.
- Firebase Storage bucket exists: `tribechallengetracker.firebasestorage.app`.
- Storage rules are deployed.
- Storage CORS is configured and verified for production/local web origins.
- All 200 generated assets are uploaded.
- Representative production asset URLs return `200`.
- Signed-in callable smoke passed for `finishWorkoutSession` and `copyPublicWorkout`.
- Internal review labels were removed from production assets.
- Claude M10 V2 review is approved; Claude independently verified CORS scope, hash integrity, seed validation, and remaining release-gate accuracy.
- Web authenticated browser QA passed with 50 live exercises, live Storage Lottie loaded, and no CORS/asset console errors.
- Production web build and Firebase Hosting deploy passed; hosted Workouts QA also passed with 50 live exercises, live Storage Lottie loaded, and empty warning/error logs.
- App Review/demo account is email-verified for the verified-email sign-in gate.
- iOS Debug build and install passed on the connected iPhone `Nameru`; launch/screenshot capture was blocked because the device was locked.
- Android Debug build passed; runtime QA is pending because no Android device/emulator is attached.
- Claude final M10 review approved Phase 1 release readiness after reviewing hosted Web QA evidence.

## Human Action Required

Unlock the connected iPhone or connect `Navdeep’s iPhone`, and attach/start an Android device or emulator, then capture the final native Workouts screenshots for launch materials.
