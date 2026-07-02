# Phase 3 Launch Surface Decision

Date: 2026-07-02

## Decision

Phase 3 should launch first with **Progressive Overload Suggestions** inside the existing `Progress` subflow.

## Why This Ships First

- It is already backed by the deployed `syncWorkoutProgressionSuggestions` callable.
- It fits inside the existing Workouts tab IA without adding another top-level entry point.
- It can start as one focused insight card, which keeps cognitive load low.
- It has a clear insufficient-data state: users need repeated exercise history across at least two training weeks.
- It avoids the larger visual QA burden of a full muscle heat map as the first Phase 3 surface.

## Deferred Phase 3 Surfaces

- Muscle volume heat map: next after progression suggestions, once the Progress insight surface is stable.
- Expanded 200+ exercise catalog: content operations track, not the first intelligence surface.
- Shareable insight cards: should wait until insight copy, privacy defaults, and preview QA are complete.
- Bundled launch: not recommended because it delays learning from the first user-facing insight.

## Required Fixes Before User-Facing Phase 3 UI

- Keep rate limiting on broad user-triggered insight sync callables deployed and covered by tests.
- Keep Phase 3 inside existing subflows; do not add a fourth or fifth hub entry.
- Keep real-device screenshot QA for Web, iOS, and Android as the release gate.
- Ensure Progress is internally segmented so history, journal, and breakdown are not stacked into one dense scroll.
- Confirm Activity Breakdown does not trigger duplicate workout-history fetches.

## Follow-Up Implementation Notes

- `ProgressFlow` now owns internal modes: `history`, `journal`, and `breakdown`.
- `ActivityBreakdownPanel` receives `actCounts` as props and performs no remote fetch.
- Phase 3 progression insight UI should become a `progress` panel or a compact card inside the `history` mode, not a new Workouts hub entry.
