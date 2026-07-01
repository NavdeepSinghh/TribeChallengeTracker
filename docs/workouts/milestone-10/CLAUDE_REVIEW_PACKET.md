# Claude Review Packet: Milestone 10 Release Readiness

Status date: 2026-07-01

## Request

Please review Phase 1 release readiness after M9 Batch 5 approval.

Codex does not claim Phase 1 is publicly releasable until real-device QA is complete. This packet asks Claude to verify whether the remaining release gate list is correct now that Firebase Storage setup, rules deploy, asset upload, and signed-in smoke checks are complete.

## Current Verdict

CLAUDE FINAL M10 APPROVED. Phase 1 is ready to ship.

Claude's V2 review verified:

- `storage.cors.json` is scoped to production/local origins and closes the web CORS blocker.
- All 200 generated asset files match the five batch manifests by SHA-256.
- All 50 seed records validate cleanly through the admin seed script in dry-run.
- `storage.rules`, `firebase.json`, and web fetch logic did not regress from V1.
- Hosted Web QA and final M10 release-readiness were approved by Claude.
- Native screenshots remain as non-code launch proof tasks.

## Web QA Follow-Up

After Claude's V2 approval, Codex completed the Web browser check that V1 had blocked:

- Local app: `http://localhost:3000`
- Authenticated user: App Review/demo account
- Live backend: Firestore `exerciseCatalog` and Firebase Storage assets
- Result:
  - Workouts tab loaded 50 live exercise records.
  - Bench Press detail showed `LOTTIE READY · 90 FRAMES`.
  - Browser console had no CORS or asset-fetch errors.
  - Screenshot saved at `docs/workouts/milestone-10/screenshots/web-workouts-loaded-storage-assets.jpg`.
- Production build and Firebase Hosting deploy also passed.
- Hosted URL `https://tribechallengetracker.web.app` loaded the same 50 live exercise records.
- Hosted Bench Press detail showed `LOTTIE READY · 90 FRAMES`.
- Hosted warning/error logs were empty.
- Hosted screenshot saved at `docs/workouts/milestone-10/screenshots/web-hosted-workouts-loaded-storage-assets.jpg`.

The remaining native iOS/Android screenshots are launch/announcement tasks, not code blockers.

## Native QA Follow-Up

- iOS Debug build passed for connected iPhone `Nameru`.
- iOS install passed on `Nameru`.
- iOS launch/screenshot capture is pending because the connected iPhone was locked.
- `Navdeep’s iPhone` was offline/unavailable to Xcode at check time.
- Android Debug build passed.
- Android runtime screenshot capture is pending because no Android device/emulator was attached via `adb`.

## What Changed Since Batch 5 Approval

- All 50 exercises are approved by Claude.
- All production SVGs and WebP thumbnails were regenerated without internal review labels.
- Storage-relative asset URL resolution is implemented on Web, iOS, and Android.
- Upload script supports Firebase CLI auth with `--auth=firebase-cli`.
- `storage.rules` added and wired into `firebase.json`.
- Firebase Storage default bucket created through the official REST endpoint:
  - `tribechallengetracker.firebasestorage.app`
  - `AUSTRALIA-SOUTHEAST1`
- Storage rules deployed.
- `storage.cors.json` added, applied to the bucket, and verified with actual `GET` requests from production and local web origins.
- All 200 generated asset files uploaded.
- Representative production Storage URLs return `200` without auth.
- All 50 exercise docs seeded into live Firestore `exerciseCatalog`.
- Signed-in smoke tests passed for both callables:
  - `finishWorkoutSession`
  - `copyPublicWorkout`

## Storage Evidence

Default bucket creation returned:

```json
{
  "name": "projects/tribechallengetracker/defaultBucket",
  "location": "AUSTRALIA-SOUTHEAST1",
  "bucket": {
    "name": "projects/tribechallengetracker/buckets/tribechallengetracker.firebasestorage.app"
  },
  "storageClass": "STANDARD"
}
```

Rules deploy completed:

```text
firebase.storage: rules file storage.rules compiled successfully
storage: released rules storage.rules to firebase.storage
Deploy complete
```

Asset upload completed:

```text
Batch 1: Uploaded 40 workout assets.
Batch 2: Uploaded 40 workout assets.
Batch 3: Uploaded 56 workout assets.
Batch 4: Uploaded 32 workout assets.
Batch 5: Uploaded 32 workout assets.
```

Representative unauthenticated fetches:

```text
200 application/json bench_press/demo.lottie.json
200 image/svg+xml bench_press/muscle-map-front.svg
200 image/webp bench_press/thumbnail.webp
200 application/json rowing_machine/demo.lottie.json
200 image/svg+xml worlds_greatest_stretch/muscle-map-front.svg
```

## CORS Fix Evidence

Claude V1 review flagged missing CORS as a web-release blocker. Codex added `storage.cors.json`, applied it through the Cloud Storage JSON API, and verified actual `GET` responses:

```text
Origin: https://tribechallengetracker.web.app
access-control-allow-origin: https://tribechallengetracker.web.app

Origin: http://localhost:3000
access-control-allow-origin: http://localhost:3000
```

## Review Questions

1. Are the remaining blockers accurate?
2. Is public read / no client write acceptable for `storage.rules` official workout assets?
3. Is Firebase CLI auth fallback in `scripts/upload-workout-assets.js` acceptable for the asset upload path?
4. Is the REST-created default bucket in `AUSTRALIA-SOUTHEAST1` acceptable for this release?
5. Does the applied CORS config close the web asset-fetch blocker?
6. Are native screenshots correctly treated as non-code launch proof tasks?

## Files To Review

- `docs/workouts/milestone-10/PHASE_1_RELEASE_READINESS.md`
- `docs/workouts/milestone-10/EXECUTION_LOG.md`
- `docs/workouts/milestone-10/TEST_REPORT.md`
- `docs/workouts/milestone-10/KNOWN_GAPS.md`
- `storage.rules`
- `storage.cors.json`
- `firebase.json`
- `scripts/seed-workout-exercise-catalog.js`
- `scripts/upload-workout-assets.js`
- `src/workouts/domain/workoutAssetUrls.js`
- `src/workouts/presentation/WorkoutsLibrarySection.jsx`
- iOS: `TribeChallengeTrackerIOS/TribeChallenge/Workouts/WorkoutAssetCache.swift`
- Android: `TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/WorkoutAssetUrls.kt`

## Recommendation

Phase 1 is approved and ready to ship. Capture final iOS/Android screenshots when devices are available/unlocked, then publish the Phase 2 tribe vote. Do not start Phase 2 implementation until the vote closes.
