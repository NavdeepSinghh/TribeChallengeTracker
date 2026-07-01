# Milestone 10: Phase 1 Release Readiness

Status date: 2026-07-01

## Verdict

CLAUDE FINAL M10 APPROVED. PHASE 1 READY TO SHIP.

Phase 1 has cleared the backend, asset, storage delivery, hosted Web QA, smoke-test, native build, and Claude release-readiness gates. The only remaining items are manual screenshot captures on iOS and Android for launch/announcement proof, not code fixes.

## Milestone Status

| Milestone | Status |
|---|---|
| M0 Foundation | Approved |
| M1 Backend foundation | Approved |
| M2 Admin seed path | Approved |
| M3 Web library | Approved |
| M4 iOS library | Approved |
| M5 Android library | Approved |
| M5.5 Native tests | Approved by checkpoint process |
| M6 Guided Workout MVP | Implemented and documented |
| M7 History/PR/feed surfaces | Claude approved |
| M8 Social sharing/copying | Claude approved after native parity and callable deploy |
| M9 50 exercise expansion | Claude approved all 5 batches, 50/50 exercises |
| M10 Release prep | Claude final approved, ready to ship |

## Closed This Pass

- M9 Batch 5 approved by Claude; all 50 exercises are complete.
- Removed internal `OFFICIAL V1` / `GENERATED V1` labels from production SVG muscle maps and thumbnail cards.
- Regenerated all 5 asset batches after label removal.
- Verified generated assets: no review labels remain, WebP thumbnails are real images.
- Implemented Firebase Storage URL resolution:
  - Web: `src/workouts/domain/workoutAssetUrls.js`
  - iOS: `WorkoutAssetURLs` in `TribeChallengeTrackerIOS/TribeChallenge/Workouts/WorkoutAssetCache.swift`
  - Android: `WorkoutAssetUrls` in `TribeChallengeTrackerAndroid/.../workouts/domain/WorkoutAssetUrls.kt`
- Added `--auth=firebase-cli` fallback to `scripts/upload-workout-assets.js` so logged-in Firebase CLI credentials can upload assets without a service account file.
- Added conservative `storage.rules` and wired it in `firebase.json`.
- Created the Firebase Storage default bucket through the official `projects.defaultBucket.create` REST endpoint.
- Deployed Storage rules to `firebase.storage`.
- Added and applied `storage.cors.json` so web browsers can fetch Lottie/SVG/WebP assets from the Firebase Storage media endpoint.
- Uploaded all 200 generated assets to `tribechallengetracker.firebasestorage.app`.
- Verified unauthenticated production reads for representative Lottie, SVG, and WebP asset URLs.
- Seeded all 50 exercise records to live Firestore `exerciseCatalog`.
- Verified live Firestore readback: 50 exercise documents.
- Ran signed-in production smoke:
  - `finishWorkoutSession` public write succeeded.
  - `copyPublicWorkout` succeeded.
  - Re-finished same session as private, clearing the public workout mirror.
- Sent the V2 M10 review pack to Claude.
- Claude independently verified scoped CORS, generated asset hash integrity, seed validation, and release-gate accuracy.
- Claude verdict: **APPROVED**. Remaining release gate: native screenshots/manual QA across iOS and Android.
- Completed Web browser QA on localhost with live backend/Storage data:
  - reviewer account sign-in succeeded after marking the demo account email as verified,
  - onboarding completion screen showed `Welcome, App Review!`,
  - Workouts tab loaded 50 live `exerciseCatalog` records,
  - Bench Press detail showed `LOTTIE READY · 90 FRAMES`,
  - browser console had no CORS or asset-fetch failures,
  - screenshot saved to `docs/workouts/milestone-10/screenshots/web-workouts-loaded-storage-assets.jpg`.
- Ran production web build successfully.
- Deployed Firebase Hosting successfully:
  - `https://tribechallengetracker.web.app`
- Completed hosted Web browser QA:
  - hosted Workouts tab loaded 50 live `exerciseCatalog` records,
  - hosted Bench Press detail showed `LOTTIE READY · 90 FRAMES`,
  - hosted browser warning/error log was empty,
  - screenshot saved to `docs/workouts/milestone-10/screenshots/web-hosted-workouts-loaded-storage-assets.jpg`.
- Built iOS Debug for the connected iPhone `Nameru` successfully.
- Installed the iOS Debug build on `Nameru` successfully.
- iOS launch/screenshot capture is still pending because the connected iPhone was locked; `Navdeep’s iPhone` is currently offline/unavailable to Xcode.
- Built Android Debug successfully.
- Android runtime screenshot capture is still pending because no Android device/emulator is currently connected through `adb`.
- Claude final M10 check approved Phase 1 as ready to ship after reviewing hosted Web QA screenshot evidence and the full release gate list.

## Launch Screenshot Checklist

1. **iOS screenshot.**
   - iPhone guided workout flow with live Storage-backed assets.
2. **Android screenshot.**
   - Android catalog/detail/social copy flow with live Storage-backed assets.

These are non-code tasks for launch confidence and announcement materials. They do not represent known implementation blockers.

## Verification Completed

Web:

```bash
CI=true npm test -- --runTestsByPath src/__tests__/workoutsAssetPipeline.test.js src/__tests__/workoutsWebLibrary.test.js --runInBand
```

Result: 22 tests passed.

iOS:

```bash
xcodebuild test -project /Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge.xcodeproj -scheme TribeLog -destination 'id=D923D710-E371-406A-9950-A34017DF4AF2' -only-testing:TribeLogTests/WorkoutCatalogTests
```

Result: 11 tests passed.

Device build/install:

- Connected iPhone: `Nameru` (`00008120-00044DA93633401E`)
- `Navdeep’s iPhone`: offline/unavailable to Xcode at check time.
- Debug build destination: `id=00008120-00044DA93633401E`
- Build result: passed.
- Install result: passed.
- Launch result: blocked by iOS because the device was locked.

Android:

```bash
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew :app:testDebugUnitTest
```

Result: build successful.

Debug APK build:

- `./gradlew :app:assembleDebug`
- Result: build successful.
- Runtime device check: no Android device/emulator attached via `adb`.

Live backend:

- `exerciseCatalog` readback count: 50.
- Signed-in `finishWorkoutSession`: passed.
- Signed-in `copyPublicWorkout`: passed.
- Reviewer/demo account email verification: fixed for App Review/manual QA.

Web browser QA:

- Authenticated Workouts tab loaded on `http://localhost:3000`.
- Live catalog count: 50 exercises.
- Bench Press detail loaded live Storage Lottie: `LOTTIE READY · 90 FRAMES`.
- Console check: no CORS or asset-fetch errors.
- Screenshot: `docs/workouts/milestone-10/screenshots/web-workouts-loaded-storage-assets.jpg`.
- Production build: passed.
- Firebase Hosting deploy: passed.
- Hosted URL: `https://tribechallengetracker.web.app`.
- Hosted Workouts tab loaded 50 exercises.
- Hosted Bench Press detail loaded live Storage Lottie: `LOTTIE READY · 90 FRAMES`.
- Hosted console warning/error check: empty.
- Hosted screenshot: `docs/workouts/milestone-10/screenshots/web-hosted-workouts-loaded-storage-assets.jpg`.

Storage:

- Default bucket created: `tribechallengetracker.firebasestorage.app`.
- Bucket location: `AUSTRALIA-SOUTHEAST1`.
- Storage rules deployed successfully.
- Storage CORS applied successfully.
- Actual `GET` requests with `Origin: https://tribechallengetracker.web.app` return `access-control-allow-origin: https://tribechallengetracker.web.app`.
- Actual `GET` requests with `Origin: http://localhost:3000` return `access-control-allow-origin: http://localhost:3000`.
- Uploaded asset count: 200.
- Representative production asset fetches returned `200`:
  - `bench_press/demo.lottie.json`
  - `bench_press/muscle-map-front.svg`
  - `bench_press/thumbnail.webp`
  - `rowing_machine/demo.lottie.json`
  - `worlds_greatest_stretch/muscle-map-front.svg`

## Tribe Vote Prompt

What should the tribe choose for Phase 2?

- Training Plans: open the app and know exactly what to do today.
- Custom Workout Builder upgrades: make personal routines faster to create, save, remix, and share.
- Form Video Library: richer movement demos and technique cues.
- Something else: let the tribe propose the next direction.
