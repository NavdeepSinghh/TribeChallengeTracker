# Phase 4.0 Creator Policy And Moderation Plan Checkpoint

Date: 2026-07-02

## Verdict Requested

Please review the Workouts creator/community policy and moderation plan before any Phase 4 production publishing code is written.

Requested verdict:

- APPROVED
- APPROVED WITH FIXES
- BLOCKED
- REVIEW INCONCLUSIVE

## Scope

This checkpoint defines the safety boundary for Phase 4:

- creator eligibility
- accepted content types
- content policy
- moderation states
- admin actions
- takedown/report flow
- attribution policy
- free-user boundary
- creator monetization boundary

It does not implement creator publishing UI or public creator content yet.

## Start Condition

Production Phase 4 code should not begin until:

- Navdeep captures a tribe vote result or explicitly chooses a direction.
- Claude approves this policy/moderation plan.
- Navdeep confirms the creator monetization boundary.

## Creator Eligibility

Initial eligible contributors:

- TribeLog admin/official content team.
- Existing trusted tribe members invited by Navdeep.
- Verified coaches approved by admin review.

Not eligible without manual approval:

- anonymous accounts
- accounts with unresolved safety reports
- accounts blocked by admins
- accounts attempting paid claims, medical claims, or off-platform sales pressure

## Content Types

Allowed Phase 4 submission types:

- `exercise_submission`
- `training_plan_submission`
- `form_video_submission`
- `coach_plan_submission`

Deferred:

- paid user-side workout access
- automated AI plan publishing without review
- supplement/nutrition prescribing
- injury rehab plans
- medical, diagnostic, treatment, or guaranteed-outcome content

## Source Distinction

Every workout content record must preserve source:

```text
official
community
coach
copied
user_private
```

Public UI must distinguish:

- Official TribeLog content.
- Community-submitted content.
- Coach-created content.

## Moderation States

```text
draft
submitted
in_review
needs_changes
approved
published
rejected
archived
takedown_pending
taken_down
```

Rules:

- Only `published` content can appear in public discovery.
- Only admins can move content to `approved`, `published`, `rejected`, `taken_down`, or `archived`.
- Creators can edit drafts and resubmit `needs_changes` content.
- Published content updates should create a new reviewed revision, not silently mutate the public version.

## Required Submission Fields

### Exercise Submission

```text
id
creatorUid
creatorDisplayName
name
category
primaryMuscles
secondaryMuscles
equipment
level
instructions
formCues
commonMistakes
source
status
createdAt
updatedAt
```

### Training Plan Submission

```text
id
creatorUid
creatorDisplayName
title
goal
level
durationWeeks
daysPerWeek
schedule
description
source
visibility
status
createdAt
updatedAt
```

### Form Video Submission

```text
id
creatorUid
exerciseId
videoStoragePath
posterStoragePath
durationSeconds
source
status
createdAt
updatedAt
```

## Content Policy

Reject or request changes for:

- medical, diagnosis, treatment, rehab, therapy, injury, pain-free, or guaranteed-outcome claims
- unsafe exercise instructions
- extreme weight-loss promises
- shame-based language
- supplement/drug claims
- off-platform payment links
- fake urgency
- harassment, hate, sexual content, or irrelevant content
- copyrighted material without rights
- AI-generated visuals presented as human-shot footage

Allowed:

- general fitness form cues
- conservative progression suggestions
- equipment substitutions
- beginner/intermediate/advanced labels
- clear disclaimers that content is not medical advice

## Admin Actions

Minimum admin actions:

- view submission
- request changes with reason
- approve
- publish
- reject with reason
- archive
- mark takedown pending
- take down
- restore after appeal
- view attribution/copy usage

Admin actions must write:

```text
reviewedBy
reviewedAt
reviewNote
status
updatedAt
```

## Report And Takedown Flow

Existing `contentReports` can be reused, but Workouts needs new content types:

```text
workout_exercise
workout_plan
workout_form_video
workout_creator_profile
```

Flow:

1. Member reports visible content.
2. Report enters `open`.
3. Admin marks `reviewing`.
4. Admin chooses `dismissed`, `resolved`, or creates a `takedown_pending` state on the content.
5. If content is unsafe, admin moves content to `taken_down`.
6. Creator can receive a `needs_changes` note or final `rejected/taken_down` result.

## Attribution Policy

- Creator name stays attached forever.
- Copied plans preserve original creator attribution.
- If a creator account is deleted, public attribution should degrade to `Former creator` while preserving the original source ID internally for audit.
- Admin-published official edits must not overwrite original creator credit without explicit attribution transfer.

## Free-User Boundary

Non-negotiable:

- Users can browse and use official/community/coach workouts for free in Phases 1-3 and any free Phase 4 surface.
- Coach Pro can be creator-side tooling, not user-side workout access gating.
- No paid lock on core guided workouts, exercise library, progress insights, or copied community plans unless Navdeep explicitly changes the app promise and store posture.

## Creator Monetization Boundary

Allowed later, after separate review:

- creator-side subscription for publishing tools
- sponsor-supported plans
- coach analytics tier
- creator profile upgrades

Not allowed in this checkpoint:

- user-side paid workout gates
- paid medical coaching
- unreviewed paid plans
- in-app revenue share without App Store / Play Store policy review
- external checkout links inside workout content

## Proposed Firestore Collections

These are proposed only; do not ship rules until Claude approves:

```text
workoutCreatorApplications/{uid}
workoutContentSubmissions/{submissionId}
workoutContentReviews/{reviewId}
workoutContentReports/{reportId}
publishedWorkoutCreatorProfiles/{uid}
publishedCommunityExercises/{exerciseId}
publishedCommunityTrainingPlans/{planId}
publishedWorkoutFormVideos/{videoId}
```

Security direction:

- creator applications: owner/admin read, owner create/update while open, admin review
- submissions: owner/admin read before publish, admin-only publish
- published content: signed-in read, admin-only write
- reports: reporter/admin read, signed-in create, admin update
- videos: no public display before `published`

## Architecture Boundary

Recommended implementation order after approval:

1. Domain models and validators.
2. Firestore rules and emulator tests.
3. Admin-only moderation repository/use cases.
4. Creator draft submission repository/use cases.
5. Web admin review UI.
6. Web creator submission UI.
7. Native read-only public creator surfaces.
8. Native creator submission parity only after web moderation is stable.

## Claude Review Questions

1. Is this policy strict enough to start Phase 4 safely?
2. Should creator plans or community exercise submissions come first?
3. Should Workouts reuse generic `contentReports`, or introduce `workoutContentReports` for clearer rules/tests?
4. Which fields should be mandatory before a creator exercise can be submitted?
5. What Firestore emulator tests should be mandatory before public creator content ships?
6. Does this preserve the free-user boundary clearly enough?
