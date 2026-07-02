# Claude Checkpoint 17: Phase 2 Release And Phase 3 Vote

Status date: 2026-07-01
Verdict requested: release-readiness review
Scope: conditional Phase 2 release pack for Training Plans and the tribe vote prompt for Phase 3 direction.

## Requested Verdict

Please return one of:

- APPROVED
- APPROVED WITH FIXES
- BLOCKED
- REVIEW INCONCLUSIVE

## Important Review Note

This release pack was originally conditional. Claude has now reviewed and approved the implementation checkpoints it depended on:

- Checkpoint 14: Today Tab Training Plan Integration — approved.
- Checkpoint 15: Plan Customization And Substitutions — approved.
- Checkpoint 16: Plan Badges And Adherence — approved.
- Checkpoint 16N: Native parity for plan customization/progress — approved.

Codex also applied Claude follow-ups before this release review:

- Today missed-workout helpers can accept server-trusted adherence counts when available, while falling back to local calculation.
- The skipped-day UI now uses neutral copy: `Today is a rest day`.
- The adherence badge scale refactor, badge-to-feed dependency, and Coach Pro custom milestone flexibility are tracked in the roadmap.
- A local Phase 2 smoke-contract test now exercises the actual `finishWorkoutSession` trusted path with training plan metadata and verifies completed day, adherence, badge, activity log, tribe feed mirror, and retry idempotency.

This checkpoint gives Navdeep a final checklist and vote prompt for Training Plans launch.

## Claude CP17 Review Result

Claude reviewed this release pack and returned `APPROVED WITH FIXES`.

Claude re-reviewed the documentation/copy fixes and accepted them. Public announcement remains gated on the two real-world execution gates below, and Codex is clear to proceed with Checkpoint 18 review work while those gates stay open.

2026-07-02 completion update:

- Live `trainingPlans` seed applied to production Firestore.
- Firestore rules and indexes deployed.
- `syncTrainingPlanProgress` deployed to `australia-southeast1`.
- `finishWorkoutSession` redeployed to `australia-southeast1` with training-plan progress support.
- Signed-in production smoke passed: completed a planned workout, wrote `completedDayKeys`, cleared the skipped day, wrote adherence, awarded `plan_first_workout`, and wrote exactly one activity mirror for the smoke session.
- Full completion evidence is captured in [phase-2-completion-2026-07-02.md](phase-2-completion-2026-07-02.md).

Remaining blocker before public announcement:

1. Capture real native device screenshots for the Phase 2 launch pack:
   - iPhone: Today card with an active plan, customization panel, and one badge/progress card.
   - Android: equivalent catalog/plan/progress screenshots when a paired device is available.
   - If Android is not accessible before launch, ship the announcement with iPhone screenshots only and follow with an Android Day 2-3 story.

Local pre-production contract check now available:

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run workouts:phase2:smoke-contract
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run workouts:phase2:plans:validate
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run workouts:phase2:plans:dry-run
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run workouts:phase2:release-check
```

Latest result:

- Smoke-contract: `PASS`, 6 tests across `trainingPlanFinishSmoke.test.js` and `trainingPlanProgress.test.js`.
- Plan seed validate: `PASS`, 3 official plans.
- Plan seed dry-run: `PASS`, validates 3 official plans and does not write without `--apply`.
- Phase 2 release-check: `PASS`, includes seed validation, dry-run, smoke-contract, training plan foundation, and Today card tests.

This does not replace the signed-in production smoke test; it proves the trusted handler contract before that real-world run.

App Store / Play Store copy audit:

- Launch copy is acceptable because it says `adjust the rhythm when life gets messy`, `see what to do today`, and `Miss a day? No guilt. Adjust and keep moving.`
- Codex audited `scripts/workout-training-plans-seed.json` for the flagged phrases `medical`, `injury`, `prevent`, `diagnose`, `treat`, `safe for`, `condition`, `guarantee`, `recommended for`, `will help`, and `specific population`.
- Result: no launch-risk hits in the Training Plans seed. Existing validator guardrails still reject unsupported medical/health claim language.

## Phase 2 Release Summary

Phase 2 turns Workouts from a library/session tool into a trainer-style experience:

- Users can browse backend-driven official training plans.
- Users can enroll in a plan without mutating the official template.
- Today surfaces the next plan workout, rest days, missed-day recovery, and plan continuation.
- Users can skip a day, adjust frequency, and view substitution recommendations.
- Guided workout completion can mark plan progress through a server-trusted finish path.
- Adherence and plan badge progress are visible without shame-based copy.
- iOS and Android have matching native plan browsing, enrollment, customization, progress, and badge-progress surfaces.

## Launch Gate Checklist

### Product

- [ ] Training Plans entry appears in the Workouts tab on Web, iOS, and Android.
- [ ] Quick Log and freeform guided workout remain easy to reach.
- [ ] Plans clearly communicate goal, level, duration, frequency, and expected workout length.
- [ ] Rest day copy is supportive.
- [ ] Missed workout copy avoids guilt and fake urgency.
- [ ] Plan customization never mutates the official plan template.
- [ ] Plan progress copy is understandable to a non-technical user.
- [ ] Phase 3 vote prompt is ready before public announcement.

### Trust And Safety

- [ ] No user-side premium gate has been added to Training Plans.
- [ ] Copy does not claim medical treatment, injury prevention, diagnosis, or guaranteed outcomes.
- [ ] Seeded Training Plans copy has been audited for risky phrases such as `recommended for`, `safe for`, `prevents`, injury/condition claims, medical outcomes, and guaranteed outcomes.
- [ ] Plan badges are server-trusted before public launch.
- [ ] Completed plan days are server-trusted through `finishWorkoutSession`, not client-awarded.
- [ ] Enrollment customization remains owner-scoped under Firestore rules.
- [ ] Public/social workout rules from Phase 1 still pass.
- [ ] App Privacy answers remain accurate.
- [ ] No ATT prompt is introduced.
- [ ] No new HealthKit/Health Connect writes are introduced without review.

### Backend And Data

- [ ] `trainingPlans` live seed has been applied.
- [ ] `finishWorkoutSession` handles plan metadata fields:
  - `trainingPlanId`
  - `trainingPlanDayKey`
  - `trainingPlanWeekIndex`
  - `trainingPlanDayIndex`
- [ ] `trainingPlanAdherence` docs are written by server/admin path only.
- [ ] `trainingPlanBadges` docs are written by server/admin path only.
- [ ] `completedDayKeys` cannot be patched by normal clients.
- [ ] Plan enrollment fields support:
  - `customFrequencyDaysPerWeek`
  - `skippedDayKeys`
  - `exerciseSwaps`
- [ ] `syncTrainingPlanProgress` callable is deployed or explicitly deferred with rationale.
- [x] Local smoke-contract test covers planned workout finish, adherence, first badge, activity log, tribe feed mirror, and no duplicate activity entry on retry.

### Platform QA

- [ ] Web: plan discovery, enrollment, Today card, customization, progress panel.
- [ ] iOS: plan discovery, enrollment, Today card, customization, progress panel.
- [ ] Android: plan discovery, enrollment, Today card, customization, progress panel.
- [ ] iOS real-device screenshot captured for Today active plan, customization, and badge/progress state.
- [ ] Android real-device screenshot captured for equivalent plan/progress state, or launch copy explicitly says Android screenshots will follow when a paired device is available.
- [ ] Empty/loading/error states captured for plan surfaces.
- [ ] Signed-in production smoke test completes a planned guided workout and shows progress after finish.
- [ ] Signed-in production smoke test verifies completed day, adherence, badge/progress, feed mirror, and no duplicate feed entries.

## Required Review Inputs

Claude should review this checkpoint together with these documents:

```text
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/today-tab-training-plan-integration-claude-checkpoint-2026-07-01.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/plan-customization-substitutions-claude-checkpoint-2026-07-01.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/plan-badges-adherence-claude-checkpoint-2026-07-01.md
/Users/navdeepsmacbook/Documents/TribeChallengeTracker/docs/workouts/plan-customization-progress-native-parity-claude-checkpoint-2026-07-01.md
```

## Suggested Phase 2 Launch Copy

### Short Announcement

Training Plans are now live in TribeLog.

Pick a plan, see what to do today, adjust the rhythm when life gets messy, and finish workouts straight into your TribeLog progress.

Still free. Still built by the tribe, for the tribe.

### App/Teams Copy

I’ve just shipped Training Plans into TribeLog, my personal fitness app project.

The app now does more than log workouts. You can follow a structured plan, see today’s workout, skip or adjust days when needed, and track plan progress without losing the quick logging flow.

The next direction is going back to the tribe for a vote.

### Instagram Story Sequence

Slide 1:

```text
Training Plans are live.
```

Slide 2:

```text
Open TribeLog.
Pick a plan.
Know what to do today.
```

Slide 3:

```text
Miss a day?
No guilt. Adjust and keep moving.
```

Slide 4:

```text
What should we build next?
Vote below.
```

## Phase 3 Vote Prompt

Question:

```text
What should TribeLog build next for Workouts?
```

Options:

```text
1. Muscle volume heat maps
See which muscle groups you trained this week, where you are balanced, and where you may be neglecting volume.

2. Progressive overload suggestions
Get conservative next-session suggestions for reps or weight based on your own workout history.

3. Bigger exercise library
Expand from 50 official movements toward 200+ exercises with better filters and more demos.

4. Shareable workout insight cards
Create clean Instagram-ready cards for completed workouts, PRs, volume, and plan milestones.
```

Recommended Instagram caption:

```text
The next Workouts feature is going to be tribe-voted.

TribeLog is staying free for users, so the roadmap should be shaped by what actually helps you train.

Vote below:
1. Muscle volume heat maps
2. Progressive overload suggestions
3. Bigger exercise library
4. Shareable workout cards

Built by the tribe, for the tribe.
```

## Recommended Release Sequence

1. Confirm the Training Plans live seed has been applied to production Firestore.
2. Run signed-in Web smoke for a planned guided workout in production.
3. Verify completed day, adherence recomputation, badge/progress card, feed mirror, and no duplicate feed entries.
4. Run iOS and Android QA for plan browsing, enrollment, customization, and progress.
5. Capture real iPhone screenshots for the Today active plan, customization panel, and badge/progress state.
6. Capture Android screenshots when a paired device is available; otherwise launch with iPhone screenshots and schedule an Android follow-up story.
7. Publish Training Plans announcement.
8. Publish Phase 3 vote.
9. Freeze Phase 3 implementation until the vote closes.

## Known Gaps

Blockers:

- Signed-in planned-workout smoke test still needs final live production confirmation after server deploy.
- Real native screenshots for the Phase 2 launch pack are still pending.
- Local smoke-contract coverage is complete, but it is intentionally not a substitute for the signed-in production smoke.

Non-blockers:

- Full mid-workout substitution picker on native can be a follow-up if Claude accepts model-level substitution parity.
- Android screenshots can follow after launch if no paired device is available before the announcement, as long as the launch uses honest iPhone-only screenshots.
- Phase 3 vote result is not known yet; do not start Phase 3 production work until Navdeep decides based on the vote.

## Questions For Claude

1. Is this release checklist complete for Training Plans?
2. Does the vote prompt properly frame Phase 3 options without overpromising?
3. Should any Phase 2 known gap block public announcement?
4. Is the copy aligned with "free forever, built by the tribe, for the tribe"?
5. Are there App Store or Google Play review risks introduced by Training Plans language?
