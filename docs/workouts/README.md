# TribeLog Workouts Planning Pack

This folder contains the pre-Phase 1 planning artifacts for the TribeLog Workouts feature.

No production code has been changed by this planning pack.

## Review Order

0. [Roadmap And Claude Checkpoints](WORKOUTS_ROADMAP_CHECKPOINTS.md)
1. [Foundation Architecture](FOUNDATION_ARCHITECTURE.md)
2. [Visual Proof Of Concept](visual-poc/README.md)
3. [Platform Implementation Templates](templates/README.md)
4. [Phase 1 Plan](PHASE_1_PLAN.md)

## Primary Decision For Review

Claude proposed a possible Postgres + API backend. The current app already has Firebase Auth, Firestore, Storage-ready deployment, follow edges, public profiles, public routines, private training sessions, and the Tribe feed.

Recommendation for Phase 1: use the existing Firebase architecture, add a clean repository boundary on each client, and defer a Postgres/API migration until scale, moderation, or analytics requirements justify it.
