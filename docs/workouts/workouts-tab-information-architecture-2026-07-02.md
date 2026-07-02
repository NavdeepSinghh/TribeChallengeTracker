# Workouts Tab Information Architecture

Date: 2026-07-02

## Product Intent

Keep the Workouts tab as a calm training hub, not a catch-all feed. The tab should help the user answer one question quickly:

> What training action should I take next?

The main tab should show only high-value entry points. Detail-heavy features live inside focused subflows.

## Top-Level Workouts Hub

The Workouts tab should contain:

1. Compact training snapshot
   - Points
   - Current streak
   - Active days

2. Primary action
   - Start workout
   - Quick Log as a secondary low-friction action

3. Entry points
   - Training plans
   - Progress
   - Explore

The hub should not show every workout feature at once. It should not stack guided workouts, plans, history, public discovery, exercise library, journal, and activity breakdown in one long scroll.

## Subflows

### Start Workout

Purpose: begin a guided workout with minimal decision fatigue.

Contains:
- Exercise selection
- Active guided session
- Sets, reps, weight
- Rest timer
- Finish summary
- Auto-log to TribeLog feed

### Training Plans

Purpose: answer "what should I follow next?"

Contains:
- Active plan status
- Today's planned workout
- Plan browse/enroll
- Skip/swap/frequency controls
- Plan progress

### Progress

Purpose: review performance without mixing it into workout selection.

Contains internal modes:
- Training snapshot
- History: workout history, PRs, volume trends, future progressive overload insight card
- Journal: manual training notes and routine handoff
- Breakdown: activity type breakdown

### Explore

Purpose: discovery and learning.

Contains segmented sub-tabs:
- Exercises: official library, demos, muscle maps, form cues
- Tribe workouts: public/community workouts, copy with attribution

## UX Rules

- One primary action on the hub: Start workout.
- Quick Log remains visible but secondary.
- No feature should appear twice on the hub and inside a subflow.
- Community/social discovery lives under Explore, not on the hub.
- Historical/analytical information lives under Progress.
- Training plan management lives under Training Plans.
- Challenges, badges, feed, and profile remain in their own app areas.

## Engagement Rationale

This structure keeps cognitive load low while still supporting deep engagement:

- New users see an obvious next action.
- Returning users can jump straight into their current training mode.
- Power users still have library, history, public workouts, and plan controls.
- Future AI recommendations can sit above the primary action without crowding the tab.

## AI Layer Slot

When the AI workout coach is introduced, it should appear as a compact recommendation module on the hub:

- "Recommended next: Lower body strength"
- "Why: You trained upper push twice this week and legs are fresh."
- Actions: Start, Swap, Explain

The AI module should route into existing subflows rather than creating a fifth top-level section.

## Cross-Platform Parity Target

Web, iOS, and Android should use the same navigation model:

```
Workouts Hub
  -> Start Workout
  -> Training Plans
  -> Progress
  -> Explore
      -> Exercises
      -> Tribe Workouts
```

Each platform can use native navigation components, but the entry points and ownership boundaries should remain the same.

## Web Code Structure

The web implementation mirrors the product flow:

```
src/app/BoardTab.jsx
  -> flow state, use-case wiring, active subflow selection

src/workouts/presentation/tab/
  hub/
    WorkoutsHub.jsx
    PrimaryWorkoutAction.jsx
    WorkoutEntryCard.jsx
  start/
    StartWorkoutFlow.jsx
  plans/
    TrainingPlansFlow.jsx
  progress/
    ProgressFlow.jsx
    ProgressModeTabs.jsx
    panels/
      ActivityBreakdownPanel.jsx
  explore/
    ExploreFlow.jsx
    ExploreModeTabs.jsx
  shared/
    WorkoutFlowHeader.jsx
    WorkoutSnapshotStrip.jsx
    workoutTabButtonStyles.js
    workoutTabFlowCopy.js
```

`BoardTab.jsx` should stay thin. If a subflow grows, add files inside that subflow folder rather than expanding `BoardTab.jsx`.
