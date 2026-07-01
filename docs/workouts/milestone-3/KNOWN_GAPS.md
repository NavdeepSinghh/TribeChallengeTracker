# Milestone 3 Known Gaps

## Not Live-Seeded

The 3 proof exercises were validated locally but not written to production Firestore.

To seed when ready:

```bash
cd /Users/navdeepsmacbook/Documents/TribeChallengeTracker
node scripts/seed-workout-exercise-catalog.js --apply --admin-uid <your-admin-uid>
```

The command requires Firebase Admin credentials and a matching `/admins/{uid}` document.

## Lottie Runtime Not Added

Milestone 3 lazy-loads Lottie JSON but does not add a playback runtime. The UI renders a lightweight branded motion fallback and reports the asset state.

The preview metadata now reports frame count as `op - ip` instead of raw `op`; playback fidelity still depends on the runtime decision.

Decision needed before expansion:

- Use `lottie-web`
- Use a Web Component player
- Keep custom SVG/CSS playback for the first 50

## Screenshots Are State Preview Captures

Screenshots were generated from `workouts-state-preview.html`, not an authenticated browser session. This avoids coupling Claude review screenshots to local auth state.

Claude reviewed the actual PNGs and confirmed brand compliance. Repeat live authenticated visual QA after the 3 proof exercises are production-seeded.

## Full Rule Emulator Tests Deferred

`@firebase/rules-unit-testing` remains a Milestone 8 acceptance gate as approved.

## Multi-Filter Query Scale

Milestone 3 intentionally sends one indexed catalog filter to Firestore at a time, then applies the remaining filters client-side. This keeps the first UI slice aligned to the Milestone 1 indexes and avoids a combinatorial index set.

Current priority:

1. Primary muscle
2. Equipment
3. Level

At 50-200 exercises this is acceptable. If catalog reads become costly, add composite filter-specific indexes or a backend search endpoint instead of widening client reads indefinitely.

## Lenient Catalog Mapping Defaults

`mapExerciseDocument` defaults a missing `level` to `beginner` for defensive rendering. The admin seed validator still rejects invalid official seed content before publish, but malformed live docs could render as beginner instead of surfacing as data-quality errors. Revisit when adding admin publish workflows.

## Cloud Function Not Deployed

`finishWorkoutSession` deployment is now tracked as a Milestone 6 pre-flight requirement. It is not needed by the read-only Web library.

## Mobile Parity Not Included

Milestone 3 is Web-only. iOS and Android read-only libraries are Milestones 4 and 5.
