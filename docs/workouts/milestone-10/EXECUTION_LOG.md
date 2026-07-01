# Milestone 10 Execution Log

Status date: 2026-07-01

## Work Completed

- Accepted Claude's M9 Batch 5 approval and moved into release prep.
- Added backend-storage URL resolution for workout assets on Web:
  - `src/workouts/domain/workoutAssetUrls.js`
  - `src/workouts/presentation/WorkoutsLibrarySection.jsx`
- Added equivalent Storage URL resolution on iOS:
  - `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/WorkoutAssetCache.swift`
- Added equivalent Storage URL resolution on Android:
  - `/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/WorkoutAssetUrls.kt`
  - Updated Compose preview to use the domain helper instead of importing the data-layer cache.
- Removed internal review labels from generated production assets by updating:
  - `scripts/generate-workout-asset-batch.js`
- Regenerated Batches 1-5:
  - 50 exercise seed records
  - 200 asset manifest entries
  - 200 generated asset files
- Extended asset upload tooling:
  - `scripts/upload-workout-assets.js`
  - Added `--auth=firebase-cli` mode using the existing Firebase CLI login.
- Added Storage rules:
  - `storage.rules`
  - `firebase.json`
- Created Firebase Storage default bucket through the official `projects.defaultBucket.create` REST endpoint:
  - Bucket: `tribechallengetracker.firebasestorage.app`
  - Location: `AUSTRALIA-SOUTHEAST1`
- Deployed Storage rules successfully.
- Added and applied `storage.cors.json` to the live bucket after Claude flagged missing web CORS.
- Verified actual `GET` responses include `access-control-allow-origin` for:
  - `https://tribechallengetracker.web.app`
  - `http://localhost:3000`
- Uploaded all generated workout assets:
  - Batch 1: 40 assets
  - Batch 2: 40 assets
  - Batch 3: 56 assets
  - Batch 4: 32 assets
  - Batch 5: 32 assets
- Verified representative production asset reads without auth.
- Seeded all 50 live Firestore exercise catalog docs using admin UID:
  - `wOkXIFQoTZPRccE1GWpdPGdco373`
- Ran signed-in callable smoke with App Review credentials:
  - Created a public smoke workout via `finishWorkoutSession`.
  - Copied it via `copyPublicWorkout`.
  - Re-finished the same session as private to remove the public mirror.
- Sent M10 V2 review pack to Claude.
- Claude approved M10 V2 after independently checking:
  - scoped Storage CORS,
  - 200 generated file hashes against manifests,
  - 50 seed records through dry-run validation,
  - no regression in storage rules or web fetch logic.
- Marked the App Review/demo account email as verified through the Identity Toolkit API so the verified-email gate does not block App Review or manual QA.
- Completed Web authenticated browser QA against the local dev app and live backend:
  - Workouts tab loaded 50 live exercises,
  - Bench Press detail showed `LOTTIE READY · 90 FRAMES`,
  - no CORS or asset-fetch errors appeared in browser logs,
  - screenshot saved to `docs/workouts/milestone-10/screenshots/web-workouts-loaded-storage-assets.jpg`.
- Ran production web build successfully with Node 20.
- Deployed Firebase Hosting successfully to `https://tribechallengetracker.web.app`.
- Completed hosted Web authenticated browser QA:
  - Workouts tab loaded 50 live exercises,
  - Bench Press detail showed `LOTTIE READY · 90 FRAMES`,
  - browser warning/error logs were empty,
  - screenshot saved to `docs/workouts/milestone-10/screenshots/web-hosted-workouts-loaded-storage-assets.jpg`.
- Built iOS Debug successfully for the connected iPhone `Nameru`.
- Installed the iOS Debug build successfully on `Nameru`.
- iOS launch was blocked by the device lock state; `Navdeep’s iPhone` was offline/unavailable.
- Built Android Debug successfully.
- Android runtime QA was blocked because no Android device/emulator was attached via `adb`.
- Received Claude final M10 approval: Phase 1 is ready to ship; only iOS/Android screenshot capture remains as non-code launch proof.

## Deviations

- Initial Storage deploy/upload failed because the Firebase Storage bucket did not exist.
- Resolved by calling the official Firebase Storage REST default bucket create endpoint.
- Claude V1 review found missing Storage CORS as a Web release blocker.
- Resolved by applying checked-in `storage.cors.json` through the Cloud Storage JSON API.
- Native screenshots remain pending as launch proof, not as implementation blockers.

## Important IDs

- Firebase project: `tribechallengetracker`
- Configured bucket: `tribechallengetracker.firebasestorage.app`
- Bucket location: `AUSTRALIA-SOUTHEAST1`
- Admin UID used for live seeding: `wOkXIFQoTZPRccE1GWpdPGdco373`
- Connected iPhone used for build/install: `Nameru` (`00008120-00044DA93633401E`)

## Next Work

- Capture iOS real-device screenshots for guided workout flow with live Storage assets.
- Capture Android real-device/emulator screenshots for catalog/detail/social copy flow.
- Capture final iOS/Android release screenshots when devices are available/unlocked.
- Publish the Phase 2 tribe vote before starting Phase 2 implementation.
