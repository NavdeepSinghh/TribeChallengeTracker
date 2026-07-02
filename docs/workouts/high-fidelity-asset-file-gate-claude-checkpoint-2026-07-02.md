# Claude Checkpoint: High-Fidelity Asset File Gate

Status date: 2026-07-02

Scope: local verification guardrail for real high-fidelity workout media files.

## Verdict Request

Please review this as the file-level release gate that should run before any realistic workout media is uploaded or applied to live Firestore.

Requested verdict: `APPROVED`, `APPROVED WITH FIXES`, `BLOCKED`, or `REVIEW INCONCLUSIVE`.

## Why This Exists

The current high-fidelity media POC is intentionally still in planning mode. The app must not accept placeholder files, text files renamed as media, missing posters, or oversized videos when the real MP4/WebM/poster files arrive.

This gate keeps the live rollout honest:

- planning mode can show pending files without failing
- release mode uses `--require-files` and fails on missing or invalid media
- placeholder text files are rejected by header checks
- file-size budgets are enforced locally before upload

## What Changed

Added a local file verifier:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/verify-workout-high-fidelity-asset-files.js
```

Added a bridge into the existing Storage upload-manifest shape:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/build-workout-high-fidelity-upload-manifest.js
```

Added tests:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/__tests__/workoutHighFidelityAssetFiles.test.js
```

## Verification Behavior

Default planning mode:

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/verify-workout-high-fidelity-asset-files.js
```

Expected result while real assets do not exist:

```text
Checked high-fidelity asset files under /Users/navdeepsmacbook/Documents/TribeChallengeTracker/generated
... PENDING ... (missing)
Missing or invalid files are allowed in planning mode. Add --require-files for release gating.
```

Release-gate mode:

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/verify-workout-high-fidelity-asset-files.js --require-files
```

Expected result until real files exist:

```text
High-fidelity asset file verification failed: ...
```

## Checks

- MP4 must have an `ftyp` header.
- WebM must have an EBML header.
- Poster must have a RIFF/WebP header.
- MP4 file size must be <= 3 MB.
- WebM file size must be <= 2 MB.
- Poster file size must be <= 250 KB.
- Missing files fail only in `--require-files` mode.
- Optional `--require-metadata` uses `ffprobe` when available to check:
  - video width between 640 and 1920
  - video height between 360 and 1080
  - duration within 350ms of the manifest duration
  - frame rate within 0.5fps of the manifest frame rate

## Test Results

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/workoutHighFidelityAssetFiles.test.js --watchAll=false --runInBand
```

Result:

```text
PASS, 3/3 tests
```

The tests verify:

- MP4, WebM, and WebP headers are recognized.
- video metadata validation catches duration, resolution, and frame-rate drift.
- tiny real-looking local media files pass under the budgets.
- verified media files can be converted into standard upload-manifest entries.
- placeholder text files and missing files fail in release-gate mode.

Upload manifest bridge:

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/build-workout-high-fidelity-upload-manifest.js
```

Expected result until real files exist:

```text
High-fidelity asset file verification failed: ... missing ...
```

When the real POC files exist under `generated/workouts/exercises/v2/...`, this script will emit `scripts/workout-high-fidelity-upload-manifest.json` in the same shape consumed by `scripts/upload-workout-assets.js`.

## Known Gaps

- `ffprobe` is not installed on this Mac at the time of writing, so metadata mode is implemented and unit-tested through pure metadata validation but not exercised against real local videos yet.
- No real POC assets were generated in this checkpoint.
- No live Storage upload or Firestore apply happened.

## Review Questions For Claude

1. Is this file-level gate sufficient before first real POC upload?
2. Should `ffprobe` duration/resolution validation be required before upload now that the optional `--require-metadata` path exists?
3. Are the size budgets conservative enough for mobile workout detail screens?
4. Should this gate be wired into the upload script before real assets are generated?
5. Should missing files continue to be allowed in planning mode but fail under `--require-files`?
