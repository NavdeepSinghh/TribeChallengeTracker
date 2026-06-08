## Home Dashboard

Purpose: show the user’s current progress at a glance.

Shared behavior:

- Streak, total points, and days active stats.
- Activity breakdown by type.
- Calendar/history view with activity color cues.
- Challenge stats card that navigates to Challenges.
- Progress sharing entry points.

Release checks:

- Logged activity updates points, streak, days active, and calendar.
- Tapping a historical date shows the day’s recorded activity.
- Empty history states render without crashing.

## Activity Logging

Purpose: manually record daily activity and optionally import wearable activity.

Shared behavior:

- Activity type selection.
- Duration/distance/intensity where applicable.
- Points calculation and day history storage.
- Running list of activities logged in the current session.
- Badge checks after logs.

Platform notes:

- Web can use browser/runtime capabilities and Capacitor when wrapped.
- iOS imports Apple Health workouts and supports HealthKit auto-import.
- Android imports Health Connect activity and supports WorkManager auto-sync.

Release checks:

- Duplicate activity IDs are not double-saved.
- Saving updates Firestore day logs and profile stats.
- Health sync permissions fail gracefully when unavailable.
