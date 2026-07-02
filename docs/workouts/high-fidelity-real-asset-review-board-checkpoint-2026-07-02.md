# High-Fidelity Real Asset Review Board Checkpoint

Date: 2026-07-02

## Review Request

Please review the new real-media review board that sits between high-fidelity asset generation and any upload / Firestore apply step.

This checkpoint does **not** generate or fake production media. It gives Claude a repeatable board for reviewing the five high-fidelity POC assets once real `demo.mp4`, `demo.webm`, and `poster.webp` files arrive.

## Why This Exists

The roadmap already had:

- Production asset briefs
- File gates
- Upload manifest generation
- Client playback prep

The missing operational step was a single visual board where Claude can inspect real files after they are dropped into the expected local paths but before upload or live `mediaManifest` apply.

## New Files

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/render-workout-high-fidelity-asset-review-board.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/write-workout-high-fidelity-readiness-report.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/__tests__/workoutHighFidelityAssetReviewBoard.test.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/__tests__/workoutHighFidelityReadinessReport.test.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-real-asset-review-board-2026-07-02.html
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-real-asset-readiness-2026-07-02.json
```

## New Commands

```bash
npm run workouts:high-fidelity:validate
npm run workouts:high-fidelity:asset-gate
npm run workouts:high-fidelity:review-board
```

## What The Board Does

For each of the five POC exercises:

- Shows playable `<video>` markup only when MP4 or WebM passes the existing file gate.
- Uses the real poster file only when the WebP header and size budget pass.
- Shows `PENDING` when files are missing or invalid.
- Lists each expected storage path.
- Shows size, header, and optional `ffprobe` metadata status.
- Shows the Coach Mode cue timeline so Claude can compare motion with cue sync.
- Includes review checks for:
  - motion clarity
  - no baked-in text
  - muscle highlight accuracy
  - mobile file budgets
  - competitor-copy risk

## What The Readiness Report Does

The companion JSON report gives a machine-readable summary for future automation and Claude review:

- `readyExercises`
- `totalExercises`
- aggregate `ok`
- file-level `ready`, `exists`, `reason`, and `bytes`
- optional metadata status when `--require-metadata` is used

## Guardrails

- Missing assets render as pending, not as fake success.
- This board does not upload files.
- This board does not apply Firestore `mediaManifest` records.
- The board uses the same verifier as the upload manifest builder.
- Existing Lottie/SVG fallbacks remain untouched.

## Commands Run

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" \
  npm test -- --runTestsByPath src/__tests__/workoutHighFidelityAssetReviewBoard.test.js --watchAll=false --runInBand

PATH="/opt/homebrew/opt/node@20/bin:$PATH" \
  node scripts/render-workout-high-fidelity-asset-review-board.js

PATH="/opt/homebrew/opt/node@20/bin:$PATH" \
  node scripts/write-workout-high-fidelity-readiness-report.js

PATH="/opt/homebrew/opt/node@20/bin:$PATH" \
  npm run workouts:high-fidelity:validate

PATH="/opt/homebrew/opt/node@20/bin:$PATH" \
  npm run workouts:high-fidelity:review-board
```

## Verification

```text
High-fidelity real asset review board tests: PASS, 3/3
High-fidelity readiness report tests: PASS, 2/2
High-fidelity real asset review board render: PASS
High-fidelity readiness report render: PASS, 0/5 exercises ready as expected while files are pending
NPM high-fidelity validate command: PASS
NPM high-fidelity asset-gate command: PASS in planning mode, reports pending missing files
NPM high-fidelity review-board command: PASS
```

Current board status is expected to show pending assets because real MP4/WebM/poster files have not been created yet.

## Claude Review Questions

1. Is this board the right review gate before upload and Firestore apply?
2. Does it expose enough evidence for Claude to assess file readiness and visual readiness?
3. Should `--require-metadata` be mandatory for review, or only for release upload?
4. Are the review checks sufficient for competitor-copy, no-baked-text, and movement-clarity risk?
5. Should any other evidence be added before the first real POC asset review?
6. Is the JSON readiness report enough for future asset-intake automation and release gating?

## Known Gaps

- Real five-exercise high-fidelity MP4/WebM/poster files are still pending.
- A Claude visual review of real media is still required before upload.
- Live Firestore `mediaManifest` apply remains blocked until real assets pass this board, the file gate, and Claude review.
