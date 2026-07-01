# Milestone 8 Execution Plan: Social Sharing And Copying

Status date: 2026-07-01

## Goal

Ship the social safety foundation for public guided workouts:

- rule-tested private/tribe/public visibility
- rule-tested bidirectional block enforcement
- public workout discovery
- copy public workout to private draft with permanent creator attribution
- follow/unfollow creator integration

## Security First

This milestone starts with Firestore emulator allow/deny tests because public/social content is a trust boundary.

Required rule cases:

- owner can read own private session
- non-owner cannot read private session
- follower can read tribe-visible public workout
- non-follower cannot read tribe-visible public workout
- public workout is readable unless either side has blocked the other
- direct public workout writes require an owned source training session
- non-admin cannot write `exerciseCatalog`
- non-admin cannot write `exercisePRs`

## Implementation Scope

### Backend / Rules

- Add `@firebase/rules-unit-testing` and `firebase-tools`.
- Add `npm run test:workouts-rules`.
- Add emulator rules tests for M8 gate.
- Add `copyPublicWorkout` callable in `australia-southeast1`.
- Make copy operation server-side:
  - checks visibility/follower/block state itself
  - writes deterministic private `workoutTemplates/{templateId}`
  - preserves original creator attribution
  - increments `publicWorkouts.copiedCount` only on first copy

### Web

- Add public workout discovery section in Workouts tab.
- Add use cases and repository for public workouts.
- Add copy action using `copyPublicWorkout`.
- Add follow/unfollow using existing follow service.
- Add tests for mapper/use-case behavior.

### Native

Native public workout discovery/copy is not implemented in this pass. Existing native follow helpers are present, but wiring M8 into the new Workouts Clean Architecture boundary needs a dedicated follow-up checkpoint.

## Acceptance Status

| Requirement | Status |
|---|---|
| Emulator rules gate | Done |
| Backend copy callable | Done |
| Web public discovery | Done |
| Web copy action | Done |
| Web follow/unfollow | Done |
| iOS public discovery/copy | Gap |
| Android public discovery/copy | Gap |

## Out Of Scope

- Moderation queue for public workouts.
- Native M8 UI parity.
- Public workout deep links.
- Public workout detail pages.
