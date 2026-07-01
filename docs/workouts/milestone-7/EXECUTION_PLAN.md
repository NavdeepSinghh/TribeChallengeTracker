# Milestone 7 Execution Plan: History, PRs, And Feed Auto-Log

Status date: 2026-07-01

## Goal

Expose the trusted backend outcome of a completed guided workout across Web, iOS, and Android:

- session history
- volume summary
- server-written personal records
- deterministic activity/feed mirror indicators
- public workout mirror status

The trusted writes remain in `finishWorkoutSession`; clients only read and present the resulting documents.

## Scope

### Web

- Add a Workouts History domain model and use cases.
- Add a Firestore history repository for:
  - `users/{uid}/trainingSessions`
  - `users/{uid}/exercisePRs`
- Add a ViewModel hook and UI section in the Workouts tab.

### iOS

- Add Swift domain models, use cases, repository protocol, Firestore repository, ViewModel, and SwiftUI section.
- Wire the section into the Workouts tab below Guided Workout.

### Android

- Add Kotlin domain models, use cases, repository interface, Firestore repository, StateFlow ViewModel, and Compose section.
- Wire the section into the Workouts tab below Guided Workout.

## Data Contracts

Read paths:

```text
users/{uid}/trainingSessions
users/{uid}/exercisePRs
```

Trusted write source:

```text
functions.finishWorkoutSession
```

Mirror IDs shown in UI:

```text
activityLogId
feedId
publicWorkoutId
```

## Acceptance Criteria

- Completed sessions are listed newest-first.
- History summary counts only `status == "completed"` sessions.
- Personal records read from `exercisePRs`, not client-computed trusted state.
- Volume trend ignores active/draft sessions.
- UI clearly shows when a completed session has activity/feed/public mirrors.
- Web, iOS, and Android follow Clean Architecture boundaries.
- Unit tests cover mappers, summaries, use cases, and ViewModel state transitions.

## Out Of Scope

- Publishing/unpublishing public workouts; that belongs to Milestone 8.
- Delete/update mirror cleanup UI; the backend already owns deterministic IDs, and destructive management will be designed with social rules in M8.
- Firebase emulator rules tests; still the M8 hard gate.
- Real device screenshots; still required for release and future review, but not captured during this local code pass.
