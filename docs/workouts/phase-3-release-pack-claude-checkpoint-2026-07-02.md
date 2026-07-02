# Phase 3 Release Pack And Phase 4 Vote Checkpoint

Date: 2026-07-02

## Verdict Requested

Please review the Phase 3 release pack and the proposed Phase 4 tribe vote.

Requested verdict:

- APPROVED
- APPROVED WITH FIXES
- BLOCKED
- REVIEW INCONCLUSIVE

## Phase 3 Scope

Phase 3 moved Workouts from guided logging into early training intelligence while keeping the Workouts tab simple:

- Progressive overload suggestions.
- Weekly muscle-volume insight.
- Muscle-volume heat-map visual.
- Shareable workout insight cards.
- App-generated share-card image export on Web, iOS, and Android.
- Public workout trend ranking refinement.

All user-facing Phase 3 surfaces live inside existing subflows:

- `Progress > History`
- `Explore > Tribe workouts`

No extra top-level Workouts hub entry was added.

## Release Readiness

### Product

- [x] Phase 3 stays inside subflows and does not overcrowd the Workouts hub.
- [x] Progressive overload copy is conservative and transparent.
- [x] Muscle volume explains weekly distribution without medical claims.
- [x] Share cards require explicit user action.
- [x] Public trends keep creator attribution and avoid raw score display.
- [x] Free-user access remains protected.

### Trust And Privacy

- [x] Progression suggestions are owner-private.
- [x] Muscle volume aggregates are owner-private.
- [x] Share captions exclude private notes, exact timestamps, raw set logs, and source session IDs.
- [x] Share images are generated locally from privacy-safe card models.
- [x] No automatic public posting.
- [x] No unsupported health, medical, rehab, injury, diagnosis, treatment, or guaranteed-outcome claims.

### Backend

- [x] `syncWorkoutProgressionSuggestions` deployed to `australia-southeast1`.
- [x] `syncWorkoutInsightAggregates` deployed to `australia-southeast1`.
- [x] Rate limits return structured `retryAfterSeconds` metadata.
- [x] Client cooldowns prefer structured details before legacy message parsing.
- [x] User-triggered refresh is explicit and not automatic.

### Platform

- [x] Web Phase 3 progress UI implemented.
- [x] iOS native parity implemented.
- [x] Android native parity implemented.
- [x] Web share-card image export implemented.
- [x] iOS share-card image export implemented.
- [x] Android share-card image export implemented.

## Remaining Release Gates

These should be completed before a public announcement:

- [ ] Real iPhone screenshots:
  - Progress insight card.
  - Muscle heat-map card.
  - Share-card preview/share sheet.
- [ ] Real Android screenshots:
  - Progress insight card.
  - Muscle heat-map card.
  - Share-card preview/share intent.
- [ ] One signed-in production share smoke:
  - Web image download/share preview.
  - iOS system share sheet opens with image.
  - Android share intent opens with image URI.
- [ ] Claude review of native parity checkpoint:
  - `docs/workouts/phase-3-native-parity-share-export-claude-checkpoint-2026-07-02.md`

## Phase 3 Announcement Draft

```text
Workouts just got smarter.

TribeLog can now turn your completed guided workouts into progress insights:

- conservative next-step suggestions
- weekly muscle balance
- shareable workout recap cards

The app still stays simple. Start workouts, follow plans, check progress, and share only when you choose.

Free forever. Built by the tribe, for the tribe.
```

## Phase 4 Vote

Question:

```text
Should TribeLog open Workouts to community and creator contributions?
```

Options:

```text
1. Community exercise submissions
Members can suggest exercises, but TribeLog reviews them before they appear.

2. Community training plan submissions
Members can submit plan ideas, and the tribe votes on which ones get polished.

3. Verified coach-created plans
Approved coaches can publish plans while user access stays free.

4. Not yet
Keep Workouts official-only while we improve quality, assets, and safety.
```

Recommended framing:

```text
Workouts is getting deeper, but we need to decide how open it should become.

Should TribeLog let the tribe and coaches contribute exercises or plans?

Vote below. Free user access stays protected either way.
```

## Phase 4 Guardrails

Do not start production creator publishing until these are approved:

- creator eligibility policy
- content safety policy
- moderation states and admin actions
- report/takedown flow
- creator attribution policy
- free-user boundary
- creator monetization boundary
- store policy review for any creator-side paid feature

## Known Gaps

- This checkpoint does not implement Phase 4 production code.
- Native real-device screenshots are still required for Phase 3 public launch.
- The high-fidelity real asset track remains separate and still depends on real MP4/WebM/poster files.
- Creator monetization is intentionally not designed here beyond guardrails.

## Questions For Claude

1. Is Phase 3 ready for public announcement after native screenshots and share smoke checks?
2. Are any Phase 3 privacy or safety gates missing?
3. Is the Phase 4 vote framed clearly enough for Instagram and in-app voting?
4. Should creator/community submissions begin with exercises, plans, coach-created plans, or stay official-only?
5. What must be added to the Creator Policy And Moderation Plan before Codex starts Phase 4 production code?
