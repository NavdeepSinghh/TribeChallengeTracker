# Claude Checkpoint: High-Fidelity Motion POC Board

Status date: 2026-07-02
Owner: Navdeep
Implementation: Codex
Review partner: Claude / Claude Design

## Context

Claude approved the frame-aware cue sync fix after the Web active cue card was changed to:

- `aria-live="off"` during auto-synced playback
- `aria-live="polite"` for manual cue lock
- `aria-live="polite"` for reduced-motion paused mode

Claude also verified the chronological `phaseTimeline` validation guardrail.

This checkpoint starts the next step: a reviewable high-fidelity motion direction before real MP4/WebM assets are generated or applied to Firestore.

## What This Adds

Added a local motion review board:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-motion-poc-board-2026-07-02.html
```

Screenshot evidence:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-motion-poc-board-screenshot-2026-07-02.png
```

Renderer:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/render-workout-high-fidelity-motion-board.js
```

The board uses the five approved POC exercises:

- `goblet_squat`
- `push_up`
- `lat_pulldown`
- `romanian_deadlift`
- `bulgarian_split_squat`

Each card shows:

- animated SVG body/equipment prototype
- primary and secondary muscle glow treatment
- selected Coach Mode cue cards animated against the same `phaseTimeline`
- planned production `demo.mp4` path
- explicit statement that this is prototype media only and current Lottie/SVG fallback remains production-safe

## Intent

This is not a production asset replacement. It is a direction-lock board for Claude Design before Codex generates or commissions real high-fidelity video assets.

The board is meant to validate:

- dark TribeLog composition
- non-competitor visual direction
- target muscle readability
- equipment readability
- whether selected cue text works beside motion
- whether the five-exercise POC set still feels like the right approval gate

## Accessibility And Safety

- Text remains in the app/Coach Mode layer, not baked into future motion assets.
- Motion board supports `prefers-reduced-motion` by pausing CSS animations.
- Production Web cue sync already follows Claude's approved `aria-live` behavior.
- No medical, rehab, pain-free, or transformation claims were added.
- No live Firestore writes were made.

## Verification

Commands run:

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/render-workout-high-fidelity-motion-board.js
```

Result:

```text
Rendered high-fidelity motion POC board to /Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-motion-poc-board-2026-07-02.html
```

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/validate-workout-high-fidelity-media.js
```

Result:

```text
Validated 5 high-fidelity workout media POC records.
```

Manual visual check:

- Opened the board in Chrome.
- Confirmed the Goblet Squat panel renders with animated body/equipment, target muscle glow, and active cue cards.
- Captured screenshot artifact listed above.

## Known Gaps

- The board uses animated SVG prototypes, not final realistic video.
- Only a visible first-screen screenshot was captured; Claude should open the HTML for full five-card review.
- Real production assets still need MP4/WebM/poster generation, hashing, upload, and a separate Claude visual review.
- iOS and Android real-video QA should wait for approved real media files.

## Specific Questions For Claude

1. Is this motion board a useful approval gate before generating real `demo.mp4` / `demo.webm` / `poster.webp` assets?
2. Does the selected cue-card treatment match the app experience we want: animation + current movement instruction instead of static instructions?
3. Is the dark TribeLog style distinct enough from the competitor references while still hitting the quality bar?
4. Are the muscle overlays readable enough, or should the final video direction use a stronger anatomical overlay treatment?
5. Are the five POC exercises still the right set before scaling to all 50?
6. What must change before Codex creates the first real high-fidelity media files?

## Requested Verdict

Please return one of:

- `APPROVED`
- `APPROVED WITH FIXES`
- `BLOCKED`
- `REVIEW INCONCLUSIVE`
