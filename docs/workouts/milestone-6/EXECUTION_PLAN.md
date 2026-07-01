# Milestone 6 Execution Plan: Guided Workout MVP

## Goal

Ship the first guided workout flow across Web, iOS, and Android so a user can select exercises from the backend-driven catalog, start a session, complete sets, use a rest timer, persist the active session locally, and finish through the trusted `finishWorkoutSession` backend boundary.

## Scope

- Select 1-6 catalog exercises for a guided workout.
- Create a local active session with 3 draft sets per exercise.
- Track reps, weight, completed sets, duration, volume, and rest timer state.
- Persist active sessions locally so app backgrounding or refresh does not lose state.
- Build finish payloads that include `assetHashSnapshot` per exercise.
- Call `finishWorkoutSession` on completion.
- Save a pending finish payload locally if network/function submission fails.
- Provide retry and discard flows.
- Implement parity across Web, iOS, and Android.

## Out Of Scope

- Training plans.
- Custom workout template builder.
- History UI beyond the finish handoff.
- Public discovery/copy flows.
- Server-side changes to `finishWorkoutSession` beyond the existing Milestone 1 implementation.
- Live production deployment of Cloud Functions. This remains a documented gate before production release of M6.

## Architecture

```text
Workouts tab
  -> GuidedWorkoutSection
    -> GuidedWorkoutViewModel
      -> GuidedWorkoutUseCases
        -> GuidedWorkoutRepository
          -> local active-session storage
          -> finishWorkoutSession backend boundary
```

Layer rules:

- Domain owns session models, set completion, rest timer, summary, and finish payload construction.
- Data owns local persistence and backend finish submission.
- Presentation owns selection UI, active workout UI, timer display, status states, and user actions.
- Existing catalog use cases remain the source for selectable exercises.

## Platform Decisions

| Platform | Local persistence | Finish transport | Notes |
|---|---|---|---|
| Web | `localStorage` | Firebase Functions `httpsCallable` with `australia-southeast1` region | Uses existing Firebase web SDK |
| iOS | `UserDefaults` encoded JSON | Direct HTTPS callable endpoint with Firebase ID token | Avoids adding a new Functions package dependency before review |
| Android | `SharedPreferences` encoded JSON | Direct HTTPS callable endpoint with Firebase ID token | Avoids adding a new Functions dependency before review |

## Finish Contract

All platforms submit the same payload shape:

```json
{
  "sessionId": "guided_...",
  "shareVisibility": "private",
  "finalSession": {
    "id": "guided_...",
    "name": "3 exercise workout",
    "type": "gym",
    "source": "guided",
    "dateStr": "2026-06-30",
    "startedAt": "...",
    "completedAt": "...",
    "durationSeconds": 900,
    "totalVolumeKg": 4200,
    "points": 40,
    "exercises": [
      {
        "exerciseId": "goblet_squat",
        "nameSnapshot": "Goblet Squat",
        "order": 0,
        "primaryMusclesSnapshot": ["quads", "glutes"],
        "assetHashSnapshot": "sha256-...",
        "sets": [
          {
            "setNumber": 1,
            "reps": 10,
            "weightKg": 20,
            "restSeconds": 60,
            "completedAt": "..."
          }
        ]
      }
    ]
  }
}
```

`finishWorkoutSession` remains the trusted writer for PRs, activity logs, feed mirrors, and public workout documents.

## Offline And Retry Strategy

- Active session state is saved after every set edit, set completion, and rest timer tick.
- A completed workout can be submitted only when `finishWorkoutSession` is reachable.
- If finish submission fails, the final payload is saved as `pendingFinish`.
- User can retry pending sync without rebuilding the session.
- User can discard an active workout before finish.

## Risks

| Risk | Handling |
|---|---|
| Cloud Function not deployed | Documented as a hard pre-release gap in `KNOWN_GAPS.md`; clients are wired but not production-smoke-tested |
| Direct HTTPS callable shape differs from SDK wrapper behavior | Payload is wrapped as `{ data: payload }`; Claude should review whether native Firebase Functions SDK should replace direct HTTPS before release |
| Local timer persistence writes frequently | Acceptable for MVP; can throttle persistence later if performance data requires |
| Guided workout state-machine regressions | Native guided domain/ViewModel tests now cover start, set completion, finish payload filtering, pending finish, and retry cleanup; live timer/background QA remains a release QA item |
| Catalog not live-seeded | Flow can render empty state; live seed remains separate coordination |

## Acceptance Criteria

- Web tests pass for guided session model behavior.
- Web production build succeeds.
- iOS Debug build succeeds.
- Android Debug build succeeds.
- Active workout state survives local reload/backgrounding by design.
- Rest timer auto-starts after set completion.
- Finish payload includes `assetHashSnapshot` per exercise.
- Failed finish saves pending payload and exposes retry.
- Native guided domain/ViewModel tests pass on iOS and Android.
- Presentation/ViewModel layers do not import Firestore SDKs.
- Quick Log/current training journal remains available below Workouts sections.
