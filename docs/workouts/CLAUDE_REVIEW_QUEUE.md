# Claude Review Queue: Workouts

Status date: 2026-07-02
Current next reviews:

1. Phase 3 native parity and share image export
2. Phase 3 release pack and Phase 4 vote
3. Phase 2 launch gates before CP22
4. Shareable Insight Cards And Discovery
5. Phase 3 Release And Creator-Layer Scope
6. Training Plans Foundation
7. Training Plan Enrollment Foundation
8. Coach Mode v1
9. Full Cue Draft v1
10. High-Fidelity Animation Design Spec + POC Manifest
11. High-Fidelity Motion POC Board
12. High-Fidelity Production Asset Briefs
13. High-Fidelity Asset File Gate
14. High-Fidelity Client Video Playback Prep
15. Frame-Aware Cue Sync Checkpoint
16. iOS High-Fidelity Video Loop Parity
17. Native High-Fidelity Poster Fallback
18. High-Fidelity Real Asset Review Board

## Phase 3 Native Parity And Share Image Export (2026-07-02)

Review artifact:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/phase-3-native-parity-share-export-claude-checkpoint-2026-07-02.md
```

Codex completed the native parity slice after the approved Web Phase 3 preview:

- iOS and Android Progress insight cards.
- iOS and Android weekly muscle-volume heat-map visual.
- iOS and Android privacy-safe workout insight share cards.
- iOS and Android app-generated 1080x1350 share-card image export.

Verification:

```text
Web Phase 3 targeted tests: PASS, 37/37
Web production build: PASS
iOS WorkoutInsightTests: PASS, 10/10
iOS generic build: PASS
Android unit tests and assembleDebug: PASS
```

Remaining release gate:

- real iPhone and Android screenshots for Progress insights, heat map, and share-image sheet.

## Phase 3 Release Pack And Phase 4 Vote (2026-07-02)

Review artifact:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/phase-3-release-pack-claude-checkpoint-2026-07-02.md
```

Codex prepared the Phase 3 public announcement gate and Phase 4 tribe vote:

- Phase 3 release readiness checklist.
- Remaining native screenshot/share-smoke gates.
- Privacy and trust checklist.
- Phase 3 announcement draft.
- Phase 4 community/creator contribution vote options.
- Phase 4 production-code guardrails.

## Phase 3 Progress Insights UI (2026-07-02)

Review artifact:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/phase-3-progress-insights-ui-claude-checkpoint-2026-07-02.md
```

Codex added the first user-facing Phase 3 Progress UI inside `Progress > History`:

- Progressive Overload Suggestions card.
- Weekly Muscle Volume card.
- Separate insight repository/use cases/ViewModel.
- No extra Workouts hub entry.
- No duplicate workout-history fetch.
- Sync buttons call rate-limited deployed callables only after explicit user action.
- Public workout discovery now ranks with existing trend-score helper and displays the score quietly inside Explore.

Verification:

```text
Claude final verdict: APPROVED for Web preview and native parity work
Claude V2 verdict: APPROVED WITH FIXES
Claude V2 fix items: CLOSED
Focused insight/history/social tests after fixes: PASS, 37/37
Social trend/share tests: PASS, 8/8
Phase 3 foundation check after fixes: PASS, 44/44
Web production build: PASS
Insight callables redeployed after structured retry details: PASS
git diff --check: PASS
```

Claude final note:

- Nothing blocks moving into native parity work.
- Web can proceed as preview.
- iOS/Android parity and real-device screenshots remain required before public/user-facing release.

## Latest Codex Side-Pass Additions (2026-07-02)

Codex continued while Claude was unavailable and kept the work to reviewable, low-risk motion-cue hardening:

- High-fidelity animation POC manifest now includes cue-aligned `phaseTimeline` metadata.
- High-fidelity validator now rejects cue-id drift from the approved Coach Mode cue draft for the five POC exercises.
- High-fidelity review board now renders the cue timeline for Claude Design review.
- High-fidelity motion POC board now renders five animated SVG body/equipment prototypes with target-muscle glow and cue cards synced to the approved `phaseTimeline`.
- High-fidelity production asset briefs now generate exact MP4/WebM/poster prompts, storage paths, size budgets, and QA checks for the five realistic-media POC exercises.
- High-fidelity asset-file gate now rejects missing/fake/oversized MP4, WebM, and poster files in release mode before upload or Firestore apply.
- Frame-aware cue sync now respects reduced-motion preferences:
  - Web: `prefers-reduced-motion` pauses motion until `PLAY MOTION`.
  - iOS: Reduce Motion pauses motion until `PLAY`.
  - Android: disabled system animations pause motion until `PLAY`.
- Active cue text on Web now uses conditional live regions per Claude review:
  - auto-synced playback cues use `aria-live="off"`
  - manual cue lock and reduced-motion cue changes use `aria-live="polite"`
- High-fidelity `phaseTimeline` validation now explicitly rejects non-chronological playback ranges.
- iOS high-fidelity video playback now explicitly loops `AVPlayer` demos and resets Coach Mode cue progress to `0%` at loop completion, matching Web/Android behavior.
- Native high-fidelity media cards now show poster imagery or branded fallbacks before video playback is ready, while preserving the existing Lottie/SVG fallback for non-video exercises:
  - iOS observes `AVPlayerItem.status` and fades video in after `.readyToPlay`.
  - Android shows Coil poster imagery until `VideoView` fires `setOnPreparedListener`.
  - Both platforms preserve reduced-motion and frame-aware cue-sync behavior.
- High-fidelity real asset review board now renders a reviewable HTML gate for MP4/WebM/poster files:
  - playable video appears only when files pass the existing header/size checks.
  - missing or invalid files render as `PENDING`, not fake readiness.
  - Coach Mode cue timelines appear beside each asset for motion/cue review.
- High-fidelity readiness JSON report now records per-exercise and per-file readiness for future asset intake automation.

Fresh review packs:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-animation-design-pack-2026-07-01.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-motion-poc-board-review-pack-2026-07-02.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-production-asset-briefs-review-pack-2026-07-02.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-asset-file-gate-review-pack-2026-07-02.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/frame-aware-cue-sync-review-pack-2026-07-02.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/ios-high-fidelity-video-loop-parity-checkpoint-2026-07-02.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/ios-high-fidelity-video-loop-parity-review-pack-2026-07-02.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/native-high-fidelity-poster-fallback-checkpoint-2026-07-02.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/native-high-fidelity-poster-fallback-review-pack-2026-07-02.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/high-fidelity-real-asset-review-board-checkpoint-2026-07-02.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-real-asset-review-board-2026-07-02.html
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-real-asset-readiness-2026-07-02.json
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-real-asset-review-board-review-pack-2026-07-02.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/phase-2-smoke-contract-checkpoint-2026-07-02.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/phase-2-smoke-contract-review-pack-2026-07-02.zip
```

Latest verification:

```text
Web targeted test: PASS, 13/13
Web production build: PASS
High-fidelity manifest validation: PASS, 5/5
High-fidelity review-board render: PASS
High-fidelity motion POC board render: PASS
High-fidelity production briefs render: PASS
High-fidelity production briefs test: PASS, 3/3
High-fidelity asset-file verifier planning mode: PASS, reports pending missing real assets
High-fidelity asset-file verifier tests: PASS, 4/4
High-fidelity asset-file verifier metadata mode: PASS in planning mode, reports pending missing files; pure metadata validation unit-tested
iOS WorkoutCatalogTests: PASS, 13/13
iOS device-targeted Debug build: PASS
iOS device install: PASS on Navdeep's iPhone (`com.risewiththetribe.tribelog`)
iOS device launch: PASS through `xcrun devicectl`
Android WorkoutCatalogTest: PASS
Android assembleDebug: PASS
Native poster fallback targeted checks: PASS on iOS WorkoutCatalogTests and Android WorkoutCatalogTest
High-fidelity real asset review board tests: PASS, 3/3
High-fidelity real asset review board render: PASS, reports pending missing real assets
High-fidelity readiness report tests: PASS, 2/2
High-fidelity readiness report render: PASS, reports 0/5 ready while real assets are pending
High-fidelity npm validate command: PASS
High-fidelity npm asset-gate command: PASS in planning mode, reports pending missing files
High-fidelity npm review-board command: PASS
Phase 2 smoke-contract command: PASS, 6/6
Phase 2 training plan seed validate command: PASS, 3 official plans
Phase 2 training plan seed dry-run command: PASS, no write without --apply
Phase 2 release-check command: PASS, includes plan seed validation/dry-run, smoke-contract, training plan foundation, and Today card tests
```

## Completed Review Item

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/phase-2-release-and-phase-3-vote-claude-checkpoint-2026-07-01.md
```

Claude CP17 verdict: `APPROVED WITH FIXES`.

Launch blockers before public announcement:

- Signed-in production planned-workout smoke test: complete one planned day and verify `completedDayKeys`, adherence recomputation, badge/progress card, tribe feed mirror, and no duplicate feed entries.
- Real native launch screenshots: iPhone Today active plan, customization panel, badge/progress state; Android equivalent when a paired device is available.
- Local Phase 2 smoke-contract test now passes through the real `finishWorkoutSession` handler with plan metadata and verifies completed day, adherence, first plan badge, activity log, tribe feed mirror, and retry idempotency. This supports but does not replace the required signed-in production smoke.

Codex follow-up already applied:

- CP17 checklist now records the two launch blockers explicitly.
- Training Plans seed copy was audited for medical/injury-risk phrases. No launch-risk hits were found in `scripts/workout-training-plans-seed.json`.
- Claude re-reviewed the documentation/copy fixes and approved proceeding to CP18 while the two real-world launch gates remain open.

## Next Review Item

Completed CP18 review:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/advanced-feature-vote-and-metrics-plan-claude-checkpoint-2026-07-01.md
```

Claude CP18 verdict: `APPROVED` after fixes.

Fixes accepted:

- Progressive overload thresholds raised to 4 global sessions, 4 target-exercise sessions, and 2 target-exercise training weeks.
- Validator rejects future submissions that loosen those thresholds.
- Share-card permanence is explicit in the privacy posture.
- Regression tests cover the threshold guardrail.

Boundary for CP19:

- CP19 may proceed as preparation infrastructure.
- User-facing or production UI work that assumes Muscle Volume Heat Maps won must wait until Navdeep has a tribe vote result or explicitly chooses that direction.
- Claude first-pass CP19 verdict: `APPROVED WITH ONE FIX AND ONE STRONG RECOMMENDATION`.
- CP19 privacy fix applied for re-review: remove raw session IDs from owner-readable aggregate documents.
- Claude re-reviewed the privacy fix and approved CP19. CP20 may proceed under the same vote-independent backend-prep boundary.

Future public heat-map UI prerequisites from Claude:

- Emulator allow/deny rules tests for `workoutInsightAggregates`.
- Aggregates must remain summary-only unless an explicit UI requirement justifies raw session references.
- Scheduled backfill strategy documented before UI launch.
- Server-side rate limiting for user-invocable aggregate sync before UI launch.

Completed CP19 review:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/muscle-volume-aggregation-claude-checkpoint-2026-07-01.md
```

Completed CP20 review:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/progressive-overload-intensity-claude-checkpoint-2026-07-01.md
```

Claude CP20 verdict: `APPROVED WITH TWO STRONG RECOMMENDATIONS`.

Accepted:

- CP18 threshold discipline held: 4 target-exercise sessions across at least 2 training weeks.
- Raw session ID minimization carried over from CP19 without prompting.
- Suggestion logic is conservative, optional, and owner-private.
- CP21 may proceed as vote-independent backend prep under the same no-user-facing-Phase-3-UI boundary.

Future public progressive-overload UI prerequisites:

- Add emulator allow/deny rules tests for `workoutProgressionSuggestions`.
- Reshape intensity UI from a 0-100 score into a raw-facts session summary before user-facing release.
- Add rate limiting on `syncWorkoutProgressionSuggestions`.
- Document low-rep prescription behavior, or replace it with prescription-aware logic once richer prescription metadata exists.
- Audit suggestion display copy so it says "suggested next step", not "target" or "goal".

Then review:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/library-expansion-200-plus-claude-checkpoint-2026-07-01.md
```

Claude CP21 verdict: `APPROVED WITH ONE DEFERRAL AND ONE STRUCTURAL RECOMMENDATION`.

Applied follow-up:

- Power/Olympic-style candidates with higher self-serve form risk were deferred to Phase 4 Coach Pro.
- Active power expansion now keeps only Medicine Ball Slam and Box Jump.
- Candidate count remains 150 by reallocating capacity into cardio depth.
- Locked equipment and level metadata vocabulary was added to the candidate manifest.
- Validator/tests now reject deferred candidates if they re-enter the active list and reject fragmented level vocabulary.

CP22 is blocked until Phase 2 launch gates are complete:

- Signed-in production smoke test for `finishWorkoutSession` with a planned workout.
- iPhone screenshots of Today active plan/card.
- iPhone screenshot of plan customization panel.
- iPhone screenshot of badge/progress card.

Then review:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/shareable-insight-cards-discovery-claude-checkpoint-2026-07-01.md
```

Then review:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/phase-3-release-creator-layer-scope-claude-checkpoint-2026-07-01.md
```

Then review:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/training-plans-foundation-claude-checkpoint-2026-07-01.md
```

Then review:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/training-plan-enrollment-foundation-claude-checkpoint-2026-07-01.md
```

Then review:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/coach-mode-v1-claude-checkpoint-2026-07-01.md
```

Then review:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/coach-mode-full-cues-claude-checkpoint-2026-07-01.md
```

Then review:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/high-fidelity-animation-claude-design-spec-2026-07-01.md
```

Then review the POC manifest checklist:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-animation-poc-checklist-2026-07-01.html
```

Then review the motion POC board:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/high-fidelity-motion-poc-board-claude-checkpoint-2026-07-02.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-motion-poc-board-2026-07-02.html
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-motion-poc-board-screenshot-2026-07-02.png
```

Then review the production asset briefs:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/high-fidelity-production-asset-briefs-claude-checkpoint-2026-07-02.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-production-asset-briefs-2026-07-02.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-production-asset-briefs-2026-07-02.html
```

Then review the asset file gate:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/high-fidelity-asset-file-gate-claude-checkpoint-2026-07-02.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/verify-workout-high-fidelity-asset-files.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/__tests__/workoutHighFidelityAssetFiles.test.js
```

Then review:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/high-fidelity-client-video-playback-checkpoint-2026-07-01.md
```

Then review:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/frame-aware-cue-sync-web-checkpoint-2026-07-02.md
```

Optional zip pack:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/training-plans-foundation-review-pack-2026-07-01.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/training-plan-enrollment-foundation-review-pack-2026-07-01.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/training-plan-native-parity-review-pack-2026-07-01.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/today-tab-training-plan-integration-review-pack-2026-07-01.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/plan-customization-substitutions-review-pack-2026-07-01.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/plan-badges-adherence-review-pack-2026-07-01.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/plan-customization-progress-native-parity-review-pack-2026-07-01.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/phase-2-release-and-phase-3-vote-review-pack-2026-07-01.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/advanced-feature-vote-and-metrics-plan-review-pack-2026-07-01.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/muscle-volume-aggregation-review-pack-2026-07-01.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/progressive-overload-intensity-review-pack-2026-07-01.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/library-expansion-200-plus-review-pack-2026-07-01.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/shareable-insight-cards-discovery-review-pack-2026-07-01.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/phase-3-release-creator-layer-scope-review-pack-2026-07-01.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/coach-mode-v1-review-pack-2026-07-01.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/coach-mode-plus-full-cues-review-pack-2026-07-01.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-animation-design-pack-2026-07-01.zip
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/frame-aware-cue-sync-review-pack-2026-07-02.zip
```

Full cue draft files:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/generate-workout-coaching-cues-draft.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/render-workout-coaching-cues-review-board.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/workout-coaching-cues-full-draft.json
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/coach-mode-full-cues-review-board-2026-07-01.html
```

High-fidelity POC manifest files:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/workout-high-fidelity-media-poc.json
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/validate-workout-high-fidelity-media.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/apply-workout-high-fidelity-media.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/render-workout-high-fidelity-poc-checklist.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-animation-poc-checklist-2026-07-01.html
```

## Why This Needs Review

Navdeep asked Codex to keep building the full Workouts roadmap through the next checkpoints while Claude is rate-limited. The newest checkpoint adds backend-driven official Training Plans as the first Phase 2 foundation layer.

Navdeep wants the exercise detail experience to feel more like an interactive coach:

- animation remains visible
- selected text explains how to move
- static instructions move lower in priority
- cue content can be backend-driven over time
- selected cue behavior is now consistent: cues may auto-advance before interaction, but tapping a cue locks that selected text for the current exercise

Navdeep also wants future workout animations to move toward a more realistic 3D/high-fidelity style. That design work is separated from the current working Lottie pipeline and requires Claude Design approval before Codex scales it to all 50 exercises.

This checkpoint implements that direction across Web, iOS, and Android with a small pilot cue content path.

## Files To Review

### Training Plans Foundation

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/training-plans-foundation-claude-checkpoint-2026-07-01.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/training-plan-enrollment-foundation-claude-checkpoint-2026-07-01.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/workout-training-plans-seed.json
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/validate-workout-training-plans.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/apply-workout-training-plans.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/firestore.rules
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/firestore.indexes.json
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/domain/trainingPlanModels.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/domain/trainingPlanUseCases.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/data/firestoreTrainingPlanRepository.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/presentation/useTrainingPlansViewModel.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/presentation/TrainingPlansSection.jsx
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/workoutTrainingPlanComposition.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/app/BoardTab.jsx
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/__tests__/trainingPlansFoundation.test.js
```

### Training Plan Native Parity

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/training-plan-native-parity-claude-checkpoint-2026-07-01.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/plan-customization-progress-native-parity-claude-checkpoint-2026-07-01.md
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/TrainingPlanModels.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/TrainingPlanUseCases.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/FirestoreTrainingPlanRepository.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/TrainingPlanViewModel.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Views/TrainingPlansSection.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeLogTests/TrainingPlanTests.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/TrainingPlanModels.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/TrainingPlanUseCases.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/data/FirestoreTrainingPlanRepository.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/TrainingPlanViewModel.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/TrainingPlansSection.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/test/java/com/risewiththetribe/challengetracker/workouts/TrainingPlanTest.kt
```

### Web

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/domain/workoutCatalogModels.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/workouts/presentation/WorkoutsLibrarySection.jsx
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/src/__tests__/workoutsWebLibrary.test.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/package.json
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/package-lock.json
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/workout-coaching-cues-pilot.json
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/apply-workout-coaching-cues.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/workout-high-fidelity-media-poc.json
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/validate-workout-high-fidelity-media.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/apply-workout-high-fidelity-media.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/scripts/render-workout-high-fidelity-poc-checklist.js
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/high-fidelity-animation-claude-design-spec-2026-07-01.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/high-fidelity-client-video-playback-checkpoint-2026-07-01.md
```

### iOS

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/WorkoutCatalogModels.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/FirestoreWorkoutCatalogRepository.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Workouts/WorkoutAssetCache.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeChallenge/Views/WorkoutCatalogSection.swift
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerIOS/TribeLogTests/WorkoutCatalogTests.swift
```

### Android

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/domain/WorkoutCatalogModels.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/data/FirestoreWorkoutCatalogRepository.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/main/java/com/risewiththetribe/challengetracker/workouts/presentation/WorkoutCatalogSection.kt
/Users/navdeepsmacbook/Documents/TribeChallengeTrackerAndroid/app/src/test/java/com/risewiththetribe/challengetracker/workouts/WorkoutCatalogTest.kt
```

## Verification Already Run

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/validate-workout-training-plans.js
```

Result: `Validated 3 official workout training plans.`

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/apply-workout-training-plans.js
```

Result: `Validated 3 official workout training plans. Use --apply to write to Firestore.`

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/trainingPlansFoundation.test.js --watchAll=false --runInBand
```

Result: `PASS, 8 tests`

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/trainingPlansFoundation.test.js src/__tests__/workoutsWebLibrary.test.js --watchAll=false --runInBand
```

Result: `PASS, 18 tests`

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run build
```

Result: `Compiled successfully.`

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm test -- --runTestsByPath src/__tests__/workoutsWebLibrary.test.js --watchAll=false --runInBand
```

Result: `PASS, 10 tests`

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/apply-workout-coaching-cues.js
```

Result: `Validated 5 workout coaching cue records`

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/generate-workout-coaching-cues-draft.js
```

Result: `Generated 50 coaching cue records`

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/apply-workout-coaching-cues.js --file scripts/workout-coaching-cues-full-draft.json
```

Result: `Validated 50 workout coaching cue records`

```text
PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/render-workout-coaching-cues-review-board.js
```

Result: `Rendered cue review board`

```text
xcodebuild -project TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination 'generic/platform=iOS' -derivedDataPath build/DerivedDataCoachModeVerify build
```

Result: `BUILD SUCCEEDED`

```text
xcodebuild -project TribeChallenge.xcodeproj -scheme TribeLog -configuration Debug -destination 'id=227132E2-D637-4C61-AA8D-A32F61EB0105' -derivedDataPath build/DerivedDataCoachModeTest test -only-testing:TribeLogTests/WorkoutCatalogTests
```

Result: `TEST SUCCEEDED, 12 tests`

The same iOS test target was rerun after removing technical cache/status copy from the motion preview.

```text
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew :app:testDebugUnitTest --tests '*WorkoutCatalogTest'
```

Result: `BUILD SUCCESSFUL`

Latest polish verification:

```text
No remaining matches for PLAYING/FRAMES, frames cached, Cached, Manifest ready, Fallback active, Storage path, asset hash, or Loading asset in the Web/iOS/Android workout preview UI files.
```

High-fidelity animation prep verification:

```text
Web WorkoutCatalog tests pass with mediaManifest parsing and video-source selection coverage.
Web WorkoutCatalog tests pass with future video rendering coverage.
iOS WorkoutCatalog tests pass with native AVKit video branch compiled.
Android WorkoutCatalog tests pass with native VideoView branch compiled.
iOS WorkoutCatalog tests pass with mediaManifest parsing coverage.
Android WorkoutCatalog tests pass with mediaManifest parsing coverage.
Planned high-fidelity POC manifest validates locally.
High-fidelity media apply script rejects planned records as expected.
High-fidelity POC checklist HTML renders locally.
No live Firestore media records were applied.
```

## Paste Prompt For Claude

```text
You are reviewing the current TribeLog Workouts high-fidelity coaching/playback checkpoints:

1. Coach Mode v1
2. Full Cue Draft v1
3. High-Fidelity Animation Design Spec + POC Manifest
4. High-Fidelity Client Video Playback Prep
5. Frame-Aware Cue Sync
6. iOS High-Fidelity Video Loop Parity
7. Native High-Fidelity Poster Fallback
8. High-Fidelity Real Asset Review Board

Context:
- TribeLog is a fitness challenge tracker app.
- Workouts is backend-driven across Web, iOS, and Android.
- Brand lock: #FF6B35 orange, #040404 near-black, Syne 900 headlines, Space Grotesk body.
- Architecture lock: MVVM + Clean Architecture inside the Workouts feature boundary.
- Product goal for this checkpoint: make exercise detail feel like a guided movement coach instead of animation + static instructions.
- Cue contract requires startPercent/endPercent and now accepts optional startFrame/endFrame for later exact Lottie sync. UI still uses percent/timed cue selection until frame-aware player progress is wired.
- Web/iOS no longer keep auto-rotating after the user manually selects a cue; Android already behaved this way.
- Motion preview fallback/status copy was scrubbed to avoid raw frame counts, cache details, Firebase Storage paths, or asset hashes in user-facing UI.
- Web/iOS/Android now sync active Coach Mode cue text from motion playback progress where available, with timer fallback.
- Reduced-motion users see paused motion until they explicitly press PLAY.
- iOS video playback now loops like Web/Android and resets cue progress to 0% at loop completion.
- Native high-fidelity video cards now show poster imagery or branded fallback while the player prepares.
- Current Lottie/SVG fallback remains intact for non-video exercises; high-fidelity video is additive only.

Review this file first:
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/coach-mode-v1-claude-checkpoint-2026-07-01.md

Then review this file:
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/coach-mode-full-cues-claude-checkpoint-2026-07-01.md

Then review this file:
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/high-fidelity-animation-claude-design-spec-2026-07-01.md

Then review this checklist:
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-animation-poc-checklist-2026-07-01.html

Then review this file:
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/high-fidelity-client-video-playback-checkpoint-2026-07-01.md

Then review this file:
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/frame-aware-cue-sync-web-checkpoint-2026-07-02.md

Then review this file:
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/ios-high-fidelity-video-loop-parity-checkpoint-2026-07-02.md

Then review this file:
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/native-high-fidelity-poster-fallback-checkpoint-2026-07-02.md

Then review this file:
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/high-fidelity-real-asset-review-board-checkpoint-2026-07-02.md

Then review this board:
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/review-packs/high-fidelity-real-asset-review-board-2026-07-02.html

Then review the changed files listed in the checkpoints.

Please answer:
1. Verdict: APPROVED, APPROVED WITH FIXES, BLOCKED, or REVIEW INCONCLUSIVE.
2. Does the detail screen now feel like guided coaching?
3. Is the optional backend `coachingCues` contract acceptable?
4. Is fallback from `formCues + instructions` acceptable for all 50 exercises while real cue data is authored in batches?
5. Should cues auto-rotate now, or only change on tap until exact Lottie frame sync exists?
6. Is the pilot cue copy safe and free from unsupported health or medical claims?
7. Is the apply script scoped safely enough for live Firestore use after approval?
8. Should any cues require authored startFrame/endFrame before live Firestore apply, or is percent-only acceptable for the first content pass?
9. Does the iOS motion preview copy feel user-facing now that technical cache/frame language is removed?
10. Is the selected-cue behavior right: auto-advance before interaction, then lock the user's tapped cue for that exercise?
11. Is all remaining motion-preview copy user-facing enough for release?
12. What must Codex fix before applying pilot cues to live Firestore?
13. Is the generated 50-exercise cue draft acceptable as a content base?
14. Which exercise families need custom copy before live Firestore apply?
15. Should we apply only the five pilot cues first, or wait and apply all 50 after full cue review?
16. Is frame-aware cue sync acceptable across Web, iOS, and Android?
17. Is the reduced-motion behavior acceptable: pause motion until explicit PLAY?
18. Does iOS loop behavior now match Web/Android?
19. Does native poster fallback satisfy the high-fidelity loading UX while preserving Lottie fallback?
20. What must change before Codex applies any high-fidelity `mediaManifest` to live Firestore?
21. Is the real asset review board sufficient as the required visual gate before upload/apply?
22. Should `ffprobe` metadata checks be mandatory at review time or only at release upload time?
16. Is the high-fidelity animation spec safe, distinct from competitor references, and suitable for a five-exercise POC?
17. Is the planned five-exercise media manifest/checklist acceptable?
18. Are the render briefs specific enough for Claude Design or an asset pipeline to produce realistic motion?
19. Does the validator correctly keep planned media out of release-ready/live Firestore paths until real hashes exist?
20. Is the client video playback prep acceptable and still safe with current Lottie fallback?
21. Is lightweight native playback through AVKit/VideoView enough for the five-asset POC, or should we move to a richer player later?
22. Is the high-fidelity media apply script strict enough for later live Firestore rollout?
23. Should Codex proceed with only schema/pipeline prep, or start generating the five high-fidelity POC assets?

Separate blockers from nice-to-haves. Include a copy-paste response for Codex at the end.
```

## Pending After Claude Approval

1. Apply the 5 pilot cue records to Firestore with:

```text
node scripts/apply-workout-coaching-cues.js --apply --admin-uid <uid>
```

2. Capture Web, iOS, and Android screenshots of the five pilot details.
3. Review and refine the generated full 50-exercise cue draft.
4. Later: make cue changes frame-aware using real Lottie progress instead of timed auto-rotation.
