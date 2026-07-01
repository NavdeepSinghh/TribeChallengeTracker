# Milestone 10 Architecture Review

Status date: 2026-07-01

## Web

- Asset URL resolution lives in domain helper `src/workouts/domain/workoutAssetUrls.js`.
- Presentation re-exports the helper for existing tests but no longer owns the Storage URL contract.
- Existing Workouts ViewModel remains Firestore-free.

## iOS

- `WorkoutAssetURLs` is a Foundation-only helper.
- `WorkoutAssetCache` resolves relative Storage paths before fetching/caching bytes.
- No Firebase SDK import was added to the ViewModel or view layer for URL resolution.

## Android

- `WorkoutAssetUrls` lives in the domain package.
- Compose no longer imports `WorkoutAssetCache` from the data layer just to classify URLs.
- `WorkoutAssetCache` uses the domain URL helper before network fetch.

## Backend / Infrastructure

- `storage.rules` allows public read for official generated workout assets only.
- `storage.cors.json` allows web asset `GET` requests from production and local development origins.
- Client writes to Storage are denied.
- Upload path remains admin/CLI-controlled through `scripts/upload-workout-assets.js`.
- Firestore exercise catalog remains backend-driven; all 50 docs are live.
- Default Firebase Storage bucket is provisioned in `AUSTRALIA-SOUTHEAST1`.
- All 200 generated asset files are uploaded under `workouts/exercises/v1/...`.

## Review Notes

- The Storage URL contract is now consistent across Web, iOS, and Android.
- No remaining architecture blocker is known. Remaining release work is real-device QA and screenshots.
