# TribeLog Workouts Roadmap And Claude Checkpoints

Status date: 2026-07-01  
Owner: Navdeep  
Implementation: Codex  
Review partner: Claude

## Purpose

This document is the master roadmap for the Workouts feature. It gives Codex a build sequence and gives Claude a stable checkpoint structure for later reviews, even when a new Claude instance has no prior chat context.

The product goal is to move TribeLog from an activity logger toward a guided trainer while preserving the current promise:

- Free forever for users.
- Built by the tribe, for the tribe.
- Tribe votes at major phase boundaries.
- Backend-driven content so exercises, workouts, plans, and assets can evolve without app-store releases.

## Current State

| Area | Status |
|---|---|
| Milestone 0 | Approved |
| Milestone 1 | Approved |
| Milestone 2 | Approved |
| Milestone 3 | Approved |
| Milestone 4 | Approved |
| Milestone 5 | Approved |
| Milestone 5.5 | Implemented; ready for Claude checkpoint |
| Milestone 6 | Implemented and hardened with native guided tests; awaiting Claude checkpoint |
| Milestone 7 | Claude approved |
| Milestone 8 | Claude approved after native parity and callable deploy |
| Milestone 9 | Batches 1-4 approved; Batch 5 generated and awaiting Claude review |
| Milestone 10 | Release readiness stoplight created; not ready |

Current review pack:

```text
docs/workouts/review-packs/workouts-m9-batch1-revision-review-pack.zip
```

## Operating Rules

### Build Rule

Codex may implement within an approved milestone. Codex should not start a high-risk next milestone until Claude has reviewed the previous checkpoint or Navdeep explicitly accepts the risk.

High-risk means any milestone that changes:

- Cloud Functions.
- Firestore security rules.
- Social visibility.
- User-generated public content.
- Payments or creator monetization.
- Native guided workout state machines.
- App Store / Play Store permission posture.

### Review Rule

Every checkpoint sent to Claude must include:

1. `CLAUDE_REVIEW_PACKET.md`
2. `EXECUTION_PLAN.md`
3. `EXECUTION_LOG.md`
4. `TEST_REPORT.md`
5. `ARCHITECTURE_REVIEW.md`
6. `BRAND_AUDIT.md`
7. `KNOWN_GAPS.md`
8. Screenshots or short videos when UI changed.
9. Security rules and tests when rules changed.
10. Exact commands run and results.

### Verdict Labels

Claude should use one of these verdicts:

| Verdict | Meaning |
|---|---|
| `APPROVED` | Proceed to next checkpoint. |
| `APPROVED WITH FIXES` | Proceed only if listed fixes are tracked; blocking fixes must land first. |
| `BLOCKED` | Do not proceed. Codex must fix and resubmit. |
| `REVIEW INCONCLUSIVE` | Missing evidence. Codex must provide artifacts or commands. |

### Hard Gates

These cannot be bypassed without an explicit Navdeep decision:

- No public/social workout feature ships without Firestore emulator allow/deny tests.
- No PR, badge, feed, or public publishing trust boundary is client-only.
- No Phase 1 production release without `finishWorkoutSession` deployed and smoke-tested.
- No 50-exercise expansion with assets served from `/public`; production assets must use Firebase Storage or equivalent CDN-backed storage.
- No user-side premium gating in Phases 1-3.
- No health/medical claims in product copy or store notes.
- No native guided-workout release without real device screenshots.

## Global Architecture Principles

| Principle | Requirement |
|---|---|
| Backend-driven content | Clients read exercises, workouts, plans, and asset manifests from backend documents. |
| Clean Architecture | Domain has no UI or Firebase imports. Presentation has no Firestore imports. Data layer owns SDK calls. |
| MVVM | ViewModels expose observable UI state and depend on use cases, not repositories directly when use cases exist. |
| Server trust | PRs, feed mirrors, badge awards, public publishing validation, and moderation decisions are server-side. |
| Platform parity | Web, iOS, and Android should ship equivalent behavior per checkpoint. |
| Asset discipline | Lottie for motion, SVG for muscle maps, WebP/PNG for thumbnails, lazy-loaded and cacheable by hash. |
| Social safety | Visibility, blocks, follows, and attribution are enforced by rules/functions, not only by clients. |

## Phase 1: Workouts Foundation

Phase 1 goal: Ship a complete Workouts tab foundation with backend-driven catalog, guided sessions, history, PRs, social sharing, 50 official exercises, and a release pack.

### Checkpoint 0: Foundation Approval

Status: Approved.

Claude reviews:

- Firebase-first architecture.
- Visual proof of concept.
- Platform templates.
- Phase 1 milestone order.

Required evidence:

- `FOUNDATION_ARCHITECTURE.md`
- `PHASE_1_PLAN.md`
- Visual POC assets.
- Platform templates.

Exit criteria:

- Architecture approved.
- Lottie/SVG style approved.
- Phase 1 milestones accepted.

### Checkpoint 1: Backend Foundation

Status: Approved.

Build scope:

- Firestore rules and indexes.
- `finishWorkoutSession` callable contract.
- Deterministic IDs.
- Server-side PR write plan.
- Block list rule enforcement.

Claude checks:

- Firestore rules enforce ownership and visibility.
- Finish writes are idempotent.
- PRs are server-trusted.
- Block checks are bidirectional.
- Tests cover retry/idempotency behavior.

Hard blockers:

- Any client direct-write path to trusted PRs.
- Any social visibility enforced only in UI.
- Any use of `addDoc` for finish mirrors where deterministic IDs are required.

### Checkpoint 2: Admin Content Seed Path

Status: Approved.

Build scope:

- Admin-only seed utility.
- Exercise schema validation.
- Asset manifest validation.
- Initial proof exercises.

Claude checks:

- Non-admin writes cannot seed catalog.
- Bad schema fails before write.
- Asset path/hash conventions are enforced.
- Seed utility has dry-run and apply behavior.

Hard blockers:

- Production catalog writes without admin validation.
- Seed data hardcoded into clients as primary source.

### Checkpoint 3: Web Read-Only Library

Status: Approved.

Build scope:

- Web Workouts tab shell.
- Exercise library.
- Search/filter.
- Detail view.
- Loading, empty, loaded, error states.

Claude checks:

- ViewModel does not import Firebase.
- Repository is only Firestore boundary.
- UI follows brand.
- Content comes from backend.

Hard blockers:

- Hardcoded exercise content as primary source.
- No empty/error states.

### Checkpoint 4: iOS Read-Only Library

Status: Approved.

Build scope:

- SwiftUI Workouts shell.
- Catalog repository/protocol.
- ViewModel/use cases.
- Detail view and asset metadata preview.

Claude checks:

- Swift domain files import Foundation only where possible.
- ViewModel does not import FirebaseFirestore.
- Composition root wires repository to use cases.
- Build succeeds on simulator/generic iOS/device when available.

Hard blockers:

- Firestore imports in SwiftUI view or ViewModel.
- No backend catalog path.

### Checkpoint 5: Android Read-Only Library

Status: Approved.

Build scope:

- Compose Workouts shell.
- Catalog repository/interface.
- ViewModel with StateFlow.
- Detail view and Lottie playback for absolute URLs.

Claude checks:

- Domain is pure Kotlin.
- ViewModel uses StateFlow, not LiveData.
- Firebase isolated to data layer.
- Android UI matches iOS/Web behavior.

Hard blockers:

- Firestore usage in Compose or ViewModel.
- No build pass.

### Checkpoint 5.5: Native Catalog Test Coverage

Status: Implemented; ready for Claude review.

Build scope:

- iOS unit test target.
- Android unit tests.
- Mapper tests.
- Lottie frame-count tests.
- Catalog ViewModel state-transition tests.

Claude checks:

- iOS and Android each have at least 10 passing catalog tests.
- ViewModel tests use fake repositories.
- Tests do not require live Firebase.
- This gate is sufficient to review M6.

Hard blockers:

- `NO-SOURCE` for native tests.
- Test target that cannot run locally.

Review packet:

```text
docs/workouts/milestone-5.5/CLAUDE_REVIEW_PACKET.md
```

### Checkpoint 6: Guided Workout MVP

Status: Implemented and hardened with native guided tests; awaiting Claude review.

Build scope:

- Select exercises from catalog.
- Start guided session.
- Set/reps/weight entry.
- Rest timer.
- Local active-session persistence.
- Finish summary.
- Pending finish retry.
- Cross-platform finish payload parity.
- Native guided domain/ViewModel tests for start, set completion, pending finish, and retry.

Claude checks:

- State machine is coherent.
- `assetHashSnapshot` is captured at session creation.
- Pending retry reuses same `sessionId`.
- Finish goes through `finishWorkoutSession`.
- Quick Log remains available.
- Native direct HTTPS callable use is accepted or replaced with Functions SDK.
- Native guided tests are sufficient for M7 or more coverage is requested.

Hard blockers before production release:

- `finishWorkoutSession` not deployed.
- No authenticated finish smoke test.
- No real device screenshots.
- No live background/foreground timer QA yet.

Review packet:

```text
docs/workouts/milestone-6/CLAUDE_REVIEW_PACKET.md
docs/workouts/milestone-6/GUIDED_WORKOUT_STATE_MACHINE_PROPOSAL.md
```

### Checkpoint 7: History, PRs, And Feed Auto-Log

Status: Implemented; awaiting Claude review.

Build scope:

- Session history.
- Finished workout detail.
- Volume summary.
- PR display from server-trusted PR docs.
- Activity log mirror.
- Tribe feed mirror.
- Delete/update mirrored records.

Claude checks:

- `finishWorkoutSession` is deployed or deployment remains a clearly documented release blocker.
- Feed/activity writes use deterministic IDs.
- Repeated finish retries do not duplicate history, activity, or feed.
- PR documents are read from trusted server-written docs.
- Feed write failure does not destroy the completed session.

Required tests:

- Finish same session twice: one activity, one feed.
- Finish with points: activity and feed points match.
- PR update for new best weight/volume.
- No PR update for lower/equal performance.
- Delete/hide session updates mirrored public/feed docs.

Hard blockers:

- Duplicate feed entries on retry.
- Client writes trusted PR docs.
- History UI showing unsanitized private notes publicly.

Review packet:

```text
docs/workouts/milestone-7/CLAUDE_REVIEW_PACKET.md
```

### Checkpoint 8: Social Sharing And Copying

Status: Partial implementation; awaiting Claude review.

Build scope:

- Visibility selector: private, tribe, public.
- Publish/unpublish.
- Public workout discovery.
- Copy public workout to private draft.
- Creator attribution.
- Follow/unfollow integration.
- Firestore emulator allow/deny tests.

Claude checks:

- Rules unit tests cover visibility, follower, block, admin, and PR constraints.
- Public workouts are sanitized snapshots.
- Copied workouts preserve original creator attribution permanently.
- Blocked users are denied by rules, not only hidden by UI.

Required emulator tests:

- Owner can read private session.
- Non-owner cannot read private session.
- Follower can read tribe-visible workout.
- Non-follower cannot read tribe-visible workout.
- Signed-in user can read public workout unless blocked.
- Either direction block denies public workout read.
- Non-admin cannot write `exerciseCatalog`.
- Non-admin cannot write `exercisePRs`.

Hard blockers:

- No `@firebase/rules-unit-testing` suite.
- Any public discovery path that ignores block lists.
- Copy flow that loses creator attribution.

Current checkpoint note:

- Emulator rules suite is implemented and passing.
- Backend copy callable and Web discovery/copy/follow UI are implemented.
- iOS and Android M8 UI parity are complete and Claude-approved.

Review packet:

```text
docs/workouts/milestone-8/CLAUDE_REVIEW_PACKET.md
```

### Checkpoint 9: 50 Exercise Library Expansion

Status: Batch 1 was blocked by Claude for visual regression and placeholder thumbnails, revised, and approved. Batch 2 upper-pull assets were approved after the curl anatomy fix. Batch 3 lower-body assets were approved. Batch 4 core assets were approved. Batch 5 cardio/mobility assets are generated for review.

Build scope:

- Firebase Storage asset pipeline.
- 50 official exercise documents.
- 50 Lottie demonstrations in approved anatomical style.
- Muscle map highlights.
- Thumbnails.
- Batch visual review.

Claude checks:

- Assets are not served from `/public` for production.
- Assets lazy-load and cache by `assetHash`.
- Each batch of 10 animations matches approved style.
- Schema validation passes for all 50 docs.
- UI remains performant with 50 exercises.

Batch review rule:

- Generate assets in batches of 10.
- Claude reviews each batch before the next batch.
- Do not generate all 50 and discover visual drift at the end.

Hard blockers:

- Storage pipeline missing.
- Relative asset paths cannot resolve on iOS/Android/Web.
- Lottie style drifts back to abstract blobs.

Current checkpoint note:

- Storage upload validator exists and dry-run passes.
- First batch of 10 upper-push exercise seed records and generated assets exists.
- Batch 1 muscle maps have been revised back to the M0 connected-body anatomical style and approved.
- Batch 1 thumbnails are real generated WebP cards, not text placeholders.
- Batch 2 adds upper-pull back-view highlights for lats, rhomboids, rear delts, biceps, and forearms.
- Batch 2 curl fix is applied: biceps now highlight upper arm, not forearm.
- Batch 3 adds lower-body quads, hamstrings, glutes, calves, and lower-back support regions.
- Batch 4 adds core, obliques, lower abs, and hip-flexor support regions.
- Batch 5 adds cardio movement-chain highlights and mobility stretch-target highlights.
- All 50 exercise seed records and 200 local asset entries are generated locally.
- Firebase Storage upload has not been run.

Review packet:

```text
docs/workouts/milestone-9/CLAUDE_REVIEW_PACKET.md
```

### Checkpoint 10: Phase 1 Release Pack

Status: Release readiness stoplight created; Phase 1 not ready.

Build scope:

- Final docs.
- Test report.
- Brand audit.
- Known gaps.
- Store notes if needed.
- Tribe vote prompt for Phase 2.

Claude checks:

- All prior blockers closed or explicitly deferred by Navdeep.
- Builds pass on Web, iOS, Android.
- Real iPhone screenshots included.
- Android build target verified.
- Firestore rules deployed and tested.
- Cloud Function deployed and smoke-tested.
- Store privacy/permission posture is unchanged or documented.

Hard blockers:

- Unreviewed public/social rules.
- No production smoke test of finish flow.
- Missing release notes for changed user-facing behavior.

Current readiness packet:

```text
docs/workouts/milestone-10/PHASE_1_RELEASE_READINESS.md
docs/workouts/milestone-10/CLAUDE_REVIEW_PACKET.md
```

## Phase 2: Training Plans

Phase 2 goal: Make the app tell users what to do today through structured, tribe-voted training plans.

Start condition:

- Phase 1 release pack approved.
- Tribe vote completed for Phase 2 direction.
- Navdeep approves first official plan themes.

### Checkpoint 2.0: Tribe Vote And Plan Scope

Build scope:

- Vote prompt.
- Result summary.
- Plan themes selected.
- Acceptance criteria for first 3-5 plans.

Claude checks:

- Scope reflects tribe vote.
- No user-side premium gating.
- Claims are fitness guidance, not medical advice.
- Plans are feasible with existing exercise library.

Hard blockers:

- Building plans before vote result is captured.
- Unsupported claims like injury treatment or medical outcomes.

### Checkpoint 2.1: Plan Backend And Enrollment

Build scope:

- `trainingPlans` schema.
- `users/{uid}/planEnrollments`.
- Plan schedule/progression model.
- Enrollment state and adherence fields.
- Rules for official/user plans.

Claude checks:

- Template vs user enrollment are separated.
- User customization does not mutate official template.
- Plan visibility follows social safety rules.
- Offline/cached plan behavior is defined.

Required tests:

- Enroll in plan.
- Skip/reschedule day.
- Complete plan day from guided workout.
- Official template remains immutable to users.

### Checkpoint 2.2: Plan Discovery And Enrollment UI

Build scope:

- Plan browser.
- Plan detail.
- Enroll/leave plan.
- Plan schedule preview.
- Web/iOS/Android parity.

Claude checks:

- Clear effort/frequency expectations.
- No fake urgency.
- Good empty/error/loading states.
- Consistent brand.

### Checkpoint 2.3: Today Tab Integration

Build scope:

- Today's workout card.
- Continue plan workout.
- Rest day UI.
- Missed workout recovery.

Claude checks:

- Today tab remains useful without active plan.
- Quick Log remains accessible.
- Comeback copy is supportive, not guilt-based.

### Checkpoint 2.4: Plan Customization And Substitutions

Build scope:

- Skip day.
- Swap exercise.
- Adjust frequency.
- Substitute exercise mid-workout.

Claude checks:

- Substitutions use compatible muscles/equipment/level.
- User customization is saved per enrollment.
- Official plan attribution remains intact.

### Checkpoint 2.5: Plan Badges And Adherence

Build scope:

- Plan completion badges.
- Weekly adherence dashboard.
- Streak/community nudges.

Claude checks:

- Badge awards are server-trusted.
- Copy avoids shame or dark patterns.
- Adherence metrics are understandable.

### Checkpoint 2.6: Phase 2 Release And Vote

Build scope:

- Phase 2 release pack.
- Tribe vote for Phase 3 direction.

Claude checks:

- Plan flows are complete across platforms.
- Known gaps are explicit.
- Phase 3 vote prompt is ready.

## Phase 3: Depth And Intelligence

Phase 3 goal: Make Workouts feel mature and defensible against dedicated workout apps through progression, insight, and a larger catalog.

Start condition:

- Phase 2 release approved.
- Tribe vote completed for advanced features.
- Enough workout data exists for useful aggregation or fallback messaging is approved.

### Checkpoint 3.0: Advanced Feature Vote And Metrics Plan

Build scope:

- Tribe vote result.
- Metric definitions.
- Data minimum thresholds.
- Privacy posture.

Claude checks:

- Insights are framed as training trends, not medical diagnosis.
- Users can understand when there is insufficient data.

### Checkpoint 3.1: Volume Aggregation Backend

Build scope:

- Weekly muscle volume aggregation.
- Backfill plan.
- Scheduled or callable aggregation.
- Rules for reading private aggregates.

Claude checks:

- Aggregates cannot leak private workout details.
- Multiple-device finish retries do not double-count.
- Backfill is idempotent.

### Checkpoint 3.2: Progressive Overload Suggestions

Build scope:

- Suggest next weight/reps.
- Explain suggestion.
- Respect user level/history.

Claude checks:

- Suggestions are conservative and transparent.
- No medical or injury claims.
- User can ignore suggestions easily.

### Checkpoint 3.3: Muscle Volume Heat Map

Build scope:

- Anatomical heat map.
- Weekly distribution.
- Under/over-trained indicators.

Claude checks:

- Visuals match approved anatomy style.
- Insufficient-data state is clear.
- Colors remain accessible.

### Checkpoint 3.4: Expanded 200+ Exercise Catalog

Build scope:

- More official exercises.
- Asset generation in reviewed batches.
- Search/filter scaling.

Claude checks:

- Schema validation passes.
- Performance remains acceptable.
- Animation style remains consistent.

### Checkpoint 3.5: Workout Sharing Cards And Trends

Build scope:

- Share cards for Instagram/screenshots.
- Trending public workouts.
- Feed cards.

Claude checks:

- Public content moderation posture is adequate.
- Private data is never included in share cards.
- Attribution remains visible.

### Checkpoint 3.6: Phase 3 Release And Vote

Build scope:

- Phase 3 release pack.
- Tribe vote: community contributions yes/no/how.

Claude checks:

- Advanced insights are stable.
- Known gaps are honest.
- Community contribution risks are listed before Phase 4.

## Phase 4: Creator Layer

Phase 4 goal: Let coaches and creators contribute plans and form content without compromising the free-for-users promise.

Start condition:

- Tribe vote approves community/creator contribution direction.
- Moderation and creator policies are drafted.
- Navdeep approves creator monetization boundaries.

### Checkpoint 4.0: Creator Policy And Moderation Plan

Build scope:

- Creator eligibility.
- Content policy.
- Moderation states.
- Takedown/report flow.
- Revenue/free-user boundary.

Claude checks:

- User-side features remain free.
- Medical/unsafe claims are prohibited.
- Moderation roles are clear.

Hard blockers:

- Creator publishing without moderation.
- Paid user-side gating sneaking into core workouts.

### Checkpoint 4.1: Coach Profiles And Creator Admin

Build scope:

- Creator profile.
- Admin approval flow.
- Creator content dashboard.

Claude checks:

- Admin permissions are rule/function enforced.
- Public creator pages are sanitized.
- Rejection/appeal states are defined.

### Checkpoint 4.2: Creator Plan Publishing

Build scope:

- Draft creator plans.
- Submit for review.
- Publish approved plans.
- Copy/enroll attribution.

Claude checks:

- Creator attribution persists.
- User-created/official/coach plan sources are distinct.
- Plans cannot bypass safety checks.

### Checkpoint 4.3: Form Video Library

Build scope:

- Video upload pipeline.
- Transcoding/thumbnail generation.
- Moderation queue.
- Exercise-video linking.

Claude checks:

- Uploads are scanned/reviewed before public display.
- Storage/CDN costs are understood.
- Video does not block core workout flow.

### Checkpoint 4.4: Creator Analytics

Build scope:

- Plan views.
- Copies/enrollments.
- Completion stats.
- Creator dashboard.

Claude checks:

- Analytics are aggregated and privacy-safe.
- Individual user workout details are not exposed to creators.

### Checkpoint 4.5: Creator Monetization

Build scope:

- Coach Pro subscription or creator-side tier.
- Payment/reporting plan.
- Store policy review.

Claude checks:

- Monetization is creator-side.
- Core user workout access remains free.
- App Store / Play Store requirements are documented.

### Checkpoint 4.6: Phase 4 Release And Next Vote

Build scope:

- Creator release pack.
- Tribe vote for next major direction.

Claude checks:

- Moderation tested.
- Creator payments and policies reviewed.
- Next vote options are clear: Nutrition, Recovery, Mental Performance, or Other.

## Checkpoint Packet Template

Each checkpoint should include a short `CLAUDE_REVIEW_PACKET.md` using this structure:

```markdown
# Claude Review Packet: [Checkpoint Name]

## Requested Verdict

Ask Claude for one of: APPROVED, APPROVED WITH FIXES, BLOCKED, REVIEW INCONCLUSIVE.

## Context

Summarize previous approved checkpoint and what this checkpoint adds.

## What Changed

- List product changes.
- List backend changes.
- List platform changes.
- List docs/screenshots.

## Key Files

- Web files
- iOS files
- Android files
- Backend/rules/functions files

## Verification

Exact commands and results.

## Security/Privacy Review

Rules, functions, public data, health data, permissions, moderation.

## Brand/UX Review

Screenshots, states, copy, accessibility concerns.

## Known Gaps

Separate blockers from non-blockers.

## Specific Questions For Claude

1. ...
2. ...
3. ...
```

## Store And Compliance Checkpoints

Run these before any TestFlight/App Store/Play Store submission that includes Workouts changes:

- Confirm no new HealthKit/Health Connect write behavior unless reviewed.
- Confirm no ATT prompt unless tracking is truly used and disclosures are ready.
- Confirm App Privacy answers still match data collection.
- Confirm workout copy avoids medical treatment claims.
- Confirm support/privacy/terms/data deletion URLs are live.
- Confirm demo account can access the new Workouts flow.
- Confirm paid language does not contradict "free forever" for users.

## Open Decisions To Track

| Decision | Needed By | Current Recommendation |
|---|---|---|
| Native callable transport: direct HTTPS vs Firebase Functions SDK | Before M6 production release | Prefer SDK for long-term safety if dependency impact is acceptable |
| Deploy `finishWorkoutSession` before M7 or before release | Claude M6 review | Deploy before M7 if M7 depends on live finish behavior |
| Guided workout native state-machine tests | Before M7/M8 reliance | Add before M7 if possible |
| Firebase Storage bucket/path finalization | Before M9 | `workouts/exercises/v1/{exerciseId}/...` |
| First Phase 2 tribe vote option | Phase 1 release | Training Plans vs Custom Builder vs Form Library |
